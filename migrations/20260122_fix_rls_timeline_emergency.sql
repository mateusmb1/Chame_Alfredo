-- Migration: Correção Emergencial de RLS - Timeline e Leads
-- Data: 2026-01-22
-- Descrição: Este script resolve o erro de violação de RLS na tabela order_timeline
--            ao capturar leads anonimamente pela Landing Page.

-- 1. Garantir que a função de auditoria seja SECURITY DEFINER
-- O parâmetro SECURITY DEFINER faz com que a função rode com as permissões do criador (postgres),
-- ignorando políticas de RLS na tabela de destino (order_timeline).
CREATE OR REPLACE FUNCTION public.fn_capture_order_changes()
RETURNS TRIGGER AS $$
DECLARE
    audit_action text;
    old_data jsonb;
    new_data jsonb;
    v_changed_by text;
BEGIN
    -- Capturar o ID do usuário de forma segura
    BEGIN
        v_changed_by := current_setting('request.jwt.claim.sub', true);
    EXCEPTION WHEN OTHERS THEN
        v_changed_by := 'anonymous';
    END;

    IF (v_changed_by IS NULL OR v_changed_by = '') THEN
        v_changed_by := 'anonymous';
    END IF;

    IF (TG_OP = 'INSERT') THEN
        audit_action := 'created';
        new_data := to_jsonb(NEW);
        old_data := null;
    ELSIF (TG_OP = 'UPDATE') THEN
        audit_action := 'updated';
        new_data := to_jsonb(NEW);
        old_data := to_jsonb(OLD);
        
        -- Detectar mudança específica de status
        IF (OLD.status IS DISTINCT FROM NEW.status) THEN
            audit_action := 'status_changed';
        END IF;
    END IF;

    -- Insert com bypass de RLS via SECURITY DEFINER
    INSERT INTO public.order_timeline (order_id, action, old_value, new_value, changed_by)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        audit_action,
        old_data,
        new_data,
        v_changed_by
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Corrigir políticas de RLS na order_timeline
-- Caso a função falhe ou não rode como owner, permitimos inserção explícita.
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Timeline Insert All" ON public.order_timeline;
CREATE POLICY "Timeline Insert All" ON public.order_timeline
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Adicionar SELECT para anon poder ver (opcional, mas evita erros em RETURNING)
DROP POLICY IF EXISTS "Timeline Select All" ON public.order_timeline;
CREATE POLICY "Timeline Select All" ON public.order_timeline
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. Garantir permissões de uso nas sequências e tabelas auxiliares
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.order_timeline TO anon, authenticated;
GRANT SELECT ON public.order_timeline TO anon, authenticated;

-- 4. Protocolo: Garantir que usuários anônimos possam ler/escrever no contador diário
-- Isso é necessário para que o trigger trg_set_protocol funcione.
ALTER TABLE public.daily_protocol_counters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Counters All Access" ON public.daily_protocol_counters;
CREATE POLICY "Counters All Access" ON public.daily_protocol_counters
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

GRANT ALL ON public.daily_protocol_counters TO anon, authenticated;

-- 5. Recriar o trigger com o caminho explícito
DROP TRIGGER IF EXISTS trg_order_audit ON public.orders;
CREATE TRIGGER trg_order_audit
    AFTER INSERT OR UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE PROCEDURE public.fn_capture_order_changes();

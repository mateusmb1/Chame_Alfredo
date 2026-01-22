-- Migration: Correção de RLS e Funções para Captura de Leads
-- Data: 2026-01-21
-- Descrição: Ajusta permissões de auditoria e protocolo para permitir 
--            que leads sejam salvos anonimamente via Landing Page.

-- 1. Ajustar o ENUM de status para incluir 'pendente' se necessário
-- Isso garante compatibilidade com versões anteriores do código
ALTER TYPE order_status_enum ADD VALUE IF NOT EXISTS 'pendente';

-- 2. Tornar a função de auditoria "Security Definer" 
-- Isso permite que ela grave logs (order_timeline) mesmo que o usuário final (anon)
-- não tenha acesso direto de escrita à tabela de timeline.
CREATE OR REPLACE FUNCTION fn_capture_order_changes()
RETURNS TRIGGER AS $$
DECLARE
    audit_action text;
    old_data jsonb;
    new_data jsonb;
BEGIN
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

    INSERT INTO order_timeline (order_id, action, old_value, new_value, changed_by)
    VALUES (
        COALESCE(NEW.id, OLD.id),
        audit_action,
        old_data,
        new_data,
        COALESCE(current_setting('request.jwt.claim.sub', true), 'system')
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tornar a função de protocolo "Security Definer" 
-- Para garantir que o contador diário funcione mesmo para usuários anônimos
-- sem que eles precisem de permissão na tabela 'daily_protocol_counters'.
CREATE OR REPLACE FUNCTION fn_get_protocol() RETURNS text AS $$
DECLARE
    today date := current_date;
    val integer;
BEGIN
    -- Insere o dia se não existir (safe concurrency com ON CONFLICT)
    INSERT INTO daily_protocol_counters (date_key, current_val)
    VALUES (today, 0)
    ON CONFLICT (date_key) DO NOTHING;

    -- Incrementa e retorna o valor
    UPDATE daily_protocol_counters
    SET current_val = current_val + 1
    WHERE date_key = today
    RETURNING current_val INTO val;

    -- Formata: YYYYMMDD-0000X
    RETURN to_char(today, 'YYYYMMDD') || '-' || lpad(val::text, 5, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar política de inserção na order_timeline para permitir a auditoria automática
-- Sem essa política, o trigger fn_capture_order_changes falha ao tentar gravar.
DROP POLICY IF EXISTS "Timeline Insert All" ON order_timeline;
CREATE POLICY "Timeline Insert All" ON order_timeline
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 5. Garantir que a tabela orders tenha a coluna client_name (caso tenha sido removida)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_name TEXT;

-- 6. Garantir que a tabela clients tenha as colunas usadas no formulário avançado
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

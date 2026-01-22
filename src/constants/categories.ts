// Definição Central de Categorias de Inventário
// Baseado na proposta: docs/📊 Estrutura de Categorização Propo.txt

export type InventoryCategory =
    | 'VIDEOMONITORAMENTO / CFTV'
    | 'ELETRIFICAÇÃO & CONTROLE DE ACESSO'
    | 'COMPONENTES & CABOS'
    | 'PROTEÇÃO FÍSICA'
    | 'TELEFONIA & PORTARIA'
    | 'ALARME & SEGURANÇA'
    | 'REDE & COMUNICAÇÃO'
    | 'FONTE & ENERGIA'
    | 'MATERIAL DE CONSTRUÇÃO & FERRAGENS'
    | 'PERIFÉRICOS & ACESSÓRIOS DIVERSOS'
    | 'SERVIÇOS / KITS COMPLETOS'
    | 'OUTROS';

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
    'VIDEOMONITORAMENTO / CFTV',
    'ELETRIFICAÇÃO & CONTROLE DE ACESSO',
    'COMPONENTES & CABOS',
    'PROTEÇÃO FÍSICA',
    'TELEFONIA & PORTARIA',
    'ALARME & SEGURANÇA',
    'REDE & COMUNICAÇÃO',
    'FONTE & ENERGIA',
    'MATERIAL DE CONSTRUÇÃO & FERRAGENS',
    'PERIFÉRICOS & ACESSÓRIOS DIVERSOS',
    'SERVIÇOS / KITS COMPLETOS',
    'OUTROS'
];

// Mapa de Cores Semânticas para Chips Visualmente Distintos
export const CATEGORY_COLORS: Record<InventoryCategory, string> = {
    'VIDEOMONITORAMENTO / CFTV': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'ELETRIFICAÇÃO & CONTROLE DE ACESSO': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'COMPONENTES & CABOS': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'PROTEÇÃO FÍSICA': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
    'TELEFONIA & PORTARIA': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    'ALARME & SEGURANÇA': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'REDE & COMUNICAÇÃO': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'FONTE & ENERGIA': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'MATERIAL DE CONSTRUÇÃO & FERRAGENS': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'PERIFÉRICOS & ACESSÓRIOS DIVERSOS': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    'SERVIÇOS / KITS COMPLETOS': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'OUTROS': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
};

// Palavras-chave para Auto-Categorização (Heurística Simples)
export const CATEGORY_KEYWORDS: Record<string, InventoryCategory> = {
    'camera': 'VIDEOMONITORAMENTO / CFTV',
    'câmera': 'VIDEOMONITORAMENTO / CFTV',
    'dvr': 'VIDEOMONITORAMENTO / CFTV',
    'nvr': 'VIDEOMONITORAMENTO / CFTV',
    'lens': 'VIDEOMONITORAMENTO / CFTV',
    'motor': 'ELETRIFICAÇÃO & CONTROLE DE ACESSO',
    'fechadura': 'ELETRIFICAÇÃO & CONTROLE DE ACESSO',
    'trava': 'ELETRIFICAÇÃO & CONTROLE DE ACESSO',
    'cabo': 'COMPONENTES & CABOS',
    'fio': 'COMPONENTES & CABOS',
    'conector': 'COMPONENTES & CABOS',
    'bne': 'COMPONENTES & CABOS',
    'cerca': 'PROTEÇÃO FÍSICA',
    'concertina': 'PROTEÇÃO FÍSICA',
    'haste': 'PROTEÇÃO FÍSICA',
    'interfone': 'TELEFONIA & PORTARIA',
    'telefone': 'TELEFONIA & PORTARIA',
    'sirene': 'ALARME & SEGURANÇA',
    'sensor': 'ALARME & SEGURANÇA',
    'alarme': 'ALARME & SEGURANÇA',
    'botoeira': 'ALARME & SEGURANÇA',
    'switch': 'REDE & COMUNICAÇÃO',
    'roteador': 'REDE & COMUNICAÇÃO',
    'antena': 'REDE & COMUNICAÇÃO',
    'modem': 'REDE & COMUNICAÇÃO',
    'fonte': 'FONTE & ENERGIA',
    'bateria': 'FONTE & ENERGIA',
    'nobreak': 'FONTE & ENERGIA',
    'cimento': 'MATERIAL DE CONSTRUÇÃO & FERRAGENS',
    'areia': 'MATERIAL DE CONSTRUÇÃO & FERRAGENS',
    'parafuso': 'MATERIAL DE CONSTRUÇÃO & FERRAGENS',
    'mouse': 'PERIFÉRICOS & ACESSÓRIOS DIVERSOS',
    'teclado': 'PERIFÉRICOS & ACESSÓRIOS DIVERSOS',
    'suporte': 'PERIFÉRICOS & ACESSÓRIOS DIVERSOS',
    'instalação': 'SERVIÇOS / KITS COMPLETOS',
    'configuração': 'SERVIÇOS / KITS COMPLETOS',
    'kit': 'SERVIÇOS / KITS COMPLETOS'
};

export const normalizeCategory = (name: string, currentCategory?: string): string => {
    if (currentCategory && INVENTORY_CATEGORIES.includes(currentCategory as any)) {
        return currentCategory;
    }

    const lowerName = name.toLowerCase();
    for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
        if (lowerName.includes(keyword)) {
            return category;
        }
    }
    return 'OUTROS';
};

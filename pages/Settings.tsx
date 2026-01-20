import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../src/lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { Upload, Save, X, Loader2, Database } from 'lucide-react';
import { DataImportModal } from '../components/DataImportModal';

interface CompanySettings {
  id?: string;
  company_name: string;
  cnpj: string;
  email: string;
  phone: string;
  logo_url: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
}

const defaultSettings: CompanySettings = {
  company_name: '',
  cnpj: '',
  email: '',
  phone: '',
  logo_url: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: ''
};

const Settings: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<CompanySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching settings:', error);
        showToast('error', 'Erro ao carregar configurações');
      } else if (data) {
        setSettings(data);
        setOriginalSettings(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let result;

      if (settings.id) {
        // Update existing
        result = await supabase
          .from('company_settings')
          .update({
            company_name: settings.company_name,
            cnpj: settings.cnpj,
            email: settings.email,
            phone: settings.phone,
            logo_url: settings.logo_url,
            cep: settings.cep,
            street: settings.street,
            number: settings.number,
            complement: settings.complement,
            city: settings.city,
            state: settings.state,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
      } else {
        // Insert new
        result = await supabase
          .from('company_settings')
          .insert([{
            company_name: settings.company_name,
            cnpj: settings.cnpj,
            email: settings.email,
            phone: settings.phone,
            logo_url: settings.logo_url,
            cep: settings.cep,
            street: settings.street,
            number: settings.number,
            complement: settings.complement,
            city: settings.city,
            state: settings.state
          }])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      showToast('success', 'Configurações salvas com sucesso!');
      setOriginalSettings({ ...settings });
      if (result.data) {
        setSettings(result.data);
        setOriginalSettings(result.data);
      }

    } catch (err: any) {
      console.error('Error saving settings:', err);
      showToast('error', `Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings({ ...originalSettings });
    showToast('info', 'Alterações descartadas');
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'A imagem deve ter no máximo 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `company-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        // If bucket doesn't exist, try creating it (or use 'orders' bucket as fallback)
        if (uploadError.message.includes('Bucket not found')) {
          // Fallback to orders bucket
          const { error: fallbackError } = await supabase.storage
            .from('orders')
            .upload(`logos/${fileName}`, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (fallbackError) throw fallbackError;

          const { data: urlData } = supabase.storage
            .from('orders')
            .getPublicUrl(`logos/${fileName}`);

          setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }));
          showToast('success', 'Logo atualizado com sucesso!');
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      showToast('success', 'Logo atualizado com sucesso!');

    } catch (err: any) {
      console.error('Error uploading logo:', err);
      showToast('error', `Erro ao fazer upload: ${err.message}`);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setSettings(prev => ({ ...prev, logo_url: '' }));
    showToast('info', 'Logo removido. Salve para confirmar.');
  };

  const handleChange = (field: keyof CompanySettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 lg:p-10">
      <div className="mx-auto max-w-4xl w-full">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Dados da Empresa</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Gerencie as informações de contato, endereço e logotipo da sua empresa.
            </p>
          </div>
          <div className="flex items-end gap-2 flex-wrap">
            <button
              onClick={handleCancel}
              disabled={!hasChanges || isSaving}
              className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">Cancelar</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="truncate">Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logo Card */}
        <div className="mb-8">
          <div className="flex flex-col items-stretch justify-start rounded-xl sm:flex-row sm:items-center bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-6">
              <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4 sm:mb-2">
                Logotipo da Empresa
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  Faça o upload do logotipo que será exibido nas comunicações e na plataforma.
                </p>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Logo Preview */}
                  <div className="relative">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 border border-slate-200 dark:border-gray-700 flex items-center justify-center bg-slate-100 dark:bg-gray-800"
                      style={settings.logo_url ? { backgroundImage: `url("${settings.logo_url}")` } : {}}
                    >
                      {!settings.logo_url && (
                        <Upload className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    {settings.logo_url && (
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remover logo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span className="truncate">Fazer Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
          {/* Contact Information Section */}
          <div className="p-6 border-b border-slate-200 dark:border-gray-800">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1">
              Informações de Contato
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Atualize os detalhes de contato da sua empresa.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Nome da Empresa</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.company_name}
                  onChange={handleChange('company_name')}
                  placeholder="Nome da Empresa LTDA"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">CNPJ</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.cnpj}
                  onChange={handleChange('cnpj')}
                  placeholder="00.000.000/0001-00"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">E-mail de Contato</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  type="email"
                  value={settings.email}
                  onChange={handleChange('email')}
                  placeholder="contato@empresa.com"
                />
              </label>
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Telefone</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  type="tel"
                  value={settings.phone}
                  onChange={handleChange('phone')}
                  placeholder="(11) 99999-9999"
                />
              </label>
            </div>
          </div>
          {/* Address Section */}
          <div className="p-6">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1">Endereço</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Informe o endereço comercial principal.</p>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-5">
              <label className="flex flex-col md:col-span-2">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">CEP</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.cep}
                  onChange={handleChange('cep')}
                  placeholder="01001-000"
                />
              </label>
              <label className="flex flex-col md:col-span-4">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Logradouro</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.street}
                  onChange={handleChange('street')}
                  placeholder="Praça da Sé"
                />
              </label>
              <label className="flex flex-col md:col-span-2">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Número</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.number}
                  onChange={handleChange('number')}
                  placeholder="100"
                />
              </label>
              <label className="flex flex-col md:col-span-4">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Complemento</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.complement}
                  onChange={handleChange('complement')}
                  placeholder="Sala 101"
                />
              </label>
              <label className="flex flex-col md:col-span-3">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Cidade</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.city}
                  onChange={handleChange('city')}
                  placeholder="São Paulo"
                />
              </label>
              <label className="flex flex-col md:col-span-3">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal pb-2">Estado</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#18202F] focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal leading-normal"
                  value={settings.state}
                  onChange={handleChange('state')}
                  placeholder="SP"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Data Import Section */}
        <div className="mt-8 rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Importação de Dados
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Importe clientes, materiais e serviços do sistema Agenda Boa.
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-medium leading-normal hover:from-primary/90 hover:to-primary/70 transition-all shadow-md hover:shadow-lg"
              >
                <Upload className="w-4 h-4" />
                <span>Importar do Agenda Boa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default Settings;

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../src/lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';
import { Upload, Save, X, Loader2, Database, Lock, Key, Shield } from 'lucide-react';
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
  const { companyProfile, updateCompanyProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<CompanySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Security State
  const { updateTechnician, checkUsernameAvailability } = useApp();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [securityForm, setSecurityForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Load current user
  useEffect(() => {
    const userJson = localStorage.getItem('alfredo_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        setSecurityForm(prev => ({ ...prev, username: user.username }));
      } catch (e) {
        console.error('Error parsing user from local storage', e);
      }
    }
  }, []);

  // Synchronize with context data
  useEffect(() => {
    if (companyProfile) {
      const profileData = {
        id: companyProfile.id,
        company_name: companyProfile.company_name || '',
        cnpj: companyProfile.cnpj || '',
        email: companyProfile.email || '',
        phone: companyProfile.phone || '',
        logo_url: companyProfile.logo_url || '',
        cep: companyProfile.cep || '',
        street: companyProfile.street || '',
        number: companyProfile.number || '',
        complement: companyProfile.complement || '',
        city: companyProfile.city || '',
        state: companyProfile.state || ''
      };
      setSettings(profileData);
      setOriginalSettings(profileData);
      setIsLoading(false);
    }
  }, [companyProfile]);

  // Track changes
  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCompanyProfile(settings);
      showToast('success', 'Configurações salvas com sucesso!');
      setOriginalSettings({ ...settings });
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

  const handleSecurityChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveSecurity = async () => {
    if (!currentUser?.id) return;
    if (securityForm.password && securityForm.password !== securityForm.confirmPassword) {
      showToast('error', 'As senhas não coincidem!');
      return;
    }

    setIsSavingSecurity(true);
    try {
      // Check availability if username changed
      if (securityForm.username !== currentUser.username) {
        // Find existing tech with same username but different ID
        const tech = await checkUsernameAvailability(securityForm.username, currentUser.id);
        if (!tech) { // checkUsernameAvailability returns false if username exists? Wait, let's check AppContext.
          // AppContext: return !exists. So if true, it IS available.
          // BUT, checkUsernameAvailability implementation: return !exists. 
          // Let's re-read the implementation in AppContext carefully.
          // const exists = technicians.some(t => t.username... && t.id !== excludeId).
          // return !exists.
          // So if it returns false, it means it Exists.
        }

        const isAvailable = await checkUsernameAvailability(securityForm.username, currentUser.id);

        if (!isAvailable) {
          showToast('error', 'Este nome de usuário já está em uso.');
          setIsSavingSecurity(false);
          return;
        }
      }

      const updates: any = { username: securityForm.username };
      if (securityForm.password) {
        updates.password = securityForm.password;
      }

      // AppContext returns { error } object
      const result = await updateTechnician(currentUser.id, updates);

      if (result && result.error) {
        throw result.error;
      }

      // Update local storage
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('alfredo_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setSecurityForm(prev => ({ ...prev, password: '', confirmPassword: '' }));

      showToast('success', 'Dados de acesso atualizados com sucesso!');
    } catch (err: any) {
      console.error('Error updating security:', err);
      showToast('error', 'Erro ao atualizar dados de acesso.');
    } finally {
      setIsSavingSecurity(false);
    }
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
      <div className="mx-auto max-w-6xl w-full">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Column: Logo & Import */}
          <div className="lg:col-span-4 space-y-8">
            {/* Logo Card */}
            <div className="rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800 h-fit">
              <div className="p-6">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
                  Logotipo
                </p>
                <div className="flex flex-col items-center gap-6">
                  {/* Logo Preview */}
                  <div className="relative">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-32 border border-slate-200 dark:border-gray-700 flex items-center justify-center bg-slate-100 dark:bg-gray-800 shadow-sm"
                      style={settings.logo_url ? { backgroundImage: `url("${settings.logo_url}")` } : {}}
                    >
                      {!settings.logo_url && (
                        <Upload className="w-10 h-10 text-slate-400" />
                      )}
                    </div>
                    {settings.logo_url && (
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                        title="Remover logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="w-full space-y-3">
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center px-2">
                      Upload do logotipo para comunicações e relatórios.
                    </p>
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
                      className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2 shadow-sm"
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

            {/* Data Import Card */}
            <div className="rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
              <div className="p-6">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Privacidade & Dados
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Importe seus dados legados do Agenda Boa para o Alfredo.
                </p>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium leading-normal hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importar Agenda Boa</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Information Forms */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
              {/* Contact Information Section */}
              <div className="p-8 border-b border-slate-200 dark:border-gray-800">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1">
                  Informações de Contato
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                  Detalhes principais de identificação e contato.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Nome da Empresa</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.company_name}
                      onChange={handleChange('company_name')}
                      placeholder="Nome da Empresa LTDA"
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">CNPJ</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.cnpj}
                      onChange={handleChange('cnpj')}
                      placeholder="00.000.000/0001-00"
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">E-mail de Contato</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      type="email"
                      value={settings.email}
                      onChange={handleChange('email')}
                      placeholder="contato@empresa.com"
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Telefone</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      type="tel"
                      value={settings.phone}
                      onChange={handleChange('phone')}
                      placeholder="(11) 99999-9999"
                    />
                  </label>
                </div>
              </div>

              {/* Address Section */}
              <div className="p-8">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-1">Endereço</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Informações de localização da sede.</p>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-8 gap-y-6">
                  <label className="flex flex-col md:col-span-2">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">CEP</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.cep}
                      onChange={handleChange('cep')}
                      placeholder="01001-000"
                    />
                  </label>
                  <label className="flex flex-col md:col-span-4">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Logradouro</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.street}
                      onChange={handleChange('street')}
                      placeholder="Praça da Sé"
                    />
                  </label>
                  <label className="flex flex-col md:col-span-2">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Número</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.number}
                      onChange={handleChange('number')}
                      placeholder="100"
                    />
                  </label>
                  <label className="flex flex-col md:col-span-4">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Complemento</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.complement}
                      onChange={handleChange('complement')}
                      placeholder="Sala 101"
                    />
                  </label>
                  <label className="flex flex-col md:col-span-3">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Cidade</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.city}
                      onChange={handleChange('city')}
                      placeholder="São Paulo"
                    />
                  </label>
                  <label className="flex flex-col md:col-span-3">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Estado</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base font-normal leading-normal transition-all"
                      value={settings.state}
                      onChange={handleChange('state')}
                      placeholder="SP"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section (Only for authenticated users) */}
        {currentUser && (
          <div className="mx-auto max-w-6xl w-full mt-4">
            <div className="rounded-xl bg-white dark:bg-[#18202F] border border-slate-200 dark:border-gray-800">
              <div className="p-8 border-b border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-brand-orange" />
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
                    Segurança de Acesso
                  </h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                  Altere seu login e senha de acesso ao sistema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Usuário (Login)</p>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-10 pr-4 text-base font-normal leading-normal transition-all"
                        value={securityForm.username}
                        onChange={handleSecurityChange('username')}
                        placeholder="Ex: admin"
                      />
                    </div>
                  </label>

                  {/* Spacer for grid alignment if needed, or leave empty */}
                  <div className="hidden md:block"></div>

                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Nova Senha</p>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-10 pr-4 text-base font-normal leading-normal transition-all"
                        type="password"
                        value={securityForm.password}
                        onChange={handleSecurityChange('password')}
                        placeholder="••••••••"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Confirmar Senha</p>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131b29] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-10 pr-4 text-base font-normal leading-normal transition-all"
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange('confirmPassword')}
                        placeholder="••••••••"
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSaveSecurity}
                    disabled={isSavingSecurity}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-slate-900 text-white text-sm font-medium leading-normal hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {isSavingSecurity ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Atualizando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Atualizar Credenciais</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="h-10"></div>

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

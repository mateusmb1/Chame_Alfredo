import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div class="layout-container flex h-full grow flex-col">
        <div class="flex flex-1 justify-center items-center p-4 lg:p-0">
          <div class="layout-content-container flex flex-row max-w-6xl w-full bg-white dark:bg-[#1a2230] shadow-xl rounded-xl overflow-hidden min-h-96 sm:min-h-[520px] md:min-h-[560px] lg:min-h-[600px]">
            {/* Left Column - Branding */}
            <div class="hidden lg:flex flex-col w-1/2 bg-slate-100 dark:bg-[#131b29] p-12 justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary text-4xl">dynamic_form</span>
                  <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200">Plataforma Central</h2>
                </div>
              </div>
              <div class="flex flex-col gap-8">
                <div class="w-full bg-center bg-no-repeat bg-cover aspect-video rounded-lg shadow-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVCmEqmN486GB9LuMvCtipNsJ174zfxSTiPgV8_LfHTS88alOkJWaVH4UJVjDPLH2y0up7Avmdq72Kw-Gjem9m8YJKRU8S8Fj2P3Pf-lSNo4cFcdX1JvXEqH9v1742mjyGz9GtBQG8gQcQ3l9DvnBYc2VtqzcdRfY2HYd3-UDINvlWBWYvNZ05Zr54UeuvGYJQnWiTuc70P7098m_qxAYe8fZ7dFaEBmshCyRuFt4GkQLSRECEccTrl5GqMtBmUwzq08sZ06mgPAn0")' }}></div>
                <div class="flex flex-col gap-2">
                  <h1 class="text-slate-800 dark:text-slate-100 tracking-tight text-3xl font-bold leading-tight text-left">Otimize suas operações.</h1>
                  <p class="text-slate-600 dark:text-slate-400 text-lg font-normal leading-normal">Centralize seu sucesso com nossa plataforma completa para gestão de serviços, estoque e clientes.</p>
                </div>
              </div>
              <div class="text-slate-500 dark:text-slate-400 text-sm">
                © 2024 Plataforma Central. Todos os direitos reservados.
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div class="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              <div class="flex flex-col max-w-md mx-auto w-full">
                <div class="flex flex-col mb-8">
                  <h1 class="text-[#0d121b] dark:text-slate-100 tracking-light text-[32px] font-bold leading-tight text-left pb-1">Bem-vindo de volta!</h1>
                  <p class="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">Faça login para continuar ou crie uma nova conta.</p>
                </div>
                
                <div class="flex mb-6">
                  <div class="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1 w-full">
                    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal transition-all duration-200">
                      <span class="truncate">Login</span>
                      <input type="radio" name="auth-toggle" value="Login" class="invisible w-0" defaultChecked />
                    </label>
                    <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal transition-all duration-200">
                      <span class="truncate">Registrar-se</span>
                      <input type="radio" name="auth-toggle" value="Registrar-se" class="invisible w-0" />
                    </label>
                  </div>
                </div>

                <form onSubmit={handleLogin} class="flex flex-col gap-4">
                  <label class="flex flex-col w-full">
                    <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">E-mail ou Usuário</p>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-xl">person</span>
                      <input type="text" placeholder="Digite seu e-mail ou nome de usuário" class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-10 pr-4 text-base font-normal leading-normal" />
                    </div>
                  </label>
                  
                  <label class="flex flex-col w-full">
                    <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Senha</p>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-xl">lock</span>
                      <input type="password" placeholder="Digite sua senha" class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-10 pr-10 text-base font-normal leading-normal" />
                      <button type="button" class="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400">
                        <span class="material-symbols-outlined text-xl">visibility_off</span>
                      </button>
                    </div>
                  </label>

                  <div class="flex justify-end mt-1">
                    <a href="#" class="text-sm font-medium text-primary hover:underline">Esqueci minha senha</a>
                  </div>

                  <button type="submit" class="flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow hover:bg-primary/90 h-12 px-4 py-2 w-full mt-4">
                    Entrar
                  </button>

                  <div class="relative my-4">
                    <div class="absolute inset-0 flex items-center">
                      <span class="w-full border-t border-slate-300 dark:border-slate-700"></span>
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                      <span class="bg-white dark:bg-[#1a2230] px-2 text-slate-500 dark:text-slate-400">Ou continue com</span>
                    </div>
                  </div>

                  <button type="button" class="flex items-center justify-center gap-3 whitespace-nowrap rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 h-12 px-4 py-2 w-full">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjSIO6o_FmbGvOYEgMOW9kKkSZv2zEpe0VAdMm3NdYdBX1giterjwz8ykPKpx2M2mbYrwYDJY_mwJjCVFRZUpddg-IbAAsciJZEoUTZKiHtESRfPPOF3ndJbwcJgwpiqON9onHRDYw7EdYRZOgFTFAlBaNMcLTrpqf7zc9AaCarH--bECSSwGOT1MsErLV3L7wEQ6au2LKW22cAa2gqQkNZ9Ak7NJcg4Os91TFuhF_M6n9hQ-4eEnSwQTmkqfCvK6aG5oJhI8JEAC0" alt="Google logo" class="h-5 w-5" />
                    <span>Entrar com Google</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

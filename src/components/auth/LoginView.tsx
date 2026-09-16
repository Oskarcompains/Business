import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileText,
  X,
  Send,
  ExternalLink,
  Users,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyTier } from '../../types';

export const LoginView: React.FC = () => {
  const { login, submitMembershipApplication } = useApp();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appForm, setAppForm] = useState({
    companyName: '',
    cif: '',
    sector: 'Tecnología & Digitalización',
    contactName: '',
    contactRole: '',
    email: '',
    phone: '',
    website: '',
    motivation: '',
    tierRequested: 'SOCIO_PREMIUM' as CompanyTier
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Por favor, introduce tu usuario o correo electrónico.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsSubmitting(false);
      if (!result.success && result.error) {
        setErrorMessage(result.error);
      }
    }, 300);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.companyName || !appForm.email || !appForm.contactName) return;

    submitMembershipApplication(appForm);
    setAppSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white relative overflow-hidden">
      
      {/* Ambient background glows with Osasuna Red & Navy Blue */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1a3268]/20 rounded-full blur-3xl pointer-events-none translate-y-1/3" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-[#18284e]/70">
        <div className="flex items-center gap-3">
          {/* Ibarbaso Crest Monogram */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-800 via-red-600 to-black p-0.5 shadow-lg shadow-red-950/60 overflow-hidden">
            <img 
              src="/ibarbaso-crest.jpg" 
              alt="Ibarbaso Crest" 
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-white text-base sm:text-lg">
                IBARBASO <span className="text-red-500 font-extrabold">BUSINESS CLUB</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-500/40">
                C.D. SOTO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5">
              Red Empresarial Privada & Ecosistema B2B
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-solicitar-ingreso-top"
            onClick={() => {
              setShowApplicationModal(true);
              setAppSubmitted(false);
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#101e40] hover:bg-[#162752] border border-[#20366b] text-slate-200 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>Solicitar Alta de Empresa</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-[#0c1630] border border-[#1b2f5d]">
            <Lock className="w-3 h-3 text-red-400" />
            <span>Acceso Restringido</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-xl mx-auto w-full">
        
        {/* Security / Private badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101f42] border border-[#1d356c] text-xs text-slate-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-semibold text-white">Plataforma Privada y Confidencial</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400 hidden xs:inline">Socios y Directivos Acreditados</span>
        </div>

        {/* Central Login Form Card */}
        <div className="w-full bg-[#0b152d]/95 border border-[#1b3164] rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-[#1e3b7b]" />

          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Portal de Acceso
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Introduce tus credenciales autorizadas para acceder a la gestión de empresas, eventos y usuarios del Club.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-600/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Error de acceso</p>
                <p className="text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  id="input-login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. admin o correo@empresa.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder:text-slate-500 transition outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder:text-slate-500 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1d346b] bg-[#070e20] text-red-600 focus:ring-red-500"
                />
                <span>Recordar sesión</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setForgotSent(false);
                }}
                className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-red-950/60 border border-red-500/40 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Pillar summary */}
          <div className="mt-6 pt-5 border-t border-[#182a54] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#080f22] border border-[#17274e]">
              <Building2 className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <p className="font-bold text-white">Empresas</p>
              <p className="text-[10px] text-slate-400">Directorio B2B</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#080f22] border border-[#17274e]">
              <CalendarDays className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <p className="font-bold text-white">Eventos</p>
              <p className="text-[10px] text-slate-400">Agenda y Pases</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#080f22] border border-[#17274e]">
              <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="font-bold text-white">Usuarios</p>
              <p className="text-[10px] text-slate-400">Censo Directivo</p>
            </div>
          </div>

          {/* Membership application trigger */}
          <div className="mt-5 pt-4 border-t border-[#182a54] text-center">
            <p className="text-xs text-slate-400">
              ¿Tu empresa aún no forma parte del Club?
            </p>
            <button
              id="btn-trigger-membership-modal"
              type="button"
              onClick={() => {
                setShowApplicationModal(true);
                setAppSubmitted(false);
              }}
              className="mt-1.5 text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-4 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Solicitar adhesión oficial de mi empresa</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-[#18284e]/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Ibarbaso Business Club</span>
          <span>•</span>
          <span className="text-red-400 font-semibold">C.D. Soto-Ibarbaso B2B Network</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Servidor Privado Activo
          </span>
          <span>Cifrado SSL 256-bit</span>
        </div>
      </footer>

      {/* MODAL: Forgot Password */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0b152d] border border-[#1b3164] rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#15254d] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Recuperación de Contraseña</h3>
              <p className="text-xs text-slate-300 mt-1">
                Introduce tu correo corporativo. Te enviaremos las instrucciones de restablecimiento validadas por el Club.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Instrucciones Enviadas</p>
                <p className="text-xs text-slate-300">
                  Hemos enviado las instrucciones a <strong>{forgotEmail}</strong>. Revisa tu bandeja de entrada.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Correo corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="tu.nombre@empresa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] focus:border-red-500 text-sm text-white placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL: Solicitar Adhesión de Empresa */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0b152d] border border-[#1b3164] rounded-3xl p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#15254d] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-500/30">
                Nuevo Miembro
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Solicitud de Adhesión al Club</h3>
              <p className="text-xs text-slate-300 mt-1">
                Completa los datos de tu compañía. El Comité Ejecutivo evaluará la solicitud para formalizar el alta de la empresa y sus representantes.
              </p>
            </div>

            {appSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#081226] border border-red-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Solicitud Recibida Correctamente</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Hemos registrado la solicitud de <strong>{appForm.companyName}</strong>. El equipo directivo del Club contactará con <strong>{appForm.contactName}</strong> para completar el proceso de alta.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                  >
                    Volver al Acceso
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Comercial Empresa *</label>
                    <input 
                      type="text"
                      required
                      value={appForm.companyName}
                      onChange={(e) => setAppForm({ ...appForm, companyName: e.target.value })}
                      placeholder="ej. Innova Navarra S.L."
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">CIF / NIF Corporativo</label>
                    <input 
                      type="text"
                      value={appForm.cif}
                      onChange={(e) => setAppForm({ ...appForm, cif: e.target.value })}
                      placeholder="B-31XXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Sector de Actividad</label>
                    <select
                      value={appForm.sector}
                      onChange={(e) => setAppForm({ ...appForm, sector: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white outline-none focus:border-red-500"
                    >
                      <option value="Tecnología & Digitalización">Tecnología & Digitalización</option>
                      <option value="Energía & Sostenibilidad">Energía & Sostenibilidad</option>
                      <option value="Construcción & Infraestructuras">Construcción & Infraestructuras</option>
                      <option value="Agroalimentario & Gastronomía">Agroalimentario & Gastronomía</option>
                      <option value="Banca, Inversión & Finanzas">Banca, Inversión & Finanzas</option>
                      <option value="Salud & Biotecnología">Salud & Biotecnología</option>
                      <option value="Logística & Transporte">Logística & Transporte</option>
                      <option value="Servicios Profesionales & Legal">Servicios Profesionales & Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Modalidad de Membresía</label>
                    <select
                      value={appForm.tierRequested}
                      onChange={(e) => setAppForm({ ...appForm, tierRequested: e.target.value as CompanyTier })}
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white outline-none focus:border-red-500"
                    >
                      <option value="SOCIO_PREMIUM">Socio Premium</option>
                      <option value="SOCIO_ESTANDAR">Socio Estándar</option>
                      <option value="PATROCINADOR_GOLD">Patrocinador Oficial Gold</option>
                      <option value="PATROCINADOR_SILVER">Patrocinador Silver</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Persona de Contacto *</label>
                    <input 
                      type="text"
                      required
                      value={appForm.contactName}
                      onChange={(e) => setAppForm({ ...appForm, contactName: e.target.value })}
                      placeholder="Nombre y apellidos"
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Cargo en la Empresa</label>
                    <input 
                      type="text"
                      value={appForm.contactRole}
                      onChange={(e) => setAppForm({ ...appForm, contactRole: e.target.value })}
                      placeholder="CEO, Director General, etc."
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email Corporativo *</label>
                    <input 
                      type="email"
                      required
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      placeholder="contacto@empresa.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono Directo</label>
                    <input 
                      type="tel"
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Motivación / Objetivos en el Club</label>
                  <textarea 
                    rows={2}
                    value={appForm.motivation}
                    onChange={(e) => setAppForm({ ...appForm, motivation: e.target.value })}
                    placeholder="Sinergias comerciales, networking, desarrollo corporativo..."
                    className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#182a54]">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-950/40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Solicitud</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Database,
  ArrowRight,
  ShieldCheck,
  Building2,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  getSpreadsheetMetadata, 
  fetchSheetValues, 
  parseCompaniesFromSheet, 
  parseEventsFromSheet, 
  extractSpreadsheetId,
  GoogleSheetMeta 
} from '../../services/sheetsService';
import { signInWithGoogleWorkspace, getGoogleAccessToken } from '../../lib/firebase';

interface GoogleSheetsSyncModalProps {
  mode: 'companies' | 'events';
  onClose: () => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({ mode, onClose }) => {
  const { addCompany, addEvent } = useApp();

  const [spreadsheetInput, setSpreadsheetInput] = useState('');
  const [activeToken, setActiveToken] = useState<string | null>(() => getGoogleAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [sheetMeta, setSheetMeta] = useState<GoogleSheetMeta | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  // Demo spreadsheet option to make it effortless to test immediately
  const handleUseDemoTemplate = () => {
    // Clean mock spreadsheet simulation or instructions
    setFeedback({
      type: 'info',
      message: 'Copia cualquier URL de tu Google Sheets personal o pega su ID. Las columnas recomendadas para ' + (mode === 'companies' ? 'Empresas son: Nombre, Sector, Categoría, Ciudad, Web, Empleados, Descripción.' : 'Eventos son: Título, Formato, Fecha, Hora, Ubicación, Aforo, Descripción.')
    });
  };

  const handleGoogleLogin = async () => {
    try {
      setIsAuthenticating(true);
      setFeedback(null);
      const res = await signInWithGoogleWorkspace();
      if (res?.accessToken) {
        setActiveToken(res.accessToken);
        setFeedback({
          type: 'success',
          message: `Conectado exitosamente con Google Workspace (${res.user.email}).`
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'No se pudo completar el inicio de sesión con Google.'
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFetchMetadata = async () => {
    if (!spreadsheetInput.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, introduce la URL o el ID de la hoja de cálculo de Google Sheets.' });
      return;
    }

    try {
      setIsLoadingMeta(true);
      setFeedback(null);
      const meta = await getSpreadsheetMetadata(spreadsheetInput, activeToken || undefined);
      setSheetMeta(meta);
      if (meta.tabs.length > 0) {
        setSelectedTab(meta.tabs[0]);
      }
      setFeedback({
        type: 'success',
        message: `Hoja detectada: "${meta.name}". Selecciona la pestaña que contiene los datos a importar.`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al conectar con la hoja de Google Sheets. Verifica que tengas permisos.'
      });
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const handleImportData = async () => {
    if (!sheetMeta || !selectedTab) return;

    try {
      setIsSyncing(true);
      setFeedback(null);

      // Fetch A1:Z200 range of selected tab
      const rows = await fetchSheetValues(sheetMeta.id, `${selectedTab}!A1:Z200`, activeToken || undefined);

      if (mode === 'companies') {
        const result = parseCompaniesFromSheet(rows);
        if (result.success && result.data.length > 0) {
          result.data.forEach(comp => addCompany(comp));
          setFeedback({
            type: 'success',
            message: `¡Éxito! Se han importado e incorporado ${result.data.length} empresas al directorio de Ibarbaso Business Club.`
          });
          setPreviewCount(result.data.length);
        } else {
          setFeedback({
            type: 'error',
            message: result.message || 'No se encontraron filas con el formato de empresas esperado.'
          });
        }
      } else {
        const result = parseEventsFromSheet(rows);
        if (result.success && result.data.length > 0) {
          result.data.forEach(evt => addEvent(evt));
          setFeedback({
            type: 'success',
            message: `¡Éxito! Se han importado e incorporado ${result.data.length} eventos a la agenda oficial.`
          });
          setPreviewCount(result.data.length);
        } else {
          setFeedback({
            type: 'error',
            message: result.message || 'No se encontraron filas con el formato de eventos esperado.'
          });
        }
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al sincronizar datos desde Google Sheets.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl bg-[#0a1329] border border-[#1e3870] shadow-2xl overflow-hidden relative text-slate-100 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#0c2438] p-5 sm:p-6 border-b border-emerald-700/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Integración Google Sheets
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  {mode === 'companies' ? 'Empresas' : 'Eventos'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Conecta hojas de cálculo externas y sincroniza registros de forma segura.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Google Auth Status Check */}
          <div className="p-4 rounded-2xl bg-[#070e20] border border-[#1b3164] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${activeToken ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-500'}`} />
              <div>
                <p className="text-xs font-bold text-white">
                  {activeToken ? 'Sesión de Google Workspace Vinculada' : 'Permiso de Google Sheets requerido'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {activeToken 
                    ? 'Acceso autorizado para leer hojas y actualizar registros'
                    : 'Inicia sesión con tu cuenta Google para autorizar lectura'}
                </p>
              </div>
            </div>

            {!activeToken ? (
              <button
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex items-center gap-2 shrink-0 shadow disabled:opacity-50 cursor-pointer"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Conectar Google</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Conectado
              </span>
            )}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in ${
              feedback.type === 'success' 
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' 
                : feedback.type === 'error'
                ? 'bg-red-950/60 border border-red-500/40 text-red-200'
                : 'bg-blue-950/60 border border-blue-500/40 text-blue-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Database className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              )}
              <p className="flex-1 leading-relaxed">{feedback.message}</p>
            </div>
          )}

          {/* Step 1: Enter Spreadsheet URL or ID */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Enlace o ID de la Hoja de Google Sheets
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={spreadsheetInput}
                onChange={(e) => setSpreadsheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XR... o ID"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] focus:border-emerald-500 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition"
              />
              <button
                onClick={handleFetchMetadata}
                disabled={isLoadingMeta || !spreadsheetInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow"
              >
                {isLoadingMeta ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Inspeccionar</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Asegúrate de que la hoja esté compartida o accesible por tu cuenta de Google.</span>
              <button
                onClick={handleUseDemoTemplate}
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
              >
                Ver formato de columnas
              </button>
            </div>
          </div>

          {/* Step 2: Select Sheet tab if metadata is loaded */}
          {sheetMeta && (
            <div className="p-4 rounded-2xl bg-[#081228] border border-[#1b3469] space-y-3 animate-in fade-in">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300">
                2. Pestaña de datos a importar
              </label>
              
              <div className="flex flex-wrap gap-2">
                {sheetMeta.tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      selectedTab === tab 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-[#060c1c] border-[#182a52] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    📄 {tab}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleImportData}
                  disabled={isSyncing || !selectedTab}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sincronizando filas con el Club...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Cargar datos en {mode === 'companies' ? 'Empresas' : 'Eventos'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-[#070e20]/60 border border-[#162952] text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sincronización Segura OAuth2 con Google Drive & Sheets</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Las consultas se procesan directamente mediante la API oficial de Google Sheets sin almacenar credenciales en servidores de terceros.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070d1e] border-t border-[#182a52] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            IBARBASO BUSINESS CLUB • Google Workspace API
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Camera, 
  Download, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { EventRegistration, RegistrationStatus } from '../../types';

export const EventCheckInView: React.FC = () => {
  const { 
    events, 
    registrations, 
    selectedEventId, 
    setSelectedEventId, 
    checkInByTicketCode,
    updateRegistrationStatus
  } = useApp();

  const [currentEventId, setCurrentEventId] = useState<string>(
    selectedEventId || events[0]?.id || ''
  );

  const [scannedCodeInput, setScannedCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    registration?: EventRegistration;
  } | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RegistrationStatus>('ALL');

  const selectedEvent = events.find(e => e.id === currentEventId) || events[0];
  const eventRegistrations = registrations.filter(r => r.eventId === selectedEvent?.id);

  // Computed live metrics
  const totalRegistered = eventRegistrations.length;
  const checkedInCount = eventRegistrations.filter(r => r.status === 'Asistente').length;
  const noShowCount = eventRegistrations.filter(r => r.status === 'No presentado').length;
  const pendingCount = eventRegistrations.filter(r => r.status === 'Inscrito' || r.status === 'Confirmado').length;
  const attendanceRate = totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 100) : 0;

  // Distinct companies represented
  const uniqueCompanies = new Set(eventRegistrations.map(r => r.userCompany)).size;

  const handleValidateCode = (codeToTest?: string) => {
    const code = (codeToTest || scannedCodeInput).trim().toUpperCase();
    if (!code) return;

    const res = checkInByTicketCode(code);
    setScanResult(res);

    if (res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
    setScannedCodeInput('');
  };

  const filteredRegistrations = eventRegistrations.filter(reg => {
    const matchesSearch = 
      !searchTerm ||
      reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.ticketCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportAttendance = () => {
    const headers = ['Código Ticket', 'Nombre', 'Empresa', 'Estado', 'Hora Validación', 'Acompañante'];
    const rows = eventRegistrations.map(r => [
      r.ticketCode,
      `"${r.userName}"`,
      `"${r.userCompany}"`,
      r.status,
      r.checkedInAt || 'N/A',
      r.hasCompanion ? `"${r.companionName || 'Sí'}"` : 'No'
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `asistencia_${selectedEvent?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0a1329] border border-[#1b3164] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <QrCode className="w-5 h-5 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Control de Accesos & Check-in QR
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Escanea o introduce el código del pase de los socios para validar su entrada en tiempo real.
          </p>
        </div>

        {/* Event selector dropdown */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-400 shrink-0" />
          <select
            value={selectedEvent?.id}
            onChange={(e) => {
              setCurrentEventId(e.target.value);
              setSelectedEventId(e.target.value);
              setScanResult(null);
            }}
            className="px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-100 text-xs sm:text-sm font-semibold outline-none focus:border-red-500 max-w-[260px] truncate"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Inscritos</span>
          <span className="text-xl font-black text-white">{totalRegistered} / {selectedEvent?.capacity}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Asistentes en Sala</span>
          <span className="text-xl font-black text-emerald-400">{checkedInCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Tasa de Asistencia</span>
          <span className="text-xl font-black text-red-400">{attendanceRate}%</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Empresas Distintas</span>
          <span className="text-xl font-black text-sky-400">{uniqueCompanies}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] text-slate-400 block font-medium">Pendientes</span>
          <span className="text-xl font-black text-slate-400">{pendingCount}</span>
        </div>
      </div>

      {/* QR Scanner & Quick Validation Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scanner Terminal */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-red-500" />
                <span>Lector de Pases QR</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Cámara Activa
              </span>
            </div>

            {/* Simulated Live Camera Scanner Viewfinder */}
            <div className="relative h-44 rounded-2xl bg-[#070e20] border-2 border-dashed border-red-500/40 flex flex-col items-center justify-center p-4 overflow-hidden group">
              <div className="w-28 h-28 border-2 border-red-500 rounded-xl relative flex items-center justify-center animate-pulse">
                <QrCode className="w-12 h-12 text-red-400/60" />
                <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Enfoca el código QR de la acreditación móvil del socio
              </p>
            </div>

            {/* Manual Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">
                O escribe el código alfanumérico del pase:
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={scannedCodeInput}
                  onChange={(e) => setScannedCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateCode()}
                  placeholder="Ej. NET-2025-01"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white font-mono text-xs uppercase focus:border-red-500 outline-none"
                />
                <button
                  id="btn-validate-code"
                  onClick={() => handleValidateCode()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs shadow transition"
                >
                  Validar
                </button>
              </div>
            </div>

            {/* Quick Demo Tickets Clicker */}
            <div className="pt-2 border-t border-[#182a52]">
              <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1.5">
                Acceso Rápido Demo (Click para simular escaneo):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {eventRegistrations.slice(0, 3).map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleValidateCode(r.ticketCode)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-[#12234e] hover:bg-[#1a3372] text-red-300 border border-[#1b3164] transition"
                  >
                    {r.ticketCode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Feedback Banner */}
          {scanResult && (
            <div className={`p-4 rounded-2xl border text-xs animate-in zoom-in-95 duration-150 mt-3 ${
              scanResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-start gap-2.5">
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-sm">{scanResult.message}</p>
                  {scanResult.registration && (
                    <div className="text-[11px] text-slate-300">
                      <p><strong>{scanResult.registration.userName}</strong> ({scanResult.registration.userCompany})</p>
                      <p className="font-mono text-slate-400">Pase: {scanResult.registration.ticketCode}</p>
                      {scanResult.registration.hasCompanion && (
                        <p className="text-red-400 font-medium">
                          +1 Acompañante: {scanResult.registration.companionName || 'Confirmado'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Attendees List & Status Controls */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-lg flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                <span>Lista de Inscritos y Acreditaciones</span>
              </h3>
              <p className="text-xs text-slate-400">
                Gestiona manualmente la entrada o marca no presentados.
              </p>
            </div>

            <button
              onClick={handleExportAttendance}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-xs font-semibold transition shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>Exportar Asistencia CSV</span>
            </button>
          </div>

          {/* Search and Status Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, empresa o ticket..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['ALL', 'Asistente', 'Inscrito', 'No presentado'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    statusFilter === st 
                      ? 'bg-red-600 text-white shadow' 
                      : 'bg-[#070e20] text-slate-400 hover:text-white border border-[#1d346b]'
                  }`}
                >
                  {st === 'ALL' ? 'Todos' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List */}
          <div className="overflow-x-auto flex-1 max-h-[380px] overflow-y-auto space-y-2 pr-1">
            {filteredRegistrations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No se encontraron inscripciones con ese criterio.</p>
            ) : (
              filteredRegistrations.map((reg) => (
                <div 
                  key={reg.id}
                  className="p-3 rounded-2xl bg-[#070e20] border border-[#1b3164] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      reg.status === 'Asistente' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : reg.status === 'No presentado'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-[#12234e] text-slate-400'
                    }`}>
                      {reg.status === 'Asistente' ? '✓' : reg.userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{reg.userName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{reg.ticketCode}</span>
                      </div>
                      <p className="text-red-400 text-[11px] truncate">{reg.userCompany}</p>
                      {reg.checkedInAt && (
                        <p className="text-[10px] text-emerald-400">Validado a las {reg.checkedInAt}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={reg.status}
                      onChange={(e) => updateRegistrationStatus(reg.id, e.target.value as RegistrationStatus)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                        reg.status === 'Asistente'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : reg.status === 'No presentado'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-[#12234e] text-slate-300 border-[#1b3164]'
                      }`}
                    >
                      <option value="Inscrito">Inscrito</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Asistente">✓ Asistente</option>
                      <option value="No presentado">No presentado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>

                    {reg.status !== 'Asistente' && (
                      <button
                        onClick={() => handleValidateCode(reg.ticketCode)}
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs transition shadow"
                        title="Marcar asistencia ahora"
                      >
                        Validar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

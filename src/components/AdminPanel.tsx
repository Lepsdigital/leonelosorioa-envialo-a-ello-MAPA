import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Award, 
  TrendingUp, 
  Download, 
  Search, 
  Bell, 
  Send, 
  LogOut, 
  Mail, 
  Clock, 
  Phone,
  LayoutDashboard,
  X,
  CheckCircle2,
  FileText
} from "lucide-react";
import { motion } from "motion/react";

interface AdminPanelProps {
  onLogoutAdmin: () => void;
}

interface MetricSummary {
  totalUsers: number;
  activeUsers: number;
  completedUsers: number;
  completionRate: number;
  averageProgress: number;
}

interface CapturedEmail {
  nombre: string;
  email: string;
  disabled?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogoutAdmin }) => {
  const [metrics, setMetrics] = useState<MetricSummary>({
    totalUsers: 0,
    activeUsers: 0,
    completedUsers: 0,
    completionRate: 0,
    averageProgress: 0
  });

  const [usersList, setUsersList] = useState<CapturedEmail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Notification states
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyBody, setNotifyBody] = useState("");
  const [notifyCategory, setNotifyCategory] = useState("Alerta Motivacional");
  const [notifyTargetEmail, setNotifyTargetEmail] = useState("ALL");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifySuccessMsg, setNotifySuccessMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("MAPA_ACCESS_TOKEN");
      const res = await fetch("/api/admin/metrics", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error cargando métricas.");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setUsersList(data.capturedEmails);
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Fallo crítico al conectar con el servidor administrativo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDispatchPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyTitle.trim() || !notifyBody.trim()) return;

    try {
      setNotifyLoading(true);
      setNotifySuccessMsg(null);
      const token = localStorage.getItem("MAPA_ACCESS_TOKEN");
      const res = await fetch("/api/admin/dispatch-push", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: notifyTitle.trim().slice(0, 50),
          body: notifyBody.trim().slice(0, 160),
          category: notifyCategory,
          userEmail: notifyTargetEmail === "ALL" ? "" : notifyTargetEmail
        })
      });

      const data = await res.json();
      if (data.success) {
        setNotifySuccessMsg(data.message || "Notificación enviada.");
        setNotifyTitle("");
        setNotifyBody("");
        setTimeout(() => setNotifySuccessMsg(null), 4000);
      } else {
        throw new Error(data.error || "Ocurrió un error.");
      }
    } catch (err: any) {
      alert("Fallo al enviar notificación: " + err.message);
    } finally {
      setNotifyLoading(false);
    }
  };

  const handleToggleUserStatus = async (email: string, makeDisabled: boolean) => {
    try {
      const token = localStorage.getItem("MAPA_ACCESS_TOKEN");
      const res = await fetch("/api/admin/toggle-user-status", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, disabled: makeDisabled })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.email === email ? { ...u, disabled: makeDisabled } : u));
      } else {
        alert("Error al cambiar estado: " + (data.error || "Desconocido"));
      }
    } catch (err: any) {
      alert("Error al conectar con el servidor: " + err.message);
    }
  };

  // Export current list as JSON download
  const handleExportJSON = () => {
    if (usersList.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(usersList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MAPA_Export_Usuarios_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.whatsapp && u.whatsapp.includes(q))
    );
  });

  const handleGoogleAuthConnect = async () => {
    try {
      const token = localStorage.getItem("MAPA_ACCESS_TOKEN");
      const res = await fetch("/api/auth/google-url", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "OAUTH_CLIENT_ID no está configurado en secretos.");
      }
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      alert("Error al conectar cuenta Google: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-6 px-4 text-[#F8FAFC]" id="admin_dashboard_element">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#000000] p-6 rounded-2xl border-b border-[#9D4EDD] shadow-[0_10px_35px_rgba(157,78,221,0.2)] mb-2">
        <div className="flex items-center space-x-4 text-left">
          <div className="p-3 bg-[#130924] border border-[#9D4EDD] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(157,78,221,0.3)]">
            <LayoutDashboard className="w-6 h-6 text-[#FF007F] drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#B5179E] tracking-tight drop-shadow-[0_0_10px_rgba(181,23,158,0.4)]">
              M.A.P.A.™ Panel Administrativo
            </h2>
            <p className="text-xs text-[#E2E8F0] font-sans tracking-wide">
              Métricas exclusivas para administradores autorizados (contacto@tupodermental.club / tupodermentaloficial@gmail.com / agencialeps@gmail.com)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={handleGoogleAuthConnect}
            className="px-5 py-2.5 bg-[#0A192F] border border-[#00F0FF]/40 hover:border-[#00F0FF] text-xs font-mono text-[#00F0FF] rounded-xl transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 flex items-center space-x-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="font-bold">Vincular Gmail</span>
          </button>
          <button 
            onClick={fetchAdminData}
            className="px-5 py-2.5 bg-[#121824] border border-[#9D4EDD]/40 hover:border-[#9D4EDD] text-xs font-mono text-[#E2E8F0] rounded-xl transition-all cursor-pointer shadow-[0_0_10px_rgba(157,78,221,0.1)] hover:shadow-[0_0_15px_rgba(157,78,221,0.3)] active:scale-95"
          >
            Actualizar
          </button>
          <button
            onClick={onLogoutAdmin}
            className="px-5 py-2.5 bg-[#1C0D1B] border border-[#FF007F]/40 hover:border-[#FF007F] text-xs font-mono text-[#FF007F] hover:bg-[#FF007F]/10 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,127,0.1)] hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] active:scale-95 animate-pulse"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-bold">Salir de Consola</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-10 h-10 border-2 border-[#7EF9FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-gray-500">Recuperando registros directos del servidor...</p>
        </div>
      ) : errorMessage ? (
        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-3xl text-center space-y-3 max-w-md mx-auto">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-sans text-red-300">{errorMessage}</p>
          <button 
            onClick={fetchAdminData} 
            className="px-4 py-1.5 bg-white/10 rounded-xl text-xs text-white"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {/* ANALYSIS GRID - METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Cards 1: Total Users row */}
            <div 
              style={{ borderWidth: "1.5px" }} 
              className="p-5 rounded-2xl bg-[#121824]/90 border-[#00F0FF]/30 space-y-2 text-left shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_22px_rgba(0,240,255,0.2)] transition-all duration-300"
            >
              <div className="flex items-center justify-between text-[#E2E8F0]">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">REGISTRADOS</span>
                <Users className="w-4 h-4 text-[#FF007F] drop-shadow-[0_0_6px_rgba(255,0,127,0.6)]" />
              </div>
              <p className="text-4xl font-display font-black text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">{metrics.totalUsers}</p>
              <span className="text-[9px] font-mono text-[#F8FAFC]/60">Captura total acumulada</span>
            </div>

            {/* Cards 2: Active Users */}
            <div 
              style={{ borderWidth: "1.5px" }} 
              className="p-5 rounded-2xl bg-[#121824]/90 border-[#FF007F]/30 space-y-2 text-left shadow-[0_0_15px_rgba(255,0,127,0.1)] hover:shadow-[0_0_22px_rgba(255,0,127,0.2)] transition-all duration-300"
            >
              <div className="flex items-center justify-between text-[#E2E8F0]">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">ACTIVOS RECIENTES</span>
                <Clock className="w-4 h-4 text-[#FF007F] drop-shadow-[0_0_6px_rgba(255,0,127,0.6)]" />
              </div>
              <p className="text-4xl font-display font-black text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">{metrics.activeUsers}</p>
              <span className="text-[9px] font-mono text-[#F8FAFC]/60">Últimos 30 días de sintonía</span>
            </div>

            {/* Cards 3: Completed program */}
            <div 
              style={{ borderWidth: "1.5px" }} 
              className="p-5 rounded-2xl bg-[#121824]/90 border-[#9D4EDD]/30 space-y-2 text-left shadow-[0_0_15px_rgba(157,78,221,0.1)] hover:shadow-[0_0_22px_rgba(157,78,221,0.2)] transition-all duration-300"
            >
              <div className="flex items-center justify-between text-[#E2E8F0]">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">COMPLETADOS</span>
                <Award className="w-4 h-4 text-[#FF007F] drop-shadow-[0_0_6px_rgba(255,0,127,0.6)]" />
              </div>
              <p className="text-4xl font-display font-black text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">{metrics.completedUsers}</p>
              <span className="text-[9px] font-mono text-[#F8FAFC]/60">Avances de 7 Días completos</span>
            </div>

            {/* Cards 4: Rates completed */}
            <div 
              style={{ borderWidth: "1.5px" }} 
              className="p-5 rounded-2xl bg-[#121824]/90 border-[#00F0FF]/30 space-y-2 text-left shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_22px_rgba(0,240,255,0.2)] transition-all duration-300"
            >
              <div className="flex items-center justify-between text-[#E2E8F0]">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">TASA FINALIZACIÓN</span>
                <TrendingUp className="w-4 h-4 text-[#FF007F] drop-shadow-[0_0_6px_rgba(255,0,127,0.6)]" />
              </div>
              <p className="text-4xl font-display font-black text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">{metrics.completionRate}%</p>
              <span className="text-[9px] font-mono text-[#F8FAFC]/60">Porcentaje de éxito total</span>
            </div>

            {/* Cards 5: Day Progress avg */}
            <div 
              style={{ borderWidth: "1.5px" }} 
              className="p-5 rounded-2xl bg-[#121824]/90 border-[#9D4EDD]/30 space-y-2 text-left shadow-[0_0_15px_rgba(157,78,221,0.1)] hover:shadow-[0_0_22px_rgba(157,78,221,0.2)] transition-all duration-300 w-full"
            >
              <div className="flex items-center justify-between text-[#E2E8F0]">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">AVANCE PROMEDIO</span>
                <BarChart3 className="w-4 h-4 text-[#FF007F] drop-shadow-[0_0_6px_rgba(255,0,127,0.6)]" />
              </div>
              <p className="text-4xl font-display font-black text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">{metrics.averageProgress} Días</p>
              <span className="text-[9px] font-mono text-[#F8FAFC]/60">Mediana de sintonía activa</span>
            </div>

          </div>

          {/* TWO MAIN MODULES: REGISTRY LIST AND PUSH NOTIFICATIONS GESTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* TABULAR REGISTRY MODULE - Left/8 Columns */}
            <div 
              style={{ borderWidth: "1.5px" }} 
              className="lg:col-span-8 bg-[#121824]/90 border-[#9D4EDD]/30 rounded-3xl p-6 space-y-4 shadow-[0_0_25px_rgba(157,78,221,0.1)] text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#9D4EDD]/20 pb-4">
                <div>
                  <h3 className="font-display font-black text-xl text-[#B5179E] drop-shadow-[0_0_8px_rgba(181,23,158,0.35)]">
                    Correos Capturados y Avance
                  </h3>
                  <p className="text-xs text-[#E2E8F0]">Registro histórico de leads y fases activas en M.A.P.A.™</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre, correo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#000000] border border-[#FF007F]/40 focus:border-[#FF007F] p-2 pl-9 text-xs rounded-xl outline-none text-[#F8FAFC] font-sans transition-all focus:shadow-[0_0_12px_rgba(255,0,127,0.3)] placeholder:text-gray-600"
                    />
                  </div>
                  <button 
                    onClick={handleExportJSON}
                    disabled={usersList.length === 0}
                    className="p-2.5 bg-[#00E5FF] hover:bg-[#00D4FF] text-[#000000] font-mono font-black text-xs rounded-xl transition-all cursor-pointer disabled:opacity-40 select-none flex items-center space-x-1.5 px-4 shrink-0 border-none uppercase shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_22px_rgba(0,229,255,0.6)] active:scale-95"
                    title="Exportar base de datos a archivo JSON"
                  >
                    <Download className="w-4 h-4 stroke-[3px]" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>

              {/* Responsive Table grid flow */}
              <div className="overflow-x-auto w-full">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xs font-mono text-gray-500">No se encontraron registros de usuarios con ese criterio.</p>
                  </div>
                ) : (
                  <table className="w-full text-xs font-sans text-[#E2E8F0]">
                    <thead>
                      <tr className="border-b border-[#9D4EDD]/20 text-[#F8FAFC] uppercase font-mono tracking-wider text-[10px] text-left bg-black/30">
                        <th className="py-3 px-3">Usuario / Email</th>
                        <th className="py-3 px-3 text-right">Estado / Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr 
                          key={i} 
                          className={`border-b border-[#9D4EDD]/12 hover:bg-[#9D4EDD]/5 transition-all duration-150 ${u.disabled ? "opacity-60 bg-red-950/10" : ""}`}
                        >
                          <td className="py-3.5 px-3 text-left">
                            <span className="font-bold text-white block leading-tight">{u.nombre}</span>
                            <span className="text-[10px] text-[#E2E8F0]/70 block font-mono">{u.email}</span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex flex-col items-end space-y-1.5">
                              <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-black border ${
                                u.disabled 
                                  ? "bg-red-500/15 text-red-400 border-red-500/35" 
                                  : "bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/35 shadow-[0_0_8px_rgba(57,255,20,0.15)]"
                              }`}>
                                {u.disabled ? "Inhabilitado" : "Activo"}
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                <button
                                  onClick={() => handleToggleUserStatus(u.email, !u.disabled)}
                                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer border ${
                                    u.disabled 
                                      ? "bg-[#39FF14]/10 hover:bg-[#39FF14]/25 text-[#39FF14] border-[#39FF14]/35" 
                                      : "bg-red-500/10 hover:bg-red-500/25 text-red-400 border-red-500/35"
                                  }`}
                                >
                                  {u.disabled ? "Habilitar" : "Inhabilitar"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* SYSTEM GESTIONS COLUMN - Right/4 Columns */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* NOTIFICATIONS DISPATCH GESTION */}
              <div 
                style={{ borderWidth: "1.5px" }} 
                className="bg-[#121824]/90 border-[#FF007F]/30 rounded-3xl p-6 space-y-4 shadow-[0_0_25px_rgba(255,0,127,0.1)] text-left"
              >
                <div className="border-b border-[#FF007F]/20 pb-3">
                  <h3 className="font-display font-black text-xl text-[#B5179E] drop-shadow-[0_0_8px_rgba(181,23,158,0.35)] flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-[#FF007F] shrink-0 animate-pulse drop-shadow-[0_0_6px_rgba(255,0,127,0.6)]" />
                    <span>Gestor de Alertas M.A.P.A.</span>
                  </h3>
                  <p className="text-[11px] text-[#E2E8F0]">Despacha alertas motivacionales o guías rápidas instantáneas en tiempo real.</p>
                </div>

                <form onSubmit={handleDispatchPush} className="space-y-4 pt-1">
                  
                  {/* Selector de Categoría */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#E2E8F0] uppercase tracking-widest font-black">
                      Categoría de Alerta
                    </label>
                    <select
                      value={notifyCategory}
                      onChange={(e) => setNotifyCategory(e.target.value)}
                      className="w-full bg-[#000000] border border-[#FF007F]/40 focus:border-[#FF007F] p-2.5 rounded-xl text-xs outline-none text-[#F8FAFC] focus:shadow-[0_0_12px_rgba(255,0,127,0.35)] transition-all font-sans"
                    >
                      <option className="bg-black text-white" value="Alerta Motivacional">🌸 Alerta Motivacional</option>
                      <option className="bg-black text-white" value="Guía Rápida de Emergencia">⚡ Guía Rápida de Emergencia</option>
                    </select>
                  </div>

                  {/* Target user email select */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#E2E8F0] uppercase tracking-widest font-black">
                      Destinatarios de Alerta
                    </label>
                    <select
                      value={notifyTargetEmail}
                      onChange={(e) => setNotifyTargetEmail(e.target.value)}
                      className="w-full bg-[#000000] border border-[#FF007F]/40 focus:border-[#FF007F] p-2.5 rounded-xl text-xs outline-none text-[#F8FAFC] focus:shadow-[0_0_12px_rgba(255,0,127,0.35)] transition-all font-sans"
                    >
                      <option className="bg-black text-white" value="ALL">📢 Todas las usuarias activas</option>
                      {usersList.slice(0, 10).map((u, idx) => (
                        <option className="bg-black text-white" key={idx} value={u.email}>
                          👤 {u.nombre.slice(0, 15)} ({u.email.slice(0, 15)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title notification */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono text-[#E2E8F0] uppercase tracking-widest font-black">
                        Título de Alerta
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">
                        {notifyTitle.length}/50
                      </span>
                    </div>
                    <input 
                      type="text" 
                      required
                      maxLength={50}
                      placeholder="Ej. Sintonía del Día: Respira y regula"
                      value={notifyTitle}
                      onChange={(e) => setNotifyTitle(e.target.value)}
                      className="w-full bg-[#000000] border border-[#FF007F]/40 focus:border-[#FF007F] p-2.5 rounded-xl text-xs outline-none text-[#F8FAFC] focus:shadow-[0_0_12px_rgba(255,0,127,0.35)] transition-all font-sans placeholder:text-gray-600"
                    />
                  </div>

                  {/* Body paragraph */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono text-[#E2E8F0] uppercase tracking-widest font-black">
                        Mensaje de Alerta
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">
                        {notifyBody.length}/160
                      </span>
                    </div>
                    <textarea 
                      required
                      maxLength={160}
                      rows={3}
                      placeholder="Ej. Dedica 3 minutos hoy a sintonizar tu respiración somática de alivio con la Mentora Clara."
                      value={notifyBody}
                      onChange={(e) => setNotifyBody(e.target.value)}
                      className="w-full bg-[#000000] border border-[#FF007F]/40 focus:border-[#FF007F] p-2.5 rounded-xl text-xs outline-none text-[#F8FAFC] focus:shadow-[0_0_12px_rgba(255,0,127,0.35)] transition-all font-sans placeholder:text-gray-600 resize-none"
                    />
                  </div>

                  {notifySuccessMsg && (
                    <p className="text-[11px] font-mono p-2.5 bg-emerald-500/15 border border-[#39FF14]/20 text-[#39FF14] rounded-xl leading-relaxed animate-fadeIn shadow-[0_0_8px_rgba(57,255,20,0.1)]">
                      ✔ {notifySuccessMsg}
                    </p>
                  )}

                  {/* Submit trigger button */}
                  <button
                    type="submit"
                    disabled={notifyLoading || !notifyTitle.trim() || !notifyBody.trim()}
                    className="w-full py-3 bg-gradient-to-r from-[#B5179E] to-[#9D4EDD] hover:from-[#FF007F] hover:to-[#B5179E] text-white font-display font-black text-xs tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer border-none shadow-[0_0_15px_rgba(255,0,127,0.3)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none uppercase"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>{notifyLoading ? "DESPACHANDO..." : "DESPACHAR ALERTA EN VIVO ➔"}</span>
                  </button>

                </form>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
};

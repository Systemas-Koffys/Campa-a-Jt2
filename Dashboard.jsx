import React, { useMemo } from 'react';
import { Users, Activity, TrendingUp, Target, ArrowRight } from 'lucide-react';

export default function Dashboard({ data, onSelectPerson }) {
  const stats = useMemo(() => {
    if (!data) return null;

    const totalPeople = data.people.length;
    const totalActivities = data.activities.length;
    const totalAttendances = data.people.reduce((sum, person) => sum + (person.attendances || 0), 0);
    const avgAttendance = totalPeople > 0 ? Math.round(totalAttendances / totalPeople) : 0;

    // Top participantes
    const topParticipants = [...data.people]
      .sort((a, b) => (b.attendances || 0) - (a.attendances || 0))
      .slice(0, 5);

    return {
      totalPeople,
      totalActivities,
      totalAttendances,
      avgAttendance,
      topParticipants
    };
  }, [data]);

  if (!data || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-green-600 border-t-red-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg border border-opacity-30 hover:shadow-2xl transition transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-30" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent mb-2">
          Dashboard Campaña
        </h2>
        <p className="text-slate-400">Resumen de actividades y participación - Distrito 6</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Participantes"
          value={stats.totalPeople}
          color="from-blue-600 to-blue-800"
        />
        <StatCard
          icon={Activity}
          label="Actividades Realizadas"
          value={stats.totalActivities}
          color="from-green-600 to-green-800"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Asistencias"
          value={stats.totalAttendances}
          color="from-purple-600 to-purple-800"
        />
        <StatCard
          icon={Target}
          label="Prom. Asistencias"
          value={stats.avgAttendance}
          color="from-red-600 to-red-800"
        />
      </div>

      {/* Top Participantes */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-green-600/20 to-red-600/20 px-6 py-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Target size={24} className="text-green-400" />
            Top 5 Participantes Más Activos
          </h3>
        </div>

        <div className="divide-y divide-slate-700">
          {stats.topParticipants.map((person, idx) => (
            <div
              key={person.id}
              onClick={() => onSelectPerson(person.id)}
              className="px-6 py-4 hover:bg-slate-700/50 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {person.profilePhotos?.[0] ? (
                      <img
                        src={person.profilePhotos[0]}
                        alt={person.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-white group-hover:text-green-400 transition">
                      {person.fullName}
                    </p>
                    <p className="text-sm text-slate-400">{person.phone}</p>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">{person.attendances || 0}</p>
                  <p className="text-xs text-slate-400">Actividades</p>
                </div>

                <ArrowRight size={20} className="text-slate-500 group-hover:text-green-400 ml-4 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico simple de participación */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Distribución de Participación</h3>
        <div className="space-y-4">
          {[
            { label: '25+ actividades', count: stats.totalPeople > 0 ? Math.round((data.people.filter(p => (p.attendances || 0) >= 25).length / stats.totalPeople) * 100) : 0, color: 'from-green-600 to-green-400' },
            { label: '20-24 actividades', count: stats.totalPeople > 0 ? Math.round((data.people.filter(p => (p.attendances || 0) >= 20 && (p.attendances || 0) < 25).length / stats.totalPeople) * 100) : 0, color: 'from-blue-600 to-blue-400' },
            { label: '15-19 actividades', count: stats.totalPeople > 0 ? Math.round((data.people.filter(p => (p.attendances || 0) >= 15 && (p.attendances || 0) < 20).length / stats.totalPeople) * 100) : 0, color: 'from-purple-600 to-purple-400' },
            { label: 'Menos de 15', count: stats.totalPeople > 0 ? Math.round((data.people.filter(p => (p.attendances || 0) < 15).length / stats.totalPeople) * 100) : 0, color: 'from-red-600 to-red-400' },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">{item.label}</span>
                <span className="text-sm font-bold text-green-400">{item.count}%</span>
              </div>
              <div className="w-full h-8 bg-slate-700 rounded-lg overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                  style={{ width: `${item.count}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info footer */}
      <div className="text-center pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-400">
          Datos actualizados • Última sincronización: {new Date().toLocaleString('es-ES')}
        </p>
      </div>
    </div>
  );
}

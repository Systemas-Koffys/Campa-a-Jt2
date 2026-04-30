import React, { useState } from 'react';
import { Upload, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { DataManager } from '../utils/DataManager';
import * as XLSX from 'xlsx';

export default function AdminPanel({ data, onDataUpdate }) {
  const [activeTab, setActiveTab] = useState('activities');
  const [newActivity, setNewActivity] = useState({ name: '', date: '', mediaLink: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activities = data?.activities || [];

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.name || !newActivity.date) {
      setUploadError('Nombre y fecha son requeridos');
      return;
    }

    try {
      const activity = {
        id: Date.now().toString(),
        name: newActivity.name,
        date: newActivity.date,
        mediaLink: newActivity.mediaLink || ''
      };

      await DataManager.addActivity(activity);
      setNewActivity({ name: '', date: '', mediaLink: '' });
      setSuccessMsg('Actividad creada correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
      onDataUpdate();
    } catch (err) {
      setUploadError('Error al crear actividad');
    }
  };

  const handleUpdateActivity = async (activityId) => {
    try {
      await DataManager.updateActivity(activityId, editData);
      setEditingId(null);
      setSuccessMsg('Actividad actualizada');
      setTimeout(() => setSuccessMsg(''), 3000);
      onDataUpdate();
    } catch (err) {
      setUploadError('Error al actualizar');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      try {
        await DataManager.deleteActivity(activityId);
        setSuccessMsg('Actividad eliminada');
        setTimeout(() => setSuccessMsg(''), 3000);
        onDataUpdate();
      } catch (err) {
        setUploadError('Error al eliminar');
      }
    }
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // Procesar datos del Excel
        const activities = Array.from(
          new Set(
            Object.keys(rows[0])
              .filter(key => key !== 'Conteo' && key !== 'ID' && key !== 'Nombre Completo' && 
                            key !== 'Celular' && key !== 'Asistencias Totales' && key !== 'Porcentaje')
          )
        ).map((name, idx) => ({
          id: `activity_${idx}`,
          name: name.trim(),
          date: name.includes('-') ? name.split('-').pop().trim() : '',
          mediaLink: ''
        }));

        // Importar actividades
        for (const activity of activities) {
          const exists = data.activities?.find(a => a.name === activity.name);
          if (!exists) {
            await DataManager.addActivity(activity);
          }
        }

        setSuccessMsg(`${activities.length} actividades importadas`);
        setTimeout(() => setSuccessMsg(''), 3000);
        onDataUpdate();
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setUploadError('Error al importar Excel');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent mb-2">
        Administración
      </h2>

      {/* Mensajes */}
      {uploadError && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-300 flex items-center gap-2">
          <X size={20} />
          {uploadError}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 text-green-300">
          ✓ {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-3 font-semibold transition border-b-2 ${
            activeTab === 'activities'
              ? 'border-green-600 text-green-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Actividades
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-3 font-semibold transition border-b-2 ${
            activeTab === 'import'
              ? 'border-green-600 text-green-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Importar
        </button>
      </div>

      {/* Contenido Tabs */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          {/* Formulario Nueva Actividad */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-600/30 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={24} className="text-green-400" />
              Nueva Actividad
            </h3>

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 font-semibold mb-2 block">
                  Nombre de la Actividad
                </label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  placeholder="Ej: Rastrillaje Barrio Centro"
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 font-semibold mb-2 block">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 font-semibold mb-2 block">
                    Enlace Redes Sociales (opcional)
                  </label>
                  <input
                    type="url"
                    value={newActivity.mediaLink}
                    onChange={(e) => setNewActivity({ ...newActivity, mediaLink: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Crear Actividad
              </button>
            </form>
          </div>

          {/* Lista de Actividades */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Actividades ({activities.length})
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No hay actividades registradas</p>
              ) : (
                activities.map(activity => (
                  <div
                    key={activity.id}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-green-600/50 transition"
                  >
                    {editingId === activity.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                        />
                        <input
                          type="date"
                          value={editData.date || ''}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                        />
                        <input
                          type="url"
                          value={editData.mediaLink || ''}
                          onChange={(e) => setEditData({ ...editData, mediaLink: e.target.value })}
                          placeholder="Enlace de redes sociales"
                          className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateActivity(activity.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold transition flex items-center justify-center gap-2"
                          >
                            <Save size={16} />
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded font-bold transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{activity.name}</h4>
                          <p className="text-sm text-slate-400 mt-1">{activity.date}</p>
                          {activity.mediaLink && (
                            <a
                              href={activity.mediaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                            >
                              Ver en redes →
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(activity.id);
                              setEditData(activity);
                            }}
                            className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-600/30 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Upload size={24} className="text-green-400" />
            Importar Excel
          </h3>

          <p className="text-slate-400 mb-4">
            Carga un archivo Excel para importar actividades automáticamente
          </p>

          <label className="block">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-600 transition bg-slate-700/30">
              <Upload size={40} className="mx-auto mb-2 text-slate-400" />
              <p className="text-white font-semibold mb-1">Haz click o arrastra el archivo</p>
              <p className="text-sm text-slate-400">Formato: .xlsx</p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
                className="hidden"
              />
            </div>
          </label>

          <div className="mt-6 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 Usa el archivo original de asistencia. El sistema importará automáticamente todas las actividades.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

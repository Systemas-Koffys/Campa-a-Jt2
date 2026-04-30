import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, Edit, Upload, X, Link as LinkIcon } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { DataManager } from '../utils/DataManager';

export default function PersonProfile({ personId, data, onBack, userRole, onDataUpdate }) {
  const person = data?.people.find(p => p.id === personId);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(person || {});
  const [selectedPhotoForPDF, setSelectedPhotoForPDF] = useState(0);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(null);
  const carnetRef = useRef(null);

  if (!person) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Participante no encontrado</p>
        <button onClick={onBack} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
          Volver
        </button>
      </div>
    );
  }

  const activities = data?.activities || [];
  const personActivities = activities.filter(activity => {
    const activityId = activity.id;
    return person.attendances_detail?.[activityId] === true;
  });

  const handlePhotoUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const updatedPhotos = [...(editData.profilePhotos || [])];
      updatedPhotos[index] = reader.result;
      
      const updatedPerson = { ...editData, profilePhotos: updatedPhotos };
      setEditData(updatedPerson);

      if (editMode && userRole === 'admin') {
        try {
          await DataManager.updatePerson(personId, updatedPerson);
          onDataUpdate();
        } catch (err) {
          console.error('Error saving photo:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdits = async () => {
    try {
      await DataManager.updatePerson(personId, editData);
      setEditMode(false);
      onDataUpdate();
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  const downloadPDF = () => {
    const element = carnetRef.current;
    const opt = {
      margin: 5,
      filename: `carnet_${person.fullName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a6' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition"
        >
          <ArrowLeft size={20} />
          Volver a Participantes
        </button>

        {userRole === 'admin' && (
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Edit size={18} />
            {editMode ? 'Guardar' : 'Editar'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carnet (izquierda) */}
        <div className="lg:col-span-1">
          <div
            ref={carnetRef}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-4 border-green-600 shadow-2xl w-full max-w-sm mx-auto"
            style={{ aspectRatio: '85.6/53.98' }} // Tamaño carnet
          >
            {/* Fondo carnet */}
            <div className="relative w-full h-full bg-gradient-to-br from-green-900 to-slate-900 p-4 flex flex-col">
              {/* Logo superior */}
              <div className="text-center mb-2">
                <img
                  src="https://i.postimg.cc/VvQp16sf/L-COLOR.png"
                  alt="Logo"
                  className="h-8 mx-auto"
                />
              </div>

              {/* Foto */}
              <div className="flex justify-center mb-2">
                {editData.profilePhotos?.[selectedPhotoForPDF] ? (
                  <img
                    src={editData.profilePhotos[selectedPhotoForPDF]}
                    alt={editData.fullName}
                    className="w-24 h-24 rounded-full border-3 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-red-600 flex items-center justify-center text-white text-3xl font-bold border-3 border-white">
                    {editData.fullName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Datos */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{editData.fullName}</h3>
                <p className="text-xs text-green-300 mb-2">{editData.phone}</p>
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  {editData.attendances || 0} ACTIVIDADES
                </div>
              </div>

              {/* Pie */}
              <p className="text-center text-xs text-slate-300 border-t border-slate-500 pt-1">
                Campaña Distrito 6
              </p>
            </div>
          </div>

          {/* Controles PDF */}
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-slate-300 font-semibold mb-2 block">
                Seleccionar foto para carnet:
              </label>
              <div className="flex gap-2">
                {[0, 1].map(idx => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoForPDF(idx)}
                    className={`flex-1 p-2 rounded-lg transition border-2 ${
                      selectedPhotoForPDF === idx
                        ? 'border-green-500 bg-green-600/30'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {editData.profilePhotos?.[idx] ? (
                      <img
                        src={editData.profilePhotos[idx]}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-12 bg-slate-700 flex items-center justify-center text-slate-500 text-xs">
                        Foto {idx + 1}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={downloadPDF}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Descargar Carnet PDF
            </button>
          </div>
        </div>

        {/* Contenido derecho */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos Personales */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Datos Personales</h3>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 font-semibold mb-2 block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={editData.fullName || ''}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 font-semibold mb-2 block">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Fotos */}
                <div>
                  <label className="text-sm text-slate-300 font-semibold mb-3 block">
                    Fotos de Perfil (máximo 2)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map(idx => (
                      <div key={idx} className="relative">
                        {editData.profilePhotos?.[idx] ? (
                          <div className="relative">
                            <img
                              src={editData.profilePhotos[idx]}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-green-600"
                            />
                            <button
                              onClick={() => {
                                const updated = [...(editData.profilePhotos || [])];
                                updated.splice(idx, 1);
                                setEditData({ ...editData, profilePhotos: updated });
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-600 transition bg-slate-700/30">
                            <Upload size={24} className="text-slate-500" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, idx)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enlaces */}
                <div>
                  <label className="text-sm text-slate-300 font-semibold mb-2 block">
                    Enlaces de Redes Sociales
                  </label>
                  <input
                    type="url"
                    placeholder="Facebook, TikTok, etc."
                    value={editData.mediaLinks?.[0] || ''}
                    onChange={(e) => {
                      const updated = [...(editData.mediaLinks || [])];
                      updated[0] = e.target.value;
                      setEditData({ ...editData, mediaLinks: updated });
                    }}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveEdits}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData(person);
                    }}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2.5 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Nombre</p>
                  <p className="text-lg font-semibold text-white">{person.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Teléfono</p>
                  <p className="text-lg font-semibold text-green-400">{person.phone}</p>
                </div>
                {person.mediaLinks?.[0] && (
                  <div>
                    <p className="text-sm text-slate-400">Redes Sociales</p>
                    <a
                      href={person.mediaLinks[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2"
                    >
                      <LinkIcon size={16} />
                      Ver perfil
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actividades */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Participación en Actividades ({personActivities.length} / {activities.length})
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {personActivities.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Sin actividades registradas</p>
              ) : (
                personActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="bg-slate-700/50 border border-green-600/30 rounded-lg p-3 hover:border-green-600/60 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{activity.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{activity.date}</p>
                        {activity.mediaLink && (
                          <a
                            href={activity.mediaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                          >
                            <LinkIcon size={12} />
                            Ver en redes
                          </a>
                        )}
                      </div>
                      <div className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                        ✓ Asistió
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

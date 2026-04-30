import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Plus, Eye, Download, Mail } from 'lucide-react';
import { DataManager } from '../utils/DataManager';

export default function PeopleList({ data, userRole, onSelectPerson, onDataUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({ fullName: '', phone: '' });
  const [error, setError] = useState('');

  const filteredAndSorted = useMemo(() => {
    if (!data) return [];

    let filtered = data.people.filter(person =>
      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm)
    );

    if (sortBy === 'attendance') {
      filtered.sort((a, b) => (b.attendances || 0) - (a.attendances || 0));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    return filtered;
  }, [data, searchTerm, sortBy]);

  const handleAddPerson = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPerson.fullName.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      const person = {
        id: Date.now().toString(),
        fullName: newPerson.fullName,
        phone: newPerson.phone,
        attendances: 0,
        profilePhotos: [],
        mediaLinks: []
      };

      await DataManager.addPerson(person);
      setNewPerson({ fullName: '', phone: '' });
      setShowAddForm(false);
      onDataUpdate();
    } catch (err) {
      setError('Error al agregar persona');
    }
  };

  const handleDeletePerson = async (personId) => {
    try {
      await DataManager.deletePerson(personId);
      setShowDeleteConfirm(null);
      onDataUpdate();
    } catch (err) {
      setError('Error al eliminar persona');
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent mb-2">
          Participantes
        </h2>
        <p className="text-slate-400">Listado de {filteredAndSorted.length} participantes</p>
      </div>

      {/* Controles */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Búsqueda */}
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-3 top-3 text-green-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
            />
          </div>

          {/* Ordenar */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
          >
            <option value="name">Ordenar por nombre</option>
            <option value="attendance">Mayor asistencia</option>
          </select>
        </div>

        {/* Botón agregar */}
        {userRole === 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-2.5 px-4 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Agregar Participante
          </button>
        )}
      </div>

      {/* Formulario Agregar */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-600/30 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Nuevo Participante</h3>
          {error && (
            <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleAddPerson} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              value={newPerson.fullName}
              onChange={(e) => setNewPerson({ ...newPerson, fullName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={newPerson.phone}
              onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Participantes */}
      <div className="grid gap-4">
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users size={48} className="mx-auto opacity-30 mb-4" />
            <p>No se encontraron participantes</p>
          </div>
        ) : (
          filteredAndSorted.map(person => (
            <div
              key={person.id}
              className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-4 hover:border-green-600/50 transition shadow-lg group"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Avatar y datos */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {person.profilePhotos?.[0] ? (
                      <img
                        src={person.profilePhotos[0]}
                        alt={person.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{person.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-green-400 transition cursor-pointer"
                      onClick={() => onSelectPerson(person.id)}>
                      {person.fullName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {person.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity size={14} className="text-green-400" />
                        {person.attendances || 0} actividades
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges de participación */}
                <div className="text-right">
                  <div className="inline-block bg-gradient-to-r from-green-600/20 to-red-600/20 border border-green-600/50 rounded-full px-3 py-1">
                    <span className="text-sm font-bold text-green-400">{person.attendances || 0}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPerson(person.id)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition"
                    title="Ver perfil"
                  >
                    <Eye size={18} />
                  </button>

                  {userRole === 'admin' && (
                    <>
                      <button
                        onClick={() => onSelectPerson(person.id)}
                        className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(person.id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Confirmación de eliminación */}
              {showDeleteConfirm === person.id && (
                <div className="mt-4 pt-4 border-t border-slate-700 bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-300 mb-3">¿Eliminar a {person.fullName}?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Activity({ size }) {
  return <TrendingUp size={size} />;
}

import { TrendingUp } from 'lucide-react';

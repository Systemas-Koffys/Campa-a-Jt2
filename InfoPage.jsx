import React from 'react';
import { Download, Facebook, Music, FileText, Database, ExternalLink, Mail } from 'lucide-react';

export default function InfoPage() {
  const links = [
    {
      category: 'Documentos Campaña',
      icon: FileText,
      color: 'from-blue-600 to-blue-800',
      items: [
        {
          title: 'Informe Campaña',
          description: 'Documento Word con detalles de la campaña',
          icon: FileText,
          action: 'Descargar',
          url: '#' // Usuario agregará el link a Dropbox
        },
        {
          title: 'Datos Excel',
          description: 'Lista de asistencia y participantes',
          icon: Database,
          action: 'Descargar',
          url: '#'
        }
      ]
    },
    {
      category: 'Redes Sociales',
      icon: Facebook,
      color: 'from-red-600 to-red-800',
      items: [
        {
          title: 'Facebook Campaña',
          description: 'Síguenos en Facebook',
          icon: Facebook,
          action: 'Ir a Facebook',
          url: '#'
        },
        {
          title: 'TikTok Campaña',
          description: 'Videos de las actividades',
          icon: Music,
          action: 'Ir a TikTok',
          url: '#'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent mb-2">
          Información Adicional
        </h2>
        <p className="text-slate-400">
          Accede a documentos, redes sociales y más información sobre la campaña
        </p>
      </div>

      {/* Logos de campaña */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 text-center shadow-xl hover:shadow-2xl transition">
          <img
            src="https://i.postimg.cc/VvQp16sf/L-COLOR.png"
            alt="Primero Tarija"
            className="h-20 mx-auto mb-3"
          />
          <h3 className="font-bold text-white">Primero Tarija</h3>
          <p className="text-sm text-slate-400 mt-2">Alianza electoral 2026</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 text-center shadow-xl hover:shadow-2xl transition">
          <img
            src="https://i.postimg.cc/wjj6nWbb/IMG-6256.png"
            alt="Equipo Marcelo"
            className="h-20 mx-auto mb-3 rounded-lg"
          />
          <h3 className="font-bold text-white">Equipo Marcelo Zenteno</h3>
          <p className="text-sm text-slate-400 mt-2">Candidato Concejal</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-900/30 p-6 text-center shadow-xl hover:shadow-2xl transition">
          <img
            src="https://i.postimg.cc/Yjcp5kZy/j-HO-1.png"
            alt="Johnny Torres"
            className="h-20 mx-auto mb-3 rounded-lg"
          />
          <h3 className="font-bold text-white">Johnny Torres</h3>
          <p className="text-sm text-slate-400 mt-2">Candidato Alcalde</p>
        </div>
      </div>

      {/* Información sobre la campaña */}
      <div className="bg-gradient-to-br from-green-900/20 to-slate-900/20 rounded-xl border border-green-600/30 p-8 shadow-xl">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Sobre la Campaña</h3>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Esta es la campaña política del <span className="font-bold text-green-400">Equipo Marcelo Zenteno</span> dentro de la alianza
              <span className="font-bold text-red-400"> PRIMERO TARIJA</span> para las elecciones municipales 2026 del Distrito 6 en Tarija.
            </p>
            <p>
              El equipo está apoyando la candidatura de <span className="font-bold text-red-400">Johnny Torres</span> para
              <span className="font-bold text-green-400"> Alcalde Municipal</span>, con el objetivo de brindar una nueva
              visión de gestión que beneficie a todos los barrios del distrito.
            </p>
            <p>
              La campaña ha realizado múltiples actividades incluyendo rastrillajes, caravanas, seminarios y eventos
              comunitarios para conectar con los ciudadanos y conocer sus necesidades.
            </p>
          </div>
        </div>
      </div>

      {/* Enlaces */}
      {links.map((section, idx) => {
        const SectionIcon = section.icon;
        return (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`bg-gradient-to-br ${section.color} p-3 rounded-lg`}>
                <SectionIcon size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">{section.category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, itemIdx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={itemIdx}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 hover:border-green-600/50 p-6 shadow-lg transition group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <ItemIcon size={24} className="text-green-400 group-hover:text-green-300" />
                      <ExternalLink size={18} className="text-slate-500 group-hover:text-green-400 opacity-0 group-hover:opacity-100 transition" />
                    </div>

                    <h4 className="font-bold text-white mb-2 group-hover:text-green-400 transition">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-400 mb-4">
                      {item.description}
                    </p>

                    <button
                      onClick={() => item.url !== '#' && window.open(item.url, '_blank')}
                      disabled={item.url === '#'}
                      className={`w-full py-2.5 px-4 rounded-lg font-semibold transition transform ${ 
                        item.url === '#'
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:scale-105'
                      } flex items-center justify-center gap-2`}
                    >
                      <Download size={16} />
                      {item.action}
                    </button>

                    {item.url === '#' && (
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Link pendiente de configurar
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Instrucciones */}
      <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 rounded-xl border border-purple-600/30 p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">📋 Cómo configurar los enlaces</h3>
        <div className="text-slate-300 space-y-2 text-sm">
          <p>1. Copia el enlace de Dropbox donde subiste los documentos</p>
          <p>2. Reemplaza los URL `#` en la sección de "Información Adicional"</p>
          <p>3. Agrega los enlaces a tus redes sociales (Facebook y TikTok)</p>
          <p className="mt-4 text-purple-300 font-semibold">
            Los enlaces se pueden editar en el archivo de componentes o crear un panel de administración
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-slate-700">
        <div className="space-y-3">
          <div className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-3 rounded-full font-bold text-lg">
            ⚡ Desarrollado por <span className="text-yellow-200">Sistemas Koffy's</span>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Equipo Marcelo Zenteno • Alianza Primero Tarija • 2026
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Para contacto o soporte, comunícate con el equipo técnico
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, Home, Users, BarChart3, Settings, Info } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PeopleList from './components/PeopleList';
import PersonProfile from './components/PersonProfile';
import AdminPanel from './components/AdminPanel';
import InfoPage from './components/InfoPage';
import { DataManager } from './utils/DataManager';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadData = async () => {
      const loadedData = await DataManager.loadData();
      setData(loadedData);
    };
    loadData();
  }, [refreshKey]);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage('dashboard');
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('dashboard');
    setSelectedPersonId(null);
  };

  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleNavigateToPerson = (personId) => {
    setSelectedPersonId(personId);
    setCurrentPage('person-profile');
    setSidebarOpen(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'people', label: 'Participantes', icon: Users },
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Administración', icon: Settings }] : []),
    { id: 'info', label: 'Información', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-green-900 via-slate-800 to-red-900 border-b-2 border-red-500 shadow-2xl">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <img
              src="https://i.postimg.cc/VvQp16sf/L-COLOR.png"
              alt="Primero Tarija"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-white font-bold text-lg">DISTRITO 6</h1>
              <p className="text-red-300 text-xs">Campaña 2026</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <div className="flex h-screen pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-green-900 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } z-40 h-[calc(100vh-70px)] overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition transform hover:scale-105 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 mt-4 border-t border-slate-700">
              <div className="px-4 py-2 text-xs text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">Usuario: {userRole}</p>
                <p className="text-slate-500">Sesión activa</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {currentPage === 'dashboard' && (
              <Dashboard data={data} onSelectPerson={handleNavigateToPerson} />
            )}
            {currentPage === 'people' && (
              <PeopleList
                data={data}
                userRole={userRole}
                onSelectPerson={handleNavigateToPerson}
                onDataUpdate={handleDataUpdate}
              />
            )}
            {currentPage === 'person-profile' && selectedPersonId && (
              <PersonProfile
                personId={selectedPersonId}
                data={data}
                onBack={() => setCurrentPage('people')}
                userRole={userRole}
                onDataUpdate={handleDataUpdate}
              />
            )}
            {currentPage === 'admin' && userRole === 'admin' && (
              <AdminPanel data={data} onDataUpdate={handleDataUpdate} />
            )}
            {currentPage === 'info' && <InfoPage />}
          </div>
        </main>
      </div>

      {/* Overlay para sidebar móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, User, Monitor, Smartphone, Tablet, Search, Activity } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:3000/status');
      const json = await res.json();
      if (json.accounts) {
        setData(json.accounts);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter(acc => 
    acc.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDeviceIcon = (deviceType) => {
    switch (deviceType.toLowerCase()) {
      case 'laptop': return <Monitor className="w-5 h-5 text-zinc-400" />;
      case 'desktop': return <Monitor className="w-5 h-5 text-zinc-400" />;
      case 'tablet': return <Tablet className="w-5 h-5 text-zinc-400" />;
      case 'phone': return <Smartphone className="w-5 h-5 text-zinc-400" />;
      default: return <Monitor className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 text-zinc-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 flex items-center gap-3">
              <Activity className="text-emerald-400" /> Navtrac Session Monitor
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg">
              Real-time surveillance of concurrent account usage across all configured devices.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-2xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.length === 0 ? (
            <div className="col-span-full py-20 text-center text-zinc-500 flex flex-col items-center">
              <div className="w-20 h-20 mb-6 rounded-[2rem] bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/50" />
              </div>
              <p className="text-xl font-medium text-zinc-400">All Systems Nominal</p>
              <p className="text-sm mt-2">No active sessions or user activity found right now.</p>
            </div>
          ) : (
            filteredData.map((account) => (
              <div 
                key={account.email} 
                className={`glass-panel rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group ${
                  account.conflict ? 'ring-2 ring-red-500/50 bg-red-950/10' : 'hover:border-zinc-700'
                }`}
              >
                {account.conflict && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/80 to-rose-500/80"></div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Account</span>
                    <span className="font-medium text-zinc-200 truncate pr-4 text-lg" title={account.email}>{account.email}</span>
                  </div>
                  {account.conflict ? (
                     <div className="bg-red-500/10 text-red-400 p-2 rounded-xl flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
                        <ShieldAlert className="w-6 h-6" />
                     </div>
                  ) : (
                     <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                  )}
                </div>

                {account.conflict && (
                  <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Conflict Detected: Multiple Active Sessions
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">Active Sessions ({account.activeSessions.length})</h3>
                  {account.activeSessions.map((session) => (
                    <div key={session.sessionId} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-800 p-2 rounded-xl">
                          {getDeviceIcon(session.device)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                            {session.name}
                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 border border-zinc-700">{session.device}</span>
                          </p>
                          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live now
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

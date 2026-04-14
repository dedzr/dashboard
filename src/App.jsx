import { useState } from "react";
import {
    ShieldAlert,
    CheckCircle2,
    Monitor,
    Smartphone,
    Tablet,
    Search,
    Activity,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// 🔥 React Query fetcher
const fetchStatus = async () => {
    const res = await fetch(`${API_URL}/status`);

    if (!res.ok) {
        throw new Error("Failed to fetch");
    }

    const json = await res.json();
    return Array.isArray(json.accounts) ? json.accounts : [];
};

function App() {
    const [searchQuery, setSearchQuery] = useState("");

    // 🔥 React Query hook
    const {
        data = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["accounts"],
        queryFn: fetchStatus,
        refetchInterval: 3000, // 🔄 replaces setInterval
        refetchOnWindowFocus: true,
    });

    const filteredData = data.filter((acc) =>
        acc?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getDeviceIcon = (deviceType = "") => {
        switch (deviceType.toLowerCase()) {
            case "laptop":
            case "desktop":
                return <Monitor className="w-5 h-5 text-zinc-400" />;
            case "tablet":
                return <Tablet className="w-5 h-5 text-zinc-400" />;
            case "phone":
                return <Smartphone className="w-5 h-5 text-zinc-400" />;
            default:
                return <Monitor className="w-5 h-5 text-zinc-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 text-zinc-100 p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel rounded-3xl p-8 relative overflow-hidden">
                    <div>
                        <h1 className="text-4xl font-extrabold flex items-center gap-3">
                            <Activity /> Navtrac Session Monitor
                        </h1>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl"
                        />
                    </div>
                </header>

                {/* 🔥 Loading */}
                {isLoading && (
                    <div className="text-center py-20 text-zinc-400">
                        Loading sessions...
                    </div>
                )}

                {/* 🔥 Error */}
                {error && (
                    <div className="text-center py-20 text-red-400">
                        Failed to load data
                    </div>
                )}

                {/* Dashboard */}
                {!isLoading && !error && (
                    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Empty */}
                        {data.length === 0 && (
                            <div className="col-span-full py-20 text-center text-zinc-500">
                                No active sessions
                            </div>
                        )}

                        {/* No search results */}
                        {data.length > 0 && filteredData.length === 0 && (
                            <div className="col-span-full py-20 text-center text-zinc-500">
                                No results found
                            </div>
                        )}

                        {filteredData.map((account, index) => {
                            const sessions = account?.activeSessions || [];

                            return (
                                <div
                                    key={`${account?.email}-${index}`}
                                    className={`glass-panel rounded-3xl p-6 ${
                                        account?.conflict
                                            ? "ring-2 ring-red-500/50 bg-red-950/10"
                                            : ""
                                    }`}
                                >
                                    <div className="flex justify-between mb-6">
                                        <div>
                                            <span className="text-xs text-zinc-500">
                                                Account
                                            </span>
                                            <p className="text-lg">
                                                {account?.email}
                                            </p>
                                        </div>

                                        {account?.conflict ? (
                                            <ShieldAlert className="text-red-400" />
                                        ) : (
                                            <CheckCircle2 className="text-emerald-400" />
                                        )}
                                    </div>

                                    {account?.conflict && (
                                        <div className="text-red-400 text-sm mb-4">
                                            Multiple active sessions detected
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs text-zinc-500 mb-2">
                                            Active Sessions ({sessions.length})
                                        </p>

                                        {sessions.map((session) => (
                                            <div
                                                key={session.sessionId}
                                                className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl mb-2"
                                            >
                                                {getDeviceIcon(session.device)}

                                                <div>
                                                    <p className="text-sm">
                                                        {session.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-400">
                                                        {session.device}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </main>
                )}
            </div>
        </div>
    );
}

export default App;

import React from 'react';

const CommitsMockup = () => {
    return (
        <div className="w-full h-full bg-[#0F172A] p-8 flex font-sans select-none overflow-hidden relative">
            {/* Timeline Line */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-slate-800" />

            <div className="flex-1 space-y-8 relative z-10 pl-12">
                {[
                    { title: "feat: implement vector search", author: "vidhu", time: "2h ago", color: "bg-blue-500" },
                    { title: "fix: race condition in auth", author: "Devansh", time: "5h ago", color: "bg-indigo-500" },
                    { title: "chore: update dependencies", author: "Parth", time: "1d ago", color: "bg-slate-500" }
                ].map((item, i) => (
                    <div key={i} className="relative group">
                        {/* Node */}
                        <div className={`absolute -left-[3.25rem] top-6 w-4 h-4 rounded-full border-4 border-[#0F172A] ${item.color} shadow-[0_0_10px_rgba(59,130,246,0.3)]`} />

                        {/* Card */}
                        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="font-mono text-sm text-slate-200 font-medium">{item.title}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-500 pl-5">
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {item.author[0]}
                                </div>
                                <span>{item.author}</span>
                                <span>•</span>
                                <span>{item.time}</span>
                            </div>
                            {/* Dummy description lines */}
                            <div className="mt-4 pl-5 space-y-2 opacity-50">
                                <div className="w-3/4 h-2 bg-slate-800 rounded" />
                                <div className="w-1/2 h-2 bg-slate-800 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommitsMockup;

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, GitGraph, MessageSquare, CheckCircle2 } from 'lucide-react';
import { fadeUp } from '../../animations/transitions';

const FeatureBlock = ({ title, description, icon: Icon, align = 'left', children }) => {
    return (
        <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 py-24 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
            {/* Text Content */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="flex-1 space-y-8"
            >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                    {title}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                    {description}
                </p>
                <ul className="space-y-4">
                    {['Instant Analysis', 'Deep Context', 'Actionable Insights'].map((item, i) => (
                        <li key={i} className="flex items-center text-gray-700 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" />
                            {item}
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Visual Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                    {/* Browser/Window Header */}
                    <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    {/* Content */}
                    <div className="p-1">
                        {children}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const FeatureScene = () => {
    return (
        <section id="features" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Feature 1: AI Analysis */}
                <FeatureBlock
                    title="Deep Codebase Understanding"
                    description="Don't just read code—understand it. GitScope analyzes your entire repository structure, dependencies, and logic flow to give you a complete mental model in seconds."
                    icon={Brain}
                    align="left"
                >
                    <div className="bg-slate-900 p-6 rounded-b-xl font-mono text-sm text-slate-300 space-y-4 min-h-[300px]">
                        <div className="flex">
                            <span className="text-blue-400 mr-4">$</span>
                            <span>gitscope analyze --deep</span>
                        </div>
                        <div className="text-slate-500">Analyzing repository architecture...</div>
                        <div className="space-y-2 pl-4 border-l-2 border-slate-700">
                            <div className="flex justify-between">
                                <span>src/auth/</span>
                                <span className="text-blue-400">98% coverage</span>
                            </div>
                            <div className="flex justify-between">
                                <span>src/database/</span>
                                <span className="text-blue-400">Complex Schema Detected</span>
                            </div>
                            <div className="flex justify-between">
                                <span>src/api/routes/</span>
                                <span className="text-yellow-400">Optimization Suggested</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded border border-slate-700 mt-4">
                            <span className="text-blue-300 font-bold">Insight:</span> Auth flow uses deprecated JWT implementation. Recommended upgrade to OAuth2 flow for better security.
                        </div>
                    </div>
                </FeatureBlock>

                {/* Feature 2: Commit History */}
                <FeatureBlock
                    title="Turn Commits into Stories"
                    description="Stop digging through git logs. GitScope transforms your commit history into a clear, narrative timeline of your project's evolution."
                    icon={GitGraph}
                    align="right"
                >
                    <div className="bg-white p-6 rounded-b-xl min-h-[300px] relative">
                        <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-200" />
                        {[
                            { msg: "feat: implement vector search", author: "vidhu", time: "2h ago", color: "bg-blue-500" },
                            { msg: "fix: race condition in auth", author: "Devansh", time: "5h ago", color: "bg-indigo-500" },
                            { msg: "chore: update dependencies", author: "Parth", time: "1d ago", color: "bg-gray-400" },
                        ].map((commit, i) => (
                            <div key={i} className="relative pl-12 mb-8 last:mb-0">
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${commit.color} z-10`} style={{ left: '26px' }} />
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="font-mono text-sm font-bold text-gray-900">{commit.msg}</div>
                                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[10px]">{commit.author[0].toUpperCase()}</div>
                                        <span>{commit.author}</span>
                                        <span>•</span>
                                        <span>{commit.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </FeatureBlock>

                {/* Feature 3: Chat */}
                <FeatureBlock
                    title="Chat with Your Code"
                    description="Ask questions like 'Where is the auth logic?' or 'How do I add a new endpoint?' and get instant, context-aware answers pointing to the exact lines of code."
                    icon={MessageSquare}
                    align="left"
                >
                    <div className="bg-white p-0 rounded-b-xl min-h-[300px] flex flex-col">
                        <div className="flex-1 p-6 space-y-4 bg-slate-50">
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[80%] shadow-sm">
                                    Where is the user validation logic?
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] border border-gray-200 shadow-sm">
                                    <p className="mb-2">It's located in <code className="bg-gray-100 px-1 rounded text-blue-600 font-mono">src/utils/validation.js</code>.</p>
                                    <div className="bg-gray-900 text-gray-300 p-3 rounded font-mono text-xs overflow-x-auto">
                                        export const validateUser = (user) =&gt; &#123;<br />
                                        &nbsp;&nbsp;if (!user.email) throw new Error...<br />
                                        &#125;
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="h-10 bg-gray-100 rounded-full w-full animate-pulse" />
                        </div>
                    </div>
                </FeatureBlock>

            </div>
        </section>
    );
};

export default FeatureScene;

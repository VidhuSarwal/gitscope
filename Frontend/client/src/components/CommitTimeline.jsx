import { motion } from 'framer-motion';
import { GitCommit, User, Calendar } from 'lucide-react';

const CommitTimeline = ({ commits }) => {
    if (!commits || commits.length === 0) return <div className="text-center text-gray-400 italic">No commits found.</div>;

    return (
        <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 py-4">
            {commits.map((commit, index) => (
                <motion.div
                    key={commit.commit_hash}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-8"
                >
                    <div className="absolute -left-[9px] top-0 bg-[#0F172A] border-2 border-blue-500 rounded-full p-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        <GitCommit className="h-3 w-3 text-blue-500" />
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-slate-800 shadow-lg hover:shadow-blue-900/20 hover:border-blue-500/30 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{commit.message}</h3>
                            <div className="flex items-center text-sm text-gray-400 mt-2 sm:mt-0">
                                <Calendar className="h-4 w-4 mr-1" />
                                {commit.date}
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center mr-2 border border-slate-700">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-300">{commit.author}</span>
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 bg-slate-950/50 p-4 rounded-lg italic border-l-4 border-blue-500/50">
                            "{commit.story}"
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default CommitTimeline;

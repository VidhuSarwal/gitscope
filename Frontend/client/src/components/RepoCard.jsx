import { Link } from 'react-router-dom';
import { GitBranch, Calendar, ArrowRight, Trash2 } from 'lucide-react';

const RepoCard = ({ repo, onDelete }) => {
    const handleDelete = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop event bubbling

        if (window.confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
            onDelete(repo._id || repo.id);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl shadow-lg hover:shadow-blue-900/20 hover:border-blue-500/30 transition-all duration-300 overflow-hidden group relative">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white truncate pr-4 group-hover:text-blue-400 transition-colors max-w-[80%]">{repo.repo_name || repo.name}</h3>

                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Analyzed
                        </span>
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors z-10"
                                title="Delete Repository"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
                    {repo.summary || repo.description || 'No description available.'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-white/5">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>{new Date(repo.updated_at || repo.lastAnalyzed).toLocaleDateString()}</span>
                    </div>
                    <Link
                        to={`/repo/${repo._id || repo.id}/overview`}
                        className="flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        Open <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RepoCard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';
import RepoCard from '../components/RepoCard';
import { Search } from 'lucide-react';

const Home = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await axiosInstance.get('/user/repos');
                setRepos(response.data);
            } catch (err) {
                console.error('Failed to load repositories', err);
            } finally {
                setLoadingRepos(false);
            }
        };

        fetchRepos();
    }, []);

    const handleAnalyze = async () => {
        if (!repoUrl) return;
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.post('/repo/analyze', { repo_url: repoUrl });
            const repoId = response.data.repo_id || response.data.id;
            navigate(`/repo/${repoId}/overview`);
        } catch (err) {
            console.error("Analysis failed", err);
            setError('Failed to analyze repository. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Loader text="Analyzing repository... This may take a moment." fullScreen={true} />
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] font-sans pt-16">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Hero / Search Section */}
            <div className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-sm py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Understand GitHub Repositories with AI</h1>
                    <p className="text-gray-400 mb-10 text-lg">Analyze repositories, view commit stories, and get insights instantly.</p>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="flex shadow-2xl rounded-xl overflow-hidden border border-white/10 bg-slate-900/50">
                            <div className="relative flex-grow focus-within:z-10">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-0 focus:border-transparent block w-full rounded-none pl-12 sm:text-sm border-none py-4 bg-transparent text-white placeholder-gray-500"
                                    placeholder="Enter GitHub Repository URL (e.g., owner/repo)"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                className="-ml-px relative inline-flex items-center space-x-2 px-8 py-4 border-l border-white/10 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none transition-colors"
                            >
                                Analyze
                            </button>
                        </div>
                        {error && <p className="mt-3 text-sm text-red-400 text-left pl-1">{error}</p>}
                    </div>
                </div>
            </div>

            {/* Recent Analyses Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                    <span className="bg-blue-500/10 text-blue-400 p-2 rounded-lg mr-3">
                        <Search className="w-5 h-5" />
                    </span>
                    Recent Analyses
                </h2>
                {loadingRepos ? (
                    <div className="flex justify-center py-12">
                        <Loader text="Loading repositories..." />
                    </div>
                ) : repos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repos.map((repo) => (
                            <RepoCard
                                key={repo._id || repo.id}
                                repo={repo}
                                onDelete={async (repoId) => {
                                    try {
                                        await axiosInstance.delete(`/repo/${repoId}`);
                                        setRepos(repos.filter(r => (r._id || r.id) !== repoId));
                                    } catch (err) {
                                        console.error("Failed to delete repo", err);
                                        // Optional: Show an error toast/message
                                    }
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                        <p className="text-gray-500 text-lg">No repositories analyzed yet. Try analyzing one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

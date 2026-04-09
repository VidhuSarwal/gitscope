import { useParams, Link } from 'react-router-dom';
import Contributors from '../components/Contributors';
import { ArrowRight, Code, Users, BookOpen, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';

const RepoOverview = () => {
    const { id } = useParams();
    const [summary, setSummary] = useState(null);
    const [contributors, setContributors] = useState([]);
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    axiosInstance.get(`/repo/${id}/summary`),
                    axiosInstance.get(`/repo/${id}/contributors`),
                    axiosInstance.get(`/repo/${id}/story`)
                ]);

                const [summaryRes, contributorsRes, storyRes] = results;

                if (summaryRes.status === 'fulfilled') {
                    const data = summaryRes.value.data;
                    // Map backend fields to frontend expectations
                    setSummary({
                        summary: data.summary,
                        tech_stack: data.technologies, // Backend returns 'technologies'
                        key_functions: data.functions  // Backend returns 'functions'
                    });
                } else {
                    console.error('Failed to fetch summary:', summaryRes.reason);
                }

                if (contributorsRes.status === 'fulfilled') {
                    setContributors(contributorsRes.value.data || []);
                } else {
                    console.error('Failed to fetch contributors:', contributorsRes.reason);
                }

                if (storyRes.status === 'fulfilled') {
                    setStory(storyRes.value.data);
                } else {
                    console.warn('Failed to fetch story:', storyRes.reason);
                }
            } catch (err) {
                // This catch block might not be reached with allSettled unless something else fails
                console.error('Unexpected error fetching data:', err);
                setError('Partial data load failure. Check console for details.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <Loader text="Loading repository details..." fullScreen={true} />;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (

        <div className="min-h-screen bg-[#0F172A] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Repository Overview</h1>
                        <p className="text-gray-400 mt-1 text-sm font-mono">ID: {id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Summary & Story (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Summary */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-white flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Project Summary
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {summary?.summary || 'No summary available.'}
                            </p>
                        </div>

                        {/* Project Evolution */}
                        {story && story.story && (
                            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                                <h2 className="mb-4 text-xl font-bold text-white flex items-center">
                                    <History className="w-5 h-5 mr-2 text-purple-500" /> Project Evolution
                                </h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-4 rounded-lg border-l-4 border-purple-500/50">
                                        {story.story}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Actions, Insights, Contributors (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Actions */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    to={`/repo/${id}/file-analysis`}
                                    className="flex items-center justify-center w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                                >
                                    Analyze Files <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Link
                                    to={`/repo/${id}/commits`}
                                    className="flex items-center justify-center w-full px-4 py-3 font-bold text-blue-400 bg-blue-600/10 rounded-lg hover:bg-blue-600/20 border border-blue-500/20 transition-colors"
                                >
                                    View Commit Story <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Code Insights */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                            <h2 className="mb-4 text-lg font-bold text-white flex items-center">
                                <Code className="w-5 h-5 mr-2 text-green-500" /> Code Insights
                            </h2>

                            <div className="mb-6">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {summary?.tech_stack?.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20">
                                            {tech}
                                        </span>
                                    )) || <span className="text-gray-500 text-sm">No technologies detected.</span>}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Key Functions</h3>
                                <ul className="space-y-2">
                                    {summary?.key_functions?.map((func, i) => (
                                        <li key={i} className="text-sm text-gray-300 flex items-start">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                            <span className="font-mono text-xs bg-slate-950/50 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">{func}</span>
                                        </li>
                                    )) || <li className="text-sm text-gray-500">No key functions identified.</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Contributors */}
                        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6">
                            <h2 className="mb-4 text-lg font-bold text-white flex items-center">
                                <Users className="w-5 h-5 mr-2 text-orange-500" /> Contributors
                            </h2>
                            <Contributors contributors={contributors} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoOverview;

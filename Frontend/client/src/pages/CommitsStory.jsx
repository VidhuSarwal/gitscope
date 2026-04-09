import { useParams } from 'react-router-dom';
import CommitTimeline from '../components/CommitTimeline';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';

const CommitsStory = () => {
    const { id } = useParams();
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                // Using the story endpoint as it likely returns the enriched data
                const response = await axiosInstance.get(`/repo/${id}/commits/story`);
                setCommits(response.data);
            } catch (err) {
                setError('Failed to load commit story.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommits();
    }, [id]);

    if (loading) return <Loader text="Generating commit story..." fullScreen={true} />;
    if (error) return <div className="p-8 text-red-400">{error}</div>;

    return (
        <div className="min-h-screen bg-[#0F172A] pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white">Commit Story</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm">Repository ID: {id}</p>
                </div>

                <CommitTimeline commits={commits} />
            </div>
        </div>
    );
};
export default CommitsStory;

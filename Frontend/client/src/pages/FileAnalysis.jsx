import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import FileTree from '../components/FileTree';
import Loader from '../components/Loader';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Terminal, ChevronDown, ChevronRight } from 'lucide-react';

const FunctionItem = ({ func }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden">
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center overflow-hidden">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />}
                    <h3 className="font-mono text-sm font-bold text-blue-400 truncate">
                        {func.name}
                    </h3>
                </div>
            </div>
            {isOpen && (
                <div className="p-3 bg-slate-950/30 border-t border-slate-800">
                    <p className="text-xs text-gray-400 font-mono mb-2 bg-slate-900 p-1 rounded break-all border border-slate-800">
                        <span className="font-semibold text-gray-300">Params:</span> {func.parameters}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {func.description}
                    </p>
                </div>
            )}
        </div>
    );
};

const FileAnalysis = () => {
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');

    // Fetch file structure on mount
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axiosInstance.get(`/repo/${id}/files`);
                setFiles(response.data || []);
            } catch (err) {
                console.error('Failed to fetch files:', err);
                setError('Failed to load file structure.');
            } finally {
                setLoadingFiles(false);
            }
        };
        fetchFiles();
    }, [id]);

    // Handle file selection
    const handleFileClick = async (file) => {
        if (file.type !== 'file' && file.type !== 'blob') return; // Only handle files

        setSelectedFile(file);
        setFileContent('');
        setAnalysis(null);
        setLoadingContent(true);
        setAnalyzing(true);

        try {
            // 1. Fetch File Content
            const contentRes = await axiosInstance.post(`/repo/${id}/file/content`, {
                file_path: file.path
            });
            setFileContent(contentRes.data.content);

            // 2. Analyze File
            const analyzeRes = await axiosInstance.post(`/repo/${id}/file/analyze`, {
                file_path: file.path
            });
            setAnalysis(analyzeRes.data.functions);

        } catch (err) {
            console.error('Error fetching file details:', err);
            if (!fileContent) setFileContent('Error loading file content.');
        } finally {
            setLoadingContent(false);
            setAnalyzing(false);
        }
    };

    if (loadingFiles) return <Loader text="Loading file structure..." fullScreen={true} />;
    if (error) return <div className="p-8 text-red-400">{error}</div>;

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#0F172A] pt-16">
            {/* Left Sidebar: File Tree */}
            <div className="w-full md:w-1/4 bg-slate-900/50 border-r border-slate-800 flex flex-col h-full backdrop-blur-sm">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="font-semibold text-white flex items-center">
                        <Code className="w-4 h-4 mr-2 text-blue-500" /> Files
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <FileTree files={files} onFileClick={handleFileClick} selectedFile={selectedFile} />
                </div>
            </div>

            {/* Center: File Content */}
            <div className="w-full md:w-1/2 flex flex-col h-full bg-slate-950/50 border-r border-slate-800 backdrop-blur-sm">
                <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-mono">
                        {selectedFile ? selectedFile.path : 'Select a file'}
                    </span>
                    {analyzing && <span className="text-xs text-blue-400 animate-pulse">Analyzing...</span>}
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                    {selectedFile ? (
                        loadingContent ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader text="Loading content..." />
                            </div>
                        ) : (
                            <SyntaxHighlighter
                                language={selectedFile.path?.split('.').pop() || 'text'}
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, height: '100%', fontSize: '14px', background: 'transparent' }}
                                showLineNumbers={true}
                            >
                                {fileContent || ''}
                            </SyntaxHighlighter>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <Code className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>Select a file to view content and analysis</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar: Function Analysis */}
            <div className="w-full md:w-1/4 bg-slate-900/50 border-l border-slate-800 flex flex-col h-full backdrop-blur-sm">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="font-semibold text-white flex items-center">
                        <Terminal className="w-4 h-4 mr-2 text-green-500" /> Analysis
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {!selectedFile ? (
                        <p className="text-sm text-gray-500 text-center mt-10">Select a file to see AI analysis.</p>
                    ) : analyzing ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader text="Analyzing..." />
                        </div>
                    ) : analysis && analysis.length > 0 ? (
                        analysis.map((func, idx) => (
                            <FunctionItem key={idx} func={func} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center">No functions identified or analysis failed.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileAnalysis;

import { useState } from 'react';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileTreeNode = ({ name, type, children, level = 0, onFileClick, selectedFile, path }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFolder = type === 'folder' || type === 'directory';
    const isSelected = selectedFile && selectedFile.path === path;

    const toggleOpen = (e) => {
        e.stopPropagation();
        if (isFolder) setIsOpen(!isOpen);
        else if (onFileClick) onFileClick({ name, type, path });
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center py-1.5 px-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors ${level > 0 ? 'ml-4' : ''} ${isSelected ? 'bg-blue-600/20 text-blue-400' : ''}`}
                onClick={toggleOpen}
            >
                <span className="mr-2 text-gray-500">
                    {isFolder && (
                        isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                    {!isFolder && <span className="w-4 inline-block"></span>}
                </span>
                <span className="mr-2 text-blue-500">
                    {isFolder ? (
                        isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
                    ) : (
                        <FileCode className={`h-4 w-4 ${isSelected ? 'text-blue-400' : 'text-gray-500'}`} />
                    )}
                </span>
                <span className={`text-sm truncate ${isSelected ? 'font-medium text-blue-400' : 'text-gray-300'}`}>{name}</span>
            </div>
            <AnimatePresence>
                {isOpen && children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children.map((child, index) => {
                            // Construct path for child
                            const childPath = path ? `${path}/${child.name}` : child.name;
                            return (
                                <FileTreeNode
                                    key={index}
                                    {...child}
                                    path={childPath} // Pass constructed path
                                    level={level + 1}
                                    onFileClick={onFileClick}
                                    selectedFile={selectedFile}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FileTree = ({ files, onFileClick, selectedFile }) => {
    if (!files || files.length === 0) return <div className="text-gray-500 text-sm italic p-4">No files found.</div>;

    return (
        <div className="rounded-lg p-2 min-h-[200px]">
            {files.map((file, index) => (
                <FileTreeNode
                    key={index}
                    {...file}
                    path={file.name} // Initial path is the file/folder name
                    onFileClick={onFileClick}
                    selectedFile={selectedFile}
                />
            ))}
        </div>
    );
};

export default FileTree;

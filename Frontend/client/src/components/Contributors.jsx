import React from 'react';
import { ExternalLink } from 'lucide-react';

const Contributors = ({ contributors }) => {
    if (!contributors || contributors.length === 0) {
        return <div className="text-sm text-gray-400 italic">No contributors found.</div>;
    }

    return (
        <div className="grid grid-cols-4 gap-4">
            {contributors.map((contributor) => (
                <a
                    key={contributor.id || contributor.login}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                    title={contributor.login}
                >
                    <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm"
                    />
                    <span className="text-xs font-medium text-gray-400 mt-2 text-center group-hover:text-blue-400 break-words w-full leading-tight transition-colors">
                        {contributor.name || contributor.login}
                    </span>
                </a>
            ))}
        </div>
    );
};

export default Contributors;

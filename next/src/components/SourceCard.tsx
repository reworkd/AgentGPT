import React from 'react';
import { FaGlobe } from 'react-icons/fa';

interface SourceCardProps {
  title: string;
  link: string;
  position: number;
}

const SourceCard: React.FC<SourceCardProps> = ({ title, link, position }) => {
  return (
    <div className={`flex items-center p-2 border max-w-fit bg-gray-400 border-gray-400 rounded-md mt-2 ${position === 1 ? 'bg-yellow-100' : 'bg-blue-100'}`}>
      <FaGlobe className="w-6 h-6 text-gray-600 mr-2" />
      <div className="flex-grow">
        <p className="font-bold text-white">{title}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm hover:underline"
        >
          {link}
        </a>
      </div>
      <span className={`text-xs px-4 font-bold ${position === 1 ? 'text-yellow-500' : 'text-black'}`}>{position}</span>
    </div>
  );
}

export default SourceCard;

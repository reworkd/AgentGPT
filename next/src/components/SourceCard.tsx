import React from 'react';
import { FaGlobe } from 'react-icons/fa';

interface SourceCardProps {
  link: string;
  position: number;
}

const SourceCard = ({ link, position }: SourceCardProps) => {
  return (
    <div className="items-center p-2 border max-w-full flex gap-x-4 hover:border-white/40 bg-white/20 border-white/10 rounded-md">
      <FaGlobe className="w-6 h-6 text-white mr-2" />
      <div className="max-w-[9rem] max-h-6 text-inline whitespace-nowrap overflow-hidden">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-sm hover:underline"
        >
          {link}
        </a>
      </div>
      <span className="text-xs px-4 font-bold">[{position}]</span>
    </div>
  );
}

export default SourceCard;

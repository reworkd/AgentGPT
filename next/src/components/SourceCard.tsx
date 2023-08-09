import React from 'react';
import { FaGlobe } from 'react-icons/fa';

interface SourceCardProps {
  title: string;
  link: string;
  position: number;
}

const SourceCard = ({ title, link, position }:SourceCardProps) => {
  return (
    <div className="flex items-center mx-2 p-2 border max-w-fit hover:border-white/40 bg-white/20 border-white/10 rounded-md mt-2 ">
      <FaGlobe className="w-6 h-6 text-white mr-2" />
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
      <span className="text-xs px-4 font-bold">[{position}]</span>
    </div>
  );
}

export default SourceCard;

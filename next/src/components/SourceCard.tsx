import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import FadeIn from './motions/FadeIn';

interface SourceCardProps {
  link: string;
  position: number;
}

const SourceCard = ({ link, position }: SourceCardProps) => {
  return (
    <FadeIn duration={2} delay={0.5}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center p-2 border max-w-full hover:border-white/40 bg-white/20 border-white/10 rounded-md">
          <FaGlobe className="h-6 w-6 text-white mr-2" />
          <div className="max-w-[11rem] flex-grow text-blue-500 text-sm hover:underline truncate">
            {link}
          </div>
          <span className="text-xs px-4 font-bold">[{position}]</span>
        </div>
      </a>
    </FadeIn>
  );
}

export default SourceCard;

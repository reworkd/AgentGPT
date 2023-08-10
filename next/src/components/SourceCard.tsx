import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import FadeIn from './motions/FadeIn';

interface SourceCardProps {
  link: string;
  position: number;
}

const SourceCard = ({ link, position }: SourceCardProps) => {
  return (
    <FadeIn duration={2} delay={.5}>  
      <div className="items-center p-2 border max-w-full flex hover:border-white/40 bg-white/20 border-white/10 rounded-md">
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
      </a>
    </FadeIn>
  );
}

export default SourceCard;

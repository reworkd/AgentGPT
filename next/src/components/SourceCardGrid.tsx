import React from 'react';
import SourceCard from './SourceCard';
interface SourceCardGridProps {
    messageInfo: string;
  }
  
  export const SourceCardGrid = ({ messageInfo }: SourceCardGridProps) => {
    const linkRegex = /\[.*?\]\((.*?)\)/g;
    const matches = messageInfo?.match(linkRegex);
  
    if (matches) {
      const uniqueLinks = new Set<string>();
      const sourceCards: JSX.Element[] = [];
      let position = 1;
  
      for (const match of matches) {
        const [, link] = match.match(/\[.*?\]\((.*?)\)/) || [];
  
        if (!uniqueLinks.has(link)) {
          uniqueLinks.add(link);
          sourceCards.push(<SourceCard key={link} link={link} position={position} />);
          position++;
        }
      }
  
      return <div className="grid grid-cols-4 gap-2">{sourceCards}</div>;
    }
  
    return null;
  };
  
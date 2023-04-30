import type { ReactNode } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const MarkdownRenderer = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      code: CustomCodeBlock,
      pre: CustomPre,
      p: CustomParagraph,
      ul: (props) => <ul className="ml-8 list-disc">{props.children}</ul>,
      ol: (props) => <ol className="ml-8 list-decimal">{props.children}</ol>,
    }}
  >
    {children}
  </ReactMarkdown>
);

const CustomParagraph = ({ children }) => <p className="mb-4">{children}</p>;

const CustomPre = ({ children }) => <pre className="mb-4">{children}</pre>;

interface CustomCodeBlockProps {
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

const CustomCodeBlock = ({
  inline,
  className,
  children,
}: CustomCodeBlockProps) => {
  // Inline code blocks will be placed directly within a paragraph
  if (inline) {
    return (
      <code className="rounded bg-gray-200 px-1 py-[1px] text-black">
        {children}
      </code>
    );
  }

  const language = className ? className.replace("language-", "") : "plaintext";

  return <code className={`hljs ${language}`}>{children}</code>;
};

export default MarkdownRenderer;

import type { ReactNode } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface CustomCodeBlockProps {
  className?: string;
  children: ReactNode;
}

const CustomCodeBlock = ({ className, children }: CustomCodeBlockProps) => {
  const language = className ? className.replace("language-", "") : "plaintext";

  return <code className={`hljs ${language}`}>{children}</code>;
};

const CustomParagraph = ({ children }) => <p className="mb-4">{children}</p>;

const MarkdownRenderer = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      code: CustomCodeBlock,
      p: CustomParagraph,
      ul: (props) => <ul className="ml-8 list-disc">{props.children}</ul>,
      ol: (props) => <ol className="ml-8 list-decimal">{props.children}</ol>,
    }}
  >
    {children}
  </ReactMarkdown>
);

export default MarkdownRenderer;

import type { ReactNode } from "react";
import React, { useCallback, useState } from "react";
import { FaCopy } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/default.css";
import clsx from "clsx";

const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[() => rehypeHighlight({ ignoreMissing: true })]}
      components={{
        pre: CustomPre,
        code: CustomCodeBlock,
        h1: (props) => <h1 className="text-md mb-2 font-black sm:text-xl">{props.children}</h1>,
        h2: (props) => <h1 className="sm:text-md mb-2 text-sm font-bold">{props.children}</h1>,
        a: (props) => CustomLink({ children: props.children, href: props.href }),
        p: (props) => <p className="mb-4">{props.children}</p>,
        ul: (props) => (
          <ul className="mb-4 ml-8 list-disc marker:text-neutral-400">{props.children}</ul>
        ),
        ol: (props) => (
          <ol className="mb-4 ml-8 list-decimal marker:text-neutral-400">{props.children}</ol>
        ),
        li: (props) => <li className="mb-1">{props.children}</li>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

const CustomPre = ({ children }: { children: ReactNode }) => {
  const [isCopied, setIsCopied] = useState(false);

  const code = React.Children.toArray(children).find(isValidCustomCodeBlock);

  const language: string =
    code && code.props.className
      ? extractLanguageName(code.props.className.replace("hljs ", ""))
      : "";

  const handleCopyClick = useCallback(() => {
    if (code && React.isValidElement(code)) {
      const codeString = extractTextFromNode(code.props.children);
      void navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [code]);

  return (
    <div className="mb-4 flex flex-col ">
      <div className="flex w-full items-center justify-between rounded-t-lg bg-zinc-800 p-1 px-4 text-white">
        <div>{language.charAt(0).toUpperCase() + language.slice(1)}</div>
        <button
          onClick={handleCopyClick}
          className="flex items-center gap-2 rounded px-2 py-1 hover:bg-zinc-600 focus:outline-none"
        >
          <FaCopy />
          {isCopied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="rounded-t-[0]">{children}</pre>
    </div>
  );
};

interface CustomCodeBlockProps {
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

const CustomCodeBlock = ({ inline, className, children }: CustomCodeBlockProps) => {
  // Inline code blocks will be placed directly within a paragraph
  if (inline) {
    return <code className="rounded bg-gray-200 px-1 py-[1px] text-black">{children}</code>;
  }

  const language = className ? className.replace("language-", "") : "plaintext";

  return <code className={`hljs ${language}`}>{children}</code>;
};

const CustomLink = ({ children, href }) => {
  return (
    <a
      className={clsx(
        "link rounded-full bg-zinc-800 px-2 py-0.5 align-top text-[0.6rem]",
        "transition-colors duration-300 hover:bg-sky-500 hover:text-white"
      )}
      href={href as string}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const isValidCustomCodeBlock = (
  element: ReactNode
): element is React.ReactElement<CustomCodeBlockProps> =>
  React.isValidElement(element) && element.type === CustomCodeBlock;

const extractLanguageName = (languageString: string): string => {
  // The provided language will be "language-{PROGRAMMING_LANGUAGE}"
  const parts = languageString.split("-");
  if (parts.length > 1) {
    return parts[1] || "";
  }
  return "";
};

const extractTextFromNode = (node: React.ReactNode): string => {
  if (typeof node === "string") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("");
  }

  if (React.isValidElement(node)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    return extractTextFromNode(node.props.children);
  }

  return "";
};

export default MarkdownRenderer;

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  if (!content || !content.trim()) {
    return null;
  }

  return (
    <div
      className={`prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed ${className}`}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-1.5 first:mt-0 pb-1 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-3 mb-1 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-2.5 mb-1 first:mt-0 flex items-center gap-1.5 text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block shrink-0" />
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-bold text-slate-800 mt-2 mb-1 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-slate-700">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-700">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-1.5 pl-1 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1 text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed marker:text-blue-500">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="pl-3 py-1 my-2 border-l-3 border-blue-500 bg-blue-50/50 rounded-r-lg italic text-slate-600 text-xs">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono text-blue-700">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

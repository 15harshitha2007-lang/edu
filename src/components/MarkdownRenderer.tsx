import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to format inline markdown (bold, italic, inline code)
  const formatInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Pattern for inline code `...`, bold **...**, italic *...*
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={`inline-code-${keyIdx++}`}
            className="px-1.5 py-0.5 mx-0.5 rounded text-xs font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={`bold-${keyIdx++}`} className="font-semibold text-slate-900">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={`italic-${keyIdx++}`} className="italic text-slate-800">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Parse lines into blocks
  const parseBlocks = () => {
    const lines = content.split('\n');
    const blocks: React.ReactNode[] = [];
    let i = 0;
    let codeBlockIdx = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code Block
      if (line.trim().startsWith('```')) {
        const lang = line.trim().replace(/^```/, '').trim() || 'code';
        let codeContent = '';
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n';
          i++;
        }
        const currentCodeIdx = codeBlockIdx++;
        blocks.push(
          <div key={`code-block-${currentCodeIdx}`} className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-sm text-slate-100 font-mono text-xs">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/90 text-slate-400 border-b border-slate-700/50">
              <span className="uppercase text-[11px] font-semibold tracking-wider text-indigo-400">{lang}</span>
              <button
                onClick={() => handleCopy(codeContent.trim(), currentCodeIdx)}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy code"
              >
                {copiedIndex === currentCodeIdx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto leading-relaxed text-emerald-300">
              <code>{codeContent.trimEnd()}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // Markdown Table
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const headerCells = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
          const rows = tableLines.slice(2).map(r => r.split('|').slice(1, -1).map(c => c.trim()));
          blocks.push(
            <div key={`table-${i}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold">
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="px-3 py-2 border-b border-slate-200">
                        {formatInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-slate-800">
                          {formatInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        blocks.push(
          <h4 key={`h3-${i}`} className="text-sm font-bold text-slate-800 mt-3 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
            {formatInline(line.replace('### ', ''))}
          </h4>
        );
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push(
          <h3 key={`h2-${i}`} className="text-base font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200/80">
            {formatInline(line.replace('## ', ''))}
          </h3>
        );
        i++;
        continue;
      }
      if (line.startsWith('# ')) {
        blocks.push(
          <h2 key={`h1-${i}`} className="text-lg font-extrabold text-indigo-950 mt-4 mb-2">
            {formatInline(line.replace('# ', ''))}
          </h2>
        );
        i++;
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        blocks.push(
          <blockquote key={`quote-${i}`} className="my-2 pl-3.5 py-1 border-l-3 border-indigo-400 bg-indigo-50/50 text-indigo-900 rounded-r-md text-xs italic">
            {formatInline(line.replace(/^>\s?/, ''))}
          </blockquote>
        );
        i++;
        continue;
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().substring(2);
        blocks.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2 my-1 text-xs text-slate-800 pl-1 leading-relaxed">
            <span className="text-indigo-500 font-bold mt-0.5">•</span>
            <div className="flex-1">{formatInline(bulletText)}</div>
          </div>
        );
        i++;
        continue;
      }

      // Numbered lists
      const numberMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numberMatch) {
        const num = numberMatch[1];
        const numText = numberMatch[2];
        blocks.push(
          <div key={`num-${i}`} className="flex items-start gap-2 my-1 text-xs text-slate-800 pl-1 leading-relaxed">
            <span className="font-semibold text-indigo-600 min-w-4 text-right">{num}.</span>
            <div className="flex-1">{formatInline(numText)}</div>
          </div>
        );
        i++;
        continue;
      }

      // Normal paragraph or empty line
      if (line.trim() === '') {
        blocks.push(<div key={`empty-${i}`} className="h-2" />);
      } else {
        blocks.push(
          <p key={`p-${i}`} className="my-1.5 text-xs text-slate-800 leading-relaxed">
            {formatInline(line)}
          </p>
        );
      }
      i++;
    }

    return blocks;
  };

  return <div className={`markdown-content ${className}`}>{parseBlocks()}</div>;
};

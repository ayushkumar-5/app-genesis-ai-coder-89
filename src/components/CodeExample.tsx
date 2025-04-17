
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeExampleProps {
  code: string;
  language: string;
  fileName?: string;
}

export default function CodeExample({ code, language, fileName }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block bg-card text-card-foreground rounded-lg border shadow-sm mb-4">
      {fileName && (
        <div className="bg-muted text-muted-foreground px-4 py-2 text-sm font-mono border-b">
          {fileName}
        </div>
      )}
      <pre className="language-{language} p-4 text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button 
        className="copy-button" 
        onClick={copyToClipboard}
        aria-label="Copy code"
      >
        {!copied ? (
          <Copy className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

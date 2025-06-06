
import { useState } from 'react';

interface CodeEditorProps {
  selectedFile: string | null;
}

const CodeEditor = ({ selectedFile }: CodeEditorProps) => {
  const [code, setCode] = useState(`import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Hello, World!
        </h1>
        <p className="text-gray-600">
          Welcome to your new React application.
        </p>
      </div>
    </div>
  );
};

export default App;`);

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="h-10 bg-muted border-b border-border flex items-center px-4">
        <span className="text-sm text-muted-foreground">
          {selectedFile || 'App.tsx'}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full resize-none bg-card text-foreground border-none outline-none p-4 font-mono text-sm leading-6 custom-scrollbar"
          spellCheck={false}
          style={{
            tabSize: 2,
            fontFamily: 'JetBrains Mono, Courier New, monospace',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;

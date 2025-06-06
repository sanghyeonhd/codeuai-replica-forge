
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Undo, 
  Redo, 
  Copy, 
  Search,
  FileCode,
  Settings
} from 'lucide-react';

interface CodeEditorProps {
  selectedFile: string | null;
}

const CodeEditor = ({ selectedFile }: CodeEditorProps) => {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [language, setLanguage] = useState('typescript');

  // Mock file content loading
  useEffect(() => {
    if (selectedFile) {
      // This would be replaced with actual file reading
      const mockContent = getMockFileContent(selectedFile);
      setContent(mockContent);
      setIsDirty(false);
      
      // Determine language from file extension
      const extension = selectedFile.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'tsx':
        case 'ts':
          setLanguage('typescript');
          break;
        case 'js':
        case 'jsx':
          setLanguage('javascript');
          break;
        case 'css':
          setLanguage('css');
          break;
        case 'html':
          setLanguage('html');
          break;
        case 'json':
          setLanguage('json');
          break;
        default:
          setLanguage('text');
      }
    }
  }, [selectedFile]);

  const getMockFileContent = (filePath: string): string => {
    if (filePath.includes('Header.tsx')) {
      return `import { Button } from '@/components/ui/button';
import { PanelLeftOpen, Settings } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">CodeUI AI</h1>
      </div>
    </header>
  );
};

export default Header;`;
    }
    
    if (filePath.includes('package.json')) {
      return `{
  "name": "codeui-ai",
  "version": "1.0.0",
  "description": "AI-powered code editor",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`;
    }
    
    return `// Welcome to CodeUI AI
// This is a sample file content for ${filePath}

export default function Component() {
  return (
    <div className="p-4">
      <h1>Hello from ${filePath}</h1>
      <p>Edit this file to see changes reflected in real-time.</p>
    </div>
  );
}`;
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    // This would save the file content
    console.log('Saving file:', selectedFile, content);
    setIsDirty(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <FileCode className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No file selected</h3>
        <p className="text-muted-foreground max-w-md">
          Select a file from the explorer to start editing. You can create new files, edit existing ones, 
          and see your changes reflected in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="border-b border-border p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span className="text-sm font-medium truncate max-w-xs">
              {selectedFile.split('/').pop()}
            </span>
            {isDirty && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {language}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Undo className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Redo className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full resize-none border-0 rounded-none font-mono text-sm leading-relaxed p-4 focus-visible:ring-0"
          placeholder="Start coding..."
          style={{ 
            minHeight: '100%',
            fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace'
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-border px-4 py-1 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
          <span>{language}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{content.split('\n').length} lines</span>
          <span>{content.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

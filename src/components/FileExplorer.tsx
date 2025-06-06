
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  Search,
  ChevronRight,
  ChevronDown,
  FileCode,
  Image,
  Settings,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  expanded?: boolean;
}

interface FileExplorerProps {
  onFileSelect: (fileName: string) => void;
}

const FileExplorer = ({ onFileSelect }: FileExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Mock file structure - this would be replaced with actual file system reading
  useEffect(() => {
    const mockFiles: FileNode[] = [
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        expanded: true,
        children: [
          {
            name: 'components',
            type: 'folder',
            path: 'src/components',
            expanded: true,
            children: [
              { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx' },
              { name: 'MainLayout.tsx', type: 'file', path: 'src/components/MainLayout.tsx' },
              { name: 'FileExplorer.tsx', type: 'file', path: 'src/components/FileExplorer.tsx' }
            ]
          },
          {
            name: 'pages',
            type: 'folder',
            path: 'src/pages',
            expanded: false,
            children: [
              { name: 'Index.tsx', type: 'file', path: 'src/pages/Index.tsx' }
            ]
          },
          { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
          { name: 'main.tsx', type: 'file', path: 'src/main.tsx' }
        ]
      },
      {
        name: 'public',
        type: 'folder',
        path: 'public',
        expanded: false,
        children: [
          { name: 'vite.svg', type: 'file', path: 'public/vite.svg' }
        ]
      },
      { name: 'package.json', type: 'file', path: 'package.json' },
      { name: 'vite.config.ts', type: 'file', path: 'vite.config.ts' },
      { name: 'tailwind.config.ts', type: 'file', path: 'tailwind.config.ts' }
    ];
    setFiles(mockFiles);
  }, []);

  const getFileIcon = (fileName: string, isFolder: boolean, isOpen?: boolean) => {
    if (isFolder) {
      return isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case 'json':
        return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <Image className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const toggleFolder = (path: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === path && node.type === 'folder') {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setFiles(updateNodes(files));
  };

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
    } else {
      setSelectedFile(node.path);
      onFileSelect(node.path);
    }
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const paddingLeft = depth * 16 + 8;
    
    return (
      <div key={node.path}>
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-accent rounded text-sm",
            selectedFile === node.path && "bg-accent"
          )}
          style={{ paddingLeft }}
          onClick={() => handleFileClick(node)}
        >
          {node.type === 'folder' && (
            <div className="w-4 h-4 flex items-center justify-center">
              {node.expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          )}
          {getFileIcon(node.name, node.type === 'folder', node.expanded)}
          <span className="truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && node.expanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4" />
          <span className="text-sm font-medium">Explorer</span>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredFiles.map(file => renderFileNode(file))}
      </div>
    </div>
  );
};

export default FileExplorer;


import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

const mockFileStructure: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [
          { name: 'App.tsx', type: 'file' },
          { name: 'Header.tsx', type: 'file' },
          { name: 'Sidebar.tsx', type: 'file' },
        ]
      },
      {
        name: 'utils',
        type: 'folder',
        children: [
          { name: 'helpers.ts', type: 'file' },
        ]
      },
      { name: 'index.tsx', type: 'file' },
      { name: 'App.css', type: 'file' },
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onFileSelect: (fileName: string) => void;
}

const FileTreeItem = ({ node, level, onFileSelect }: FileTreeItemProps) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.name);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-sidebar-accent rounded text-sm"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === 'folder' ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-3 w-3 text-sidebar-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-sidebar-foreground" />
            )}
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-blue-400" />
            ) : (
              <Folder className="h-4 w-4 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <div className="w-3" />
            <File className="h-4 w-4 text-sidebar-foreground" />
          </>
        )}
        <span className="text-sidebar-foreground ml-1">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={index}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileExplorerProps {
  onFileSelect: (fileName: string) => void;
}

const FileExplorer = ({ onFileSelect }: FileExplorerProps) => {
  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-medium text-sidebar-foreground">Files</h3>
      </div>
      <div className="custom-scrollbar overflow-auto h-[calc(100%-3rem)]">
        {mockFileStructure.map((node, index) => (
          <FileTreeItem
            key={index}
            node={node}
            level={0}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;

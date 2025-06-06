
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from './Header';
import FileExplorer from './FileExplorer';
import ChatInterface from './ChatInterface';
import CodeEditor from './CodeEditor';
import BrowserPreview from './BrowserPreview';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 flex flex-col bg-sidebar border-r border-sidebar-border">
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <TabsList className="bg-sidebar-accent border-b border-sidebar-border rounded-none h-10 w-full justify-start p-0">
                <TabsTrigger 
                  value="files" 
                  className="data-[state=active]:bg-sidebar data-[state=active]:text-sidebar-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 text-sm font-medium"
                >
                  Files
                </TabsTrigger>
                <TabsTrigger 
                  value="chat"
                  className="data-[state=active]:bg-sidebar data-[state=active]:text-sidebar-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 text-sm font-medium"
                >
                  Chat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="files" className="flex-1 mt-0 overflow-hidden">
                <FileExplorer onFileSelect={handleFileSelect} />
              </TabsContent>
              
              <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
                <ChatInterface />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 border-r border-border">
            <CodeEditor selectedFile={selectedFile} />
          </div>

          {/* Browser Preview */}
          <div className="flex-1">
            <BrowserPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

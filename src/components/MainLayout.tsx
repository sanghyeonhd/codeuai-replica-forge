
import { useState } from 'react';
import Header from './Header';
import FileExplorer from './FileExplorer';
import ChatInterface from './ChatInterface';
import CodeEditor from './CodeEditor';
import BrowserPreview from './BrowserPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="h-screen flex flex-col bg-background">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 flex flex-col bg-sidebar">
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <TabsList className="bg-sidebar-accent border-b border-sidebar-border rounded-none h-10 w-full justify-start p-0">
                <TabsTrigger 
                  value="files" 
                  className="data-[state=active]:bg-sidebar data-[state=active]:text-sidebar-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Files
                </TabsTrigger>
                <TabsTrigger 
                  value="chat"
                  className="data-[state=active]:bg-sidebar data-[state=active]:text-sidebar-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Chat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="files" className="flex-1 mt-0">
                <FileExplorer onFileSelect={handleFileSelect} />
              </TabsContent>
              
              <TabsContent value="chat" className="flex-1 mt-0">
                <ChatInterface />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1">
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

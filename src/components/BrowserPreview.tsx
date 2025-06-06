
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  ExternalLink, 
  Smartphone, 
  Tablet, 
  Monitor,
  RotateCcw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const BrowserPreview = () => {
  const [url, setUrl] = useState('http://localhost:8080');
  const [isLoading, setIsLoading] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [showGrid, setShowGrid] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  const getViewportDimensions = () => {
    switch (viewportMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const { width, height } = getViewportDimensions();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Preview Header */}
      <div className="border-b border-border p-2 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant={viewportMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewportMode('desktop')}
          >
            <Monitor className="h-3 w-3" />
          </Button>
          <Button
            variant={viewportMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewportMode('tablet')}
          >
            <Tablet className="h-3 w-3" />
          </Button>
          <Button
            variant={viewportMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewportMode('mobile')}
          >
            <Smartphone className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 max-w-md">
          <Input
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="h-8 text-xs"
            placeholder="Enter URL to preview..."
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={openInNewTab}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="h-full flex items-center justify-center">
          <div
            className={cn(
              "bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden",
              viewportMode !== 'desktop' && "mx-auto"
            )}
            style={{
              width,
              height: viewportMode !== 'desktop' ? height : '100%',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* Browser Chrome */}
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 flex items-center gap-2 border-b">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-white dark:bg-gray-600 rounded px-2 py-1 text-xs text-muted-foreground">
                {url}
              </div>
            </div>

            {/* Preview Frame */}
            <div className="relative h-full">
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}
              
              <iframe
                key={refreshKey}
                src={url}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => setIsLoading(false)}
              />
              
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading preview...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="border-t border-border px-4 py-1 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Viewport: {viewportMode}</span>
          <span>Zoom: 100%</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{width} × {height}</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};

export default BrowserPreview;

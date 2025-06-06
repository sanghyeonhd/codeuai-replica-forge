
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BrowserPreview = () => {
  return (
    <div className="h-full bg-card flex flex-col">
      <div className="h-10 bg-muted border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Preview</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          src="about:blank"
          className="w-full h-full border-none"
          title="Preview"
          style={{
            background: 'white',
          }}
          srcDoc={`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
              <div class="min-h-screen bg-gray-100 flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                  <h1 class="text-2xl font-bold text-gray-800 mb-4">
                    Hello, World! 🎉
                  </h1>
                  <p class="text-gray-600 mb-4">
                    Welcome to your new React application.
                  </p>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </body>
            </html>
          `}
        />
      </div>
    </div>
  );
};

export default BrowserPreview;

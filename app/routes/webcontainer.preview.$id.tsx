
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const PREVIEW_CHANNEL = 'preview-updates';

export async function loader({ params }: LoaderFunctionArgs) {
  const previewId = params.id;

  if (!previewId) {
    throw new Response('Preview ID is required', { status: 400 });
  }

  return json({ previewId });
}

export default function WebContainerPreview() {
  const { previewId } = useLoaderData<typeof loader>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const broadcastChannelRef = useRef<BroadcastChannel>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [lastRefresh, setLastRefresh] = useState(0);

  // Handle preview refresh with debouncing
  const handleRefresh = useCallback(() => {
    const now = Date.now();
    
    // Debounce refreshes to avoid too frequent updates
    if (now - lastRefresh < 500) {
      return;
    }

    setLastRefresh(now);

    if (iframeRef.current && previewUrl) {
      console.log('[WebContainer Preview] Refreshing preview:', previewId);
      
      // Force a clean reload
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      
      requestAnimationFrame(() => {
        if (iframeRef.current) {
          // Add a timestamp to force refresh
          const url = new URL(currentSrc);
          url.searchParams.set('_refresh', now.toString());
          iframeRef.current.src = url.toString();
        }
      });
    }
  }, [previewUrl, previewId, lastRefresh]);

  // Notify other tabs that this preview is ready
  const notifyPreviewReady = useCallback(() => {
    if (broadcastChannelRef.current && previewUrl) {
      broadcastChannelRef.current.postMessage({
        type: 'preview-ready',
        previewId,
        url: previewUrl,
        timestamp: Date.now(),
      });
    }
  }, [previewId, previewUrl]);

  useEffect(() => {
    // Initialize broadcast channel
    broadcastChannelRef.current = new BroadcastChannel(PREVIEW_CHANNEL);

    // Listen for preview updates
    broadcastChannelRef.current.onmessage = (event) => {
      if (event.data.previewId === previewId) {
        console.log('[WebContainer Preview] Received message:', event.data.type);
        
        if (event.data.type === 'refresh-preview' || event.data.type === 'file-change') {
          handleRefresh();
        }
      }
    };

    // Construct the WebContainer preview URL
    const url = `https://${previewId}.local-credentialless.webcontainer-api.io`;
    setPreviewUrl(url);

    // Set the iframe src
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }

    // Cleanup
    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [previewId, handleRefresh]);

  // Notify when iframe loads
  const handleIframeLoad = useCallback(() => {
    console.log('[WebContainer Preview] Iframe loaded');
    notifyPreviewReady();
  }, [notifyPreviewReady]);

  return (
    <div className="w-full h-full">
      <iframe
        ref={iframeRef}
        title="WebContainer Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation allow-same-origin"
        allow="cross-origin-isolated"
        loading="eager"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}

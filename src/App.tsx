import { useState, useEffect } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { Settings } from './components/Settings';
import { FileSelector } from './components/FileSelector';
import { UploadQueue, QueueItem } from './components/UploadQueue';
import { UploadHistory } from './components/UploadHistory';
import { FacebookApiService } from './services/facebookApi';
import { UploadService } from './services/uploadService';
import type { Database } from './lib/database.types';

type Upload = Database['public']['Tables']['uploads']['Row'];

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [facebookApi, setFacebookApi] = useState<FacebookApiService | null>(null);
  const [uploadService, setUploadService] = useState<UploadService | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('fb_access_token');
    const savedPageId = localStorage.getItem('fb_page_id');
    if (savedToken && savedPageId) {
      handleSettingsSave(savedToken, savedPageId);
    }
  }, []);

  const handleSettingsSave = (accessToken: string, pageId: string) => {
    const fbApi = new FacebookApiService(accessToken, pageId);
    const uploadSvc = new UploadService(fbApi);
    setFacebookApi(fbApi);
    setUploadService(uploadSvc);
    setIsConfigured(true);
    loadHistory(uploadSvc);
  };

  const loadHistory = async (service: UploadService) => {
    const allUploads = await service.getAllUploads();
    const uploadStats = await service.getUploadStats();
    setUploads(allUploads);
    setStats(uploadStats);
  };

  const handleFilesSelected = (files: File[]) => {
    const newQueue: QueueItem[] = files.map((file) => ({
      file,
      status: 'pending',
    }));
    setQueue(newQueue);
  };

  const handleStartUpload = async () => {
    if (!uploadService || isUploading) return;

    setIsUploading(true);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status !== 'pending') continue;

      setQueue((prev) =>
        prev.map((q, idx) =>
          idx === i ? { ...q, status: 'uploading' as const } : q
        )
      );

      const result = await uploadService.uploadFile(
        item.file,
        item.file.name,
        (message) => {
          setQueue((prev) =>
            prev.map((q, idx) =>
              idx === i ? { ...q, message } : q
            )
          );
        }
      );

      if (result.success) {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: 'success' as const, message: undefined } : q
          )
        );
      } else if (result.error?.includes('already uploaded')) {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: 'skipped' as const, message: result.error } : q
          )
        );
      } else {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: 'failed' as const, message: result.error } : q
          )
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsUploading(false);
    loadHistory(uploadService);
  };

  const handleRefreshHistory = () => {
    if (uploadService) {
      loadHistory(uploadService);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <UploadIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Facebook Media Uploader
              </h1>
              <p className="text-gray-600">
                Upload images and videos to Facebook with automatic tracking
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <Settings
            onSettingsSave={handleSettingsSave}
            isConfigured={isConfigured}
          />

          {isConfigured && (
            <>
              <FileSelector
                onFilesSelected={handleFilesSelected}
                disabled={isUploading}
              />

              <UploadQueue
                queue={queue}
                onStartUpload={handleStartUpload}
                isUploading={isUploading}
                canUpload={isConfigured}
              />

              <UploadHistory
                uploads={uploads}
                stats={stats}
                onRefresh={handleRefreshHistory}
              />
            </>
          )}

          {!isConfigured && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">
                Configure your Facebook API settings above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

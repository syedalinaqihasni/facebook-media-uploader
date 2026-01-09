import { CheckCircle, XCircle, Loader2, Image, Video, Upload } from 'lucide-react';

export interface QueueItem {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'failed' | 'skipped';
  message?: string;
}

interface UploadQueueProps {
  queue: QueueItem[];
  onStartUpload: () => void;
  isUploading: boolean;
  canUpload: boolean;
}

export function UploadQueue({
  queue,
  onStartUpload,
  isUploading,
  canUpload,
}: UploadQueueProps) {
  if (queue.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const stats = {
    total: queue.length,
    pending: queue.filter((q) => q.status === 'pending').length,
    success: queue.filter((q) => q.status === 'success').length,
    failed: queue.filter((q) => q.status === 'failed').length,
    skipped: queue.filter((q) => q.status === 'skipped').length,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Queue</h3>
            <p className="text-sm text-gray-600 mt-1">
              {stats.total} files • {stats.success} uploaded • {stats.failed} failed •{' '}
              {stats.skipped} skipped
            </p>
          </div>
          {!isUploading && stats.pending > 0 && (
            <button
              onClick={onStartUpload}
              disabled={!canUpload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Start Upload
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {queue.map((item, index) => {
          const isImage = item.file.type.startsWith('image/');

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                {isImage ? (
                  <div className="p-2 bg-green-100 rounded">
                    <Image className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-purple-100 rounded">
                    <Video className="w-5 h-5 text-purple-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(item.file.size)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {item.status === 'pending' && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Pending
                  </span>
                )}
                {item.status === 'uploading' && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-blue-600">
                      {item.message || 'Uploading...'}
                    </span>
                  </div>
                )}
                {item.status === 'success' && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">Success</span>
                  </div>
                )}
                {item.status === 'failed' && (
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600 max-w-xs truncate">
                      {item.message || 'Failed'}
                    </span>
                  </div>
                )}
                {item.status === 'skipped' && (
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Already uploaded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

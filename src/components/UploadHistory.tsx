import { useEffect, useState } from 'react';
import { History, CheckCircle, XCircle, Clock, Image, Video, RefreshCw } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Upload = Database['public']['Tables']['uploads']['Row'];

interface UploadHistoryProps {
  uploads: Upload[];
  stats: {
    total: number;
    success: number;
    failed: number;
    pending: number;
  };
  onRefresh: () => void;
}

export function UploadHistory({ uploads, stats, onRefresh }: UploadHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload History</h3>
            <p className="text-sm text-gray-600">
              {stats.total} total • {stats.success} success • {stats.failed} failed
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="max-h-96 overflow-y-auto">
            {uploads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No uploads yet</p>
              </div>
            ) : (
              uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-start gap-3 p-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    {upload.file_type === 'image' ? (
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
                      {upload.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(upload.file_size)} • {formatDate(upload.created_at)}
                    </p>
                    {upload.description && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {upload.description}
                      </p>
                    )}
                    {upload.error_message && (
                      <p className="text-xs text-red-600 mt-1 truncate">
                        Error: {upload.error_message}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {upload.upload_status === 'success' && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">Success</span>
                      </div>
                    )}
                    {upload.upload_status === 'failed' && (
                      <div className="flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs text-red-600">Failed</span>
                      </div>
                    )}
                    {upload.upload_status === 'pending' && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

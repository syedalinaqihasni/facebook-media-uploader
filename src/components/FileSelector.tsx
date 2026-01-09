import { useRef } from 'react';
import { FolderOpen, Image, Video } from 'lucide-react';

interface FileSelectorProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

export function FileSelector({ onFilesSelected, disabled }: FileSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const mediaFiles = fileArray.filter(
        (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      onFilesSelected(mediaFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="flex justify-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Image className="w-8 h-8 text-green-600" />
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Video className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Media Files
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose images and videos to upload to Facebook
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={handleClick}
          disabled={disabled}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          Browse Files
        </button>

        <p className="mt-3 text-xs text-gray-500">
          Supports: JPG, PNG, GIF, MP4, MOV, and other image/video formats
        </p>
      </div>
    </div>
  );
}

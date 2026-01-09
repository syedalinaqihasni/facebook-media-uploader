import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle, XCircle } from 'lucide-react';

interface SettingsProps {
  onSettingsSave: (accessToken: string, pageId: string) => void;
  isConfigured: boolean;
}

export function Settings({ onSettingsSave, isConfigured }: SettingsProps) {
  const [accessToken, setAccessToken] = useState('');
  const [pageId, setPageId] = useState('');
  const [isExpanded, setIsExpanded] = useState(!isConfigured);
  const [isSaved, setIsSaved] = useState(isConfigured);

  useEffect(() => {
    const savedToken = localStorage.getItem('fb_access_token');
    const savedPageId = localStorage.getItem('fb_page_id');
    if (savedToken) setAccessToken(savedToken);
    if (savedPageId) setPageId(savedPageId);
  }, []);

  const handleSave = () => {
    if (accessToken && pageId) {
      localStorage.setItem('fb_access_token', accessToken);
      localStorage.setItem('fb_page_id', pageId);
      onSettingsSave(accessToken, pageId);
      setIsSaved(true);
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Facebook API Settings</h2>
          {isSaved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Configured
            </span>
          )}
          {!isSaved && (
            <span className="flex items-center gap-1 text-sm text-orange-600">
              <XCircle className="w-4 h-4" />
              Not Configured
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Access Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter your Facebook access token"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Get your access token from Facebook Graph API Explorer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Page ID
              </label>
              <input
                type="text"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                placeholder="Enter your Facebook page ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Find your page ID in your Facebook page settings
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={!accessToken || !pageId}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

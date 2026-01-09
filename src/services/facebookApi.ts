const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0';

export interface FacebookUploadResult {
  success: boolean;
  postId?: string;
  error?: string;
}

export class FacebookApiService {
  private accessToken: string;
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  async uploadPhoto(file: File, description: string): Promise<FacebookUploadResult> {
    try {
      const formData = new FormData();
      formData.append('source', file);
      formData.append('message', description);
      formData.append('access_token', this.accessToken);

      const response = await fetch(
        `${FACEBOOK_GRAPH_API}/${this.pageId}/photos`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Failed to upload photo',
        };
      }

      return {
        success: true,
        postId: data.id || data.post_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async uploadVideo(file: File, description: string): Promise<FacebookUploadResult> {
    try {
      const formData = new FormData();
      formData.append('source', file);
      formData.append('description', description);
      formData.append('access_token', this.accessToken);

      const response = await fetch(
        `${FACEBOOK_GRAPH_API}/${this.pageId}/videos`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Failed to upload video',
        };
      }

      return {
        success: true,
        postId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${FACEBOOK_GRAPH_API}/${this.pageId}?fields=name&access_token=${this.accessToken}`
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}

import { supabase } from '../lib/supabase';
import { FacebookApiService } from './facebookApi';
import type { Database } from '../lib/database.types';

type Upload = Database['public']['Tables']['uploads']['Row'];
type UploadInsert = Database['public']['Tables']['uploads']['Insert'];

export class UploadService {
  private facebookApi: FacebookApiService;

  constructor(facebookApi: FacebookApiService) {
    this.facebookApi = facebookApi;
  }

  async checkIfAlreadyUploaded(filePath: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('uploads')
      .select('id, upload_status')
      .eq('file_path', filePath)
      .eq('upload_status', 'success')
      .maybeSingle();

    if (error) {
      console.error('Error checking upload status:', error);
      return false;
    }

    return data !== null;
  }

  async createUploadRecord(file: File, filePath: string): Promise<string | null> {
    const uploadData: UploadInsert = {
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type.startsWith('image/') ? 'image' : 'video',
      mime_type: file.type,
      upload_status: 'pending',
      description: `${file.name}`,
    };

    const { data, error } = await supabase
      .from('uploads')
      .insert(uploadData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating upload record:', error);
      return null;
    }

    return data.id;
  }

  async updateUploadStatus(
    id: string,
    status: 'success' | 'failed',
    postId?: string,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('uploads')
      .update({
        upload_status: status,
        facebook_post_id: postId,
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating upload status:', error);
    }
  }

  async uploadFile(
    file: File,
    filePath: string,
    onProgress?: (status: string) => void
  ): Promise<{ success: boolean; error?: string }> {
    const alreadyUploaded = await this.checkIfAlreadyUploaded(filePath);
    if (alreadyUploaded) {
      return { success: false, error: 'File already uploaded successfully' };
    }

    onProgress?.('Creating record...');
    const recordId = await this.createUploadRecord(file, filePath);
    if (!recordId) {
      return { success: false, error: 'Failed to create upload record' };
    }

    onProgress?.('Uploading to Facebook...');
    const description = `${file.name}`;
    const isImage = file.type.startsWith('image/');

    const result = isImage
      ? await this.facebookApi.uploadPhoto(file, description)
      : await this.facebookApi.uploadVideo(file, description);

    if (result.success) {
      await this.updateUploadStatus(recordId, 'success', result.postId);
      onProgress?.('Upload successful!');
      return { success: true };
    } else {
      await this.updateUploadStatus(recordId, 'failed', undefined, result.error);
      onProgress?.(`Failed: ${result.error}`);
      return { success: false, error: result.error };
    }
  }

  async getAllUploads(): Promise<Upload[]> {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching uploads:', error);
      return [];
    }

    return data || [];
  }

  async getUploadStats(): Promise<{
    total: number;
    success: number;
    failed: number;
    pending: number;
  }> {
    const uploads = await this.getAllUploads();

    return {
      total: uploads.length,
      success: uploads.filter((u) => u.upload_status === 'success').length,
      failed: uploads.filter((u) => u.upload_status === 'failed').length,
      pending: uploads.filter((u) => u.upload_status === 'pending').length,
    };
  }
}

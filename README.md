# Facebook Media Uploader

A professional tool for bulk uploading images and videos to Facebook with automatic tracking and duplicate prevention.

## Features

- **Bulk Upload**: Select multiple images and videos to upload at once
- **Smart Tracking**: Automatically logs all uploads to a database
- **Duplicate Prevention**: Checks if files were already uploaded successfully
- **Status Monitoring**: Real-time upload progress and status updates
- **Upload History**: View complete history of all uploads with detailed information
- **Automatic Descriptions**: Uses filename as description and alt tag for images

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Get Facebook API Credentials

You need two things from Facebook:

#### Access Token
1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app (or create a new one)
3. Generate an access token with these permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `publish_pages` (for photos)
   - `publish_video` (for videos)
4. For long-term tokens, exchange your short-lived token for a long-lived one

#### Page ID
1. Go to your Facebook Page
2. Click "About" in the left menu
3. Scroll down to find your Page ID
4. Or use the Graph API Explorer: `GET /me/accounts` to list all pages you manage

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

## How to Use

1. **Configure Settings**
   - Click on "Facebook API Settings" at the top
   - Enter your Facebook Access Token and Page ID
   - Click "Save Settings"

2. **Select Files**
   - Click "Browse Files" button
   - Select one or multiple images/videos from your computer
   - Supported formats: JPG, PNG, GIF, MP4, MOV, etc.

3. **Start Upload**
   - Review the files in the upload queue
   - Click "Start Upload" to begin
   - Monitor progress in real-time

4. **View History**
   - Expand "Upload History" section to see all past uploads
   - Check upload status (success/failed/pending)
   - View error messages for failed uploads

## Database Schema

The application uses a Supabase database with the following table:

### `uploads` Table
- `id`: Unique identifier
- `file_name`: Name of the file
- `file_path`: Path/identifier for duplicate checking
- `file_size`: File size in bytes
- `file_type`: image or video
- `mime_type`: Full MIME type
- `upload_status`: pending, success, or failed
- `facebook_post_id`: Facebook's post ID (if successful)
- `description`: Description used for upload
- `error_message`: Error details (if failed)
- `created_at`: Upload timestamp
- `updated_at`: Last update timestamp

## Key Features Explained

### Duplicate Prevention
The app checks the database before uploading. If a file with the same path was already uploaded successfully, it will be skipped.

### Automatic Descriptions
Each upload automatically includes the filename as the description for the Facebook post. For images, this also serves as the alt text for accessibility.

### Upload Status Tracking
- **Pending**: File is queued but not yet uploaded
- **Uploading**: Currently being uploaded to Facebook
- **Success**: Successfully uploaded to Facebook
- **Failed**: Upload failed (error message included)
- **Skipped**: Already uploaded previously

## Troubleshooting

### "Failed to upload" errors
- Check if your access token is valid and not expired
- Verify the token has the required permissions
- Ensure your Page ID is correct

### Files are skipped
- The file was already uploaded successfully before
- Check the upload history to confirm

### Connection errors
- Verify your internet connection
- Check if Facebook's API is accessible
- Confirm your Supabase credentials are correct

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **API**: Facebook Graph API v18.0
- **Icons**: Lucide React

## Security Notes

- Access tokens are stored in browser localStorage
- Never share your access token publicly
- Use long-lived tokens for production use
- Implement proper Row Level Security (RLS) policies in Supabase

import { google } from 'googleapis';

export const uploadFileToDrive = async (accessToken, file, folderId = null) => {
  try {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });
    
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
    const fileMetadata = {
      name: file.name,
      ...(folderId && { parents: [folderId] })
    };
    
    const media = {
      mimeType: file.type,
      body: file
    };
    
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    return response.data.id;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}; 
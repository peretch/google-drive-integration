/* 
Google Drive API:
Demonstration to:
1. upload 
2. delete 
3. create public URL of a file.
required npm package: googleapis
*/
require('dotenv').config()

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.pdf file is in root directory, 
though this can be any filePath
*/

const uploadFile = async (fileName, uploadName, mimeType) => {
  const filePath = path.join(__dirname, fileName);
  try {
    const response = await drive.files.create({
      requestBody: {
        name: uploadName, //This can be name of your choice
        mimeType, // https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
      },
      media: {
        mimeType,
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
}

const deleteFile = async (fileId) => {
  try {
    const response = await drive.files.delete({
      fileId,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

const generatePublicUrl = async (fileId) => {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  generatePublicUrl,
}

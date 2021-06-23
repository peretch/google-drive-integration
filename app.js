const {
  uploadFile,
  deleteFile,
  generatePublicUrl
} = require('./googleDriveService');

uploadFile('example.pdf', 'example_with_custom_name.pdf', 'application/pdf');
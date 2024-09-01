// const token = localStorage.getItem('token');

// // Function to load and display uploaded images
// async function loadUploadedImages() {
//   const response = await fetch('/api/files/list', {
//     headers: { 'Authorization': token }
//   });

//   if (response.ok) {
//     const files = await response.json();
//     const fileList = document.getElementById('file-list');
    
//     // Display each image using its direct file path
//     fileList.innerHTML = files.map(file => `
//       <div class="file-item">
//         <img src="/files/${file.name}" alt="${file.name}" style="max-width: 200px; margin: 10px;">
//         <div>${file.name}</div>
//       </div>
//     `).join('');
//   } else {
//     alert('Failed to fetch files');
//   }
// }

// // Event listener for the "Upload Images" button
// document.getElementById('upload-images')?.addEventListener('click', () => {
//   window.location.href = 'upload.html'; // Redirect to the upload page
// });

// // Event listener for the "View Uploaded Images" button
// document.getElementById('view-uploads')?.addEventListener('click', loadUploadedImages);

// // Event listener for the "Logout" button
// document.getElementById('logout')?.addEventListener('click', () => {
//   localStorage.removeItem('token');
//   window.location.href = 'login.html'; // Redirect to the login page
// });

// // Event listener for "Remove All Images" button
// document.getElementById('remove-all-images')?.addEventListener('click', async () => {
//   const confirmDelete = confirm('Are you sure you want to remove all images?');
//   if (!confirmDelete) return;

//   const response = await fetch('/api/files/remove-all', {
//     method: 'DELETE',
//     headers: { 'Authorization': token }
//   });

//   if (response.ok) {
//     alert('All images removed successfully.');
//     loadUploadedImages(); // Refresh the list to show no images
//   } else {
//     alert('Failed to remove all images.');
//   }
// });

// // Event listener for the form submission in upload.html
// document.getElementById('upload-form')?.addEventListener('submit', async (event) => {
//   event.preventDefault();
//   const fileInput = document.getElementById('file-input').files[0];

//   if (!fileInput) {
//     alert('Please select a file to upload.');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('file', fileInput);

//   const response = await fetch('/api/files/upload', {
//     method: 'POST',
//     headers: { 'Authorization': token },
//     body: formData
//   });

//   if (response.ok) {
//     const data = await response.json();
//     alert(data.message);  // Displays "File uploaded successfully"
//     window.location.href = 'dashboard.html';
//   } else {
//     alert('Failed to upload file');
//   }
// });

// // Automatically load images on dashboard load
// document.addEventListener('DOMContentLoaded', loadUploadedImages);

const token = localStorage.getItem('token');

// Function to load and display uploaded images
async function loadUploadedImages() {
  console.log('Loading uploaded images...');
  const response = await fetch('/api/files/list', {
    headers: { 'Authorization': token }
  });

  if (response.ok) {
    const files = await response.json();
    console.log('Files fetched from server:', files);
    const fileList = document.getElementById('file-list');
    
    // Display each image using its direct file path
    fileList.innerHTML = files.map(file => `
      <div class="file-item">
        <img src="/files/${file.name}" alt="${file.name}" style="max-width: 200px; margin: 10px;">
        <div>${file.name}</div>
      </div>
    `).join('');
  } else {
    console.error('Failed to fetch files:', response.statusText);
    alert('Failed to fetch files');
  }
}

// Event listener for the "Upload Images" button
document.getElementById('upload-images')?.addEventListener('click', () => {
  console.log('Navigating to upload page.');
  window.location.href = 'upload.html'; // Redirect to the upload page
});

// Event listener for the "View Uploaded Images" button
document.getElementById('view-uploads')?.addEventListener('click', loadUploadedImages);

// Event listener for the "Logout" button
document.getElementById('logout')?.addEventListener('click', () => {
  console.log('Logging out...');
  localStorage.removeItem('token');
  window.location.href = 'login.html'; // Redirect to the login page
});

// Event listener for "Remove All Images" button
document.getElementById('remove-all-images')?.addEventListener('click', async () => {
  const confirmDelete = confirm('Are you sure you want to remove all images?');
  if (!confirmDelete) return;

  console.log('Removing all images...');
  const response = await fetch('/api/files/remove-all', {
    method: 'DELETE',
    headers: { 'Authorization': token }
  });

  if (response.ok) {
    console.log('All images removed successfully.');
    alert('All images removed successfully.');
    loadUploadedImages(); // Refresh the list to show no images
  } else {
    console.error('Failed to remove all images:', response.statusText);
    alert('Failed to remove all images.');
  }
});

// Event listener for the form submission in upload.html
document.getElementById('upload-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('file-input').files[0];

  if (!fileInput) {
    alert('Please select a file to upload.');
    return;
  }

  console.log('Uploading file:', fileInput.name);
  const formData = new FormData();
  formData.append('file', fileInput);

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    headers: { 'Authorization': token },
    body: formData
  });

  if (response.ok) {
    const data = await response.json();
    console.log('File uploaded successfully:', data);
    alert(data.message);  // Displays "File uploaded successfully"
    window.location.href = 'dashboard.html';
  } else {
    console.error('Failed to upload file:', response.statusText);
    alert('Failed to upload file');
  }
});

// Automatically load images on dashboard load
document.addEventListener('DOMContentLoaded', loadUploadedImages);

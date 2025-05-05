
let base64img = null;
let file = null;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'nathan3453';
const REPO = 'testimageupload';
const BRANCH = 'main';
let FILE_PATH_IN_REPO = null;

function extractBase64(dataUrl) {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) return dataUrl;
  return dataUrl.substring(commaIndex + 1);
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileupload');

    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      if (files.length > 0) {
        file = files[0];
        console.log("File name:", file.name);
        console.log("File type:", file.type);
        if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        const imagebox = document.getElementById("imagebox");

        reader.onload = function(e) {
          imagebox.src = e.target.result;
          imagebox.style.display = 'block';
          FILE_PATH_IN_REPO = `images/${file.name}`;
          base64img = extractBase64(e.target.result);
        };
  
        reader.readAsDataURL(file);
      } else {
        imagebox.style.display = 'none';
        alert("Please select a valid image file.");
      }
      }
      
    });

});
  

async function upload() {
  if (base64img) {
    console.log(base64img);
    const getUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FILE_PATH_IN_REPO}?ref=${BRANCH}`;
    let sha = null;
    try {
      const res = await fetch(getUrl, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
    });
    if (res.ok) {
      const json = await res.json();
      sha = json.sha;
    }
  } catch (e) {
    console.error('Error checking existing file:', e);
  }
  } 
  else {
    alert("No image selected or image not loaded yet.");
  }

  const uploadUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FILE_PATH_IN_REPO}`;
  const body = {
    message: 'Upload image via API',
    content: base64img,
    branch: BRANCH,
  };

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  if (response.ok) {
    console.log('✅ Uploaded successfully:', result.content.html_url);
  } else {
    console.error('❌ Failed to upload:', result);
  }
};

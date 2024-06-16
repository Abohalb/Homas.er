document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
document.getElementById('saveButton').addEventListener('click', saveFile, false);
document.getElementById('uploadButton').addEventListener('click', uploadFile, false);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            document.getElementById('m3uContent').value = content;
        };
        reader.readAsText(file);
    }
}

function saveFile() {
    const content = document.getElementById('m3uContent').value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited_playlist.m3u';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function uploadFile() {
    const content = document.getElementById('m3uContent').value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

    const formData = new FormData();
    formData.append('file', blob, 'playlist.m3u');

    const expiryDuration = document.getElementById('expiryDuration').value || 60; // مدة الصلاحية بالدقائق، افتراضي 60 دقيقة

    fetch('https://file.io', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(expiryDuration));
            displayLinkWithExpiry(data.link, expiryDate);
        } else {
            alert('فشل في الرفع.');
        }
    })
    .catch(error => console.error('خطأ:', error));
}

function displayLinkWithExpiry(link, expiryDate) {
    const linkContainer = document.getElementById('linkContainer');
    linkContainer.innerHTML = `
        <p>تم رفع الملف! الرابط: <a href="${link}" target="_blank">${link}</a></p>
        <p>الرابط صالح حتى: ${expiryDate.toLocaleString()}</p>
    `;
}

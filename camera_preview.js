document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('camera-preview');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoElement.srcObject = stream;
            videoElement.addEventListener('click', takePicture);

            // Listen for messages to trigger picture capture
            window.addEventListener('message', event => {
                if (event.data === 'takePicture') {
                    takePicture();
                }
            });
        })
        .catch(handleCameraError);
});

function takePicture() {
    const canvas = document.createElement('canvas');
    const videoElement = document.getElementById('camera-preview');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    localStorage.setItem('capturedPicture', dataUrl);

    alert('Picture taken and saved!');
}

function handleCameraError(error) {
    console.error('Unable to access camera:', error);
    alert('Unable to access camera.');
}

document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.getElementById('logo-container');
    const chatContainer = document.getElementById('chat-messages');

    let isListening = false;
    let recognition;

    // Elements for camera
    const cameraPopup = document.getElementById('camera-popup');
    const cameraPreview = document.getElementById('camera-preview');
    const takePictureBtn = document.getElementById('take-picture-btn');

    // Event listener for the logo container
    logoContainer.addEventListener('click', toggleListening);

    // Greet user on page load based on browser language
    const browserLanguage = navigator.language.toLowerCase();
    generateBotResponse(getGreetingResponseByLanguage(browserLanguage));

    // Toggle voice recognition
    function toggleListening() {
        isListening ? stopListening() : startListening();
    }

    // Start voice recognition
    function startListening() {
        isListening = true;
        pauseLogoAnimation();
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        configureRecognition();
        recognition.start();
    }

    // Configure SpeechRecognition settings
    function configureRecognition() {
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = () => console.log('Listening...');
        recognition.onend = handleRecognitionEnd;
        recognition.onresult = handleRecognitionResult;
    }

    // Handle recognition end
    function handleRecognitionEnd() {
        console.log('Stopped listening.');
        resumeLogoAnimation();

        if (isListening) {
            recognition.start();
        }
    }

    // Handle recognition results
    function handleRecognitionResult(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        if (event.results[0].isFinal) {
            processUserCommand(transcript.toLowerCase());
        }
    }

    // Process user commands
    function processUserCommand(userInput) {
        const greetings = [
            'hello',
            'hi',
            'hey',
            'hola',
            'bonjour',
            'hallo',
            '你好',
            'nǐ hǎo',
            'مرحبا',
            'marhaban',
            'привет',
            'privet',
            'नमस्ते',
            'namaste',
            'hujambo',
            'γεια σας',
            'gia sas',
            'こんにちは',
            'konnichiwa',
            '안녕하세요',
            'annyeonghaseyo',
            'ciao',
            'olá'
        ];

        for (const greeting of greetings) {
            if (userInput.includes(greeting)) {
                generateBotResponse(getGreetingResponseByLanguage(greeting));
                return;
            }
        }

        const commands = {
            'take a picture': takePictureInNewTab,
            'stop listening': stopListening,
            'open youtube': () => openWebsite('https://www.youtube.com/'),
            'open facebook': () => openWebsite('https://www.facebook.com/'),
            'open instagram': () => openWebsite('https://www.instagram.com/'),
            'open snapchat': () => openWebsite('https://www.snapchat.com/'),
            'open spotify': () => openWebsite('https://www.spotify.com/'),
            'open camera': openCameraPopup,
            'take a picture': takePicture,
        };

        for (const command in commands) {
            if (userInput.includes(command)) {
                commands[command] instanceof Function ? commands[command]() : openWebsite(commands[command]);
                return;
            }
        }

        generateBotResponse('I\'m not sure how to respond to that. Can you please try a different command?');
    }

    // Stop listening function
    function stopListening() {
        isListening = false;
        recognition.stop();
    }

    // Open website in a new tab
    function openWebsite(url) {
        window.open(url, '_blank');
        generateBotResponse(`Opening ${url}...`);
    }

    // Open camera popup with access prompt
    function openCameraPopup() {
        // Ask for camera access
        askForCameraAccess()
            .then(() => {
                // Display the camera popup
                cameraPopup.style.display = 'block';

                // Attempt to access the camera
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true })
                        .then(handleCameraStream)
                        .catch(handleCameraError);
                } else {
                    console.error('Camera access is not supported in this browser.');
                    closeCameraPopup();
                }
            })
            .catch(error => {
                console.error(error);
                closeCameraPopup();
            });
    }

    // Ask for camera access
    function askForCameraAccess() {
        return new Promise((resolve, reject) => {
            const userPrompt = confirm('This website wants to access your camera. Allow?');
            if (userPrompt) {
                resolve();
            } else {
                reject('User denied camera access.');
            }
        });
    }

    // Handle camera stream
    function handleCameraStream(stream) {
        // Set the camera preview source
        if ("srcObject" in cameraPreview) {
            cameraPreview.srcObject = stream;
        } else {
            // Fallback for older browsers
            cameraPreview.src = window.URL.createObjectURL(stream);
        }
    }

    // Handle camera error
    function handleCameraError(error) {
        console.error('Unable to access camera:', error);
        closeCameraPopup();
    }

    // Take a picture and download it
    function takePicture() {
        const canvas = document.createElement('canvas');
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        canvas.getContext('2d').drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);

        // Convert the canvas content to a data URL
        const dataUrl = canvas.toDataURL('image/png');

        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'snapshot.png';
        link.click();

        // Close the camera popup
        closeCameraPopup();
    }

    // Close camera popup
    function closeCameraPopup() {
        // Hide the camera popup and stop the camera stream
        cameraPopup.style.display = 'none';
        if (cameraPreview.srcObject) {
            const tracks = cameraPreview.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    }

    // Generate bot response
    function generateBotResponse(userInput) {
        addChatMessage(userInput);
        speak(userInput);
    }

    // Speak the given message using a male voice
    async function speak(message) {
        const maleVoice = await getMaleVoice();
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.voice = maleVoice;
            utterance.onend = resolve;
            speechSynthesis.speak(utterance);
        });
    }

    // Get a male voice for speech synthesis
    async function getMaleVoice() {
        return new Promise(resolve => {
            let voices = speechSynthesis.getVoices();

            if (voices.length) {
                const maleVoices = voices.filter(voice => voice.name.includes('Male') && voice.lang.includes('en'));
                resolve(maleVoices[0] || voices[0]); // Fallback to any available voice if a male voice is not found
            } else {
                speechSynthesis.onvoiceschanged = () => {
                    voices = speechSynthesis.getVoices();
                    const maleVoices = voices.filter(voice => voice.name.includes('Male') && voice.lang.includes('en'));
                    resolve(maleVoices[0] || voices[0]); // Fallback to any available voice if a male voice is not found
                };
            }
        });
    }

    // Pause logo animation
    function pauseLogoAnimation() {
        logoContainer.style.animationPlayState = 'paused';
    }

    // Resume logo animation
    function resumeLogoAnimation() {
        logoContainer.style.animationPlayState = 'running';
    }

    // Get the greeting response based on language
    function getGreetingResponseByLanguage(language) {
        const greetings = {
            'hello': 'Hello! How can I assist you today?',
            'hi': 'Hello! How can I assist you today?',
            'hey': 'Hello! How can I assist you today?',
            'hola': 'Hola, ¿cómo puedo ayudarte?',
            'bonjour': 'Bonjour, comment puis-je vous aider?',
            'hallo': 'Hallo, wie kann ich Ihnen helfen?',
            '你好': '你好，我能帮助你什么呢？',
            'nǐ hǎo': '你好，我能帮助你什么呢？',
            'مرحبا': 'مرحبا، كيف يمكنني مساعدتك؟',
            'marhaban': 'مرحبا، كيف يمكنني مساعدتك؟',
            'привет': 'Привет, как я могу вам помочь?',
            'privet': 'Привет, как я могу вам помочь?',
            'नमस्ते': 'नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?',
            'namaste': 'नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?',
            'hujambo': 'Hujambo, nawezaje kusaidia?',
            'γεια σας': 'Γεια σας, πώς μπορώ να σας βοηθήσω;',
            'gia sas': 'Γεια σας, πώς μπορώ να σας βοηθήσω;',
            'こんにちは': 'こんにちは、どのようにお手伝いできますか？',
            'konnichiwa': 'こんにちは、どのようにお手伝いできますか？',
            '안녕하세요': '안녕하세요, 어떻게 도와 드릴까요?',
            'annyeonghaseyo': '안녕하세요, 어떻게 도와 드릴까요?',
            'ciao': 'Ciao, come posso aiutarti?',
            'olá': 'Olá, como posso ajudar você?'
        };

        return greetings[language] || greetings['hello'];
    }
});

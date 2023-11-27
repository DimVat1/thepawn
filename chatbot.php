<?php

// Get user message from the request
$userMessage = isset($_POST['userMessage']) ? strtolower($_POST['userMessage']) : '';

// Check if the user message is not empty
if (!empty($userMessage)) {
    // Check for greeting triggers
    $assistantReply = getGreetingResponse($userMessage);

    // Return the response as JSON
    echo json_encode(['assistantReply' => $assistantReply]);
} else {
    // Return an error message if the user message is empty
    echo json_encode(['error' => 'User message is empty.']);
}

// Function to check if the user message contains a greeting and return a response
function getGreetingResponse($message) {
    $greetings = [
        'english' => ['hello'],
        'spanish' => ['hola'],
        'french' => ['bonjour'],
        'german' => ['hallo'],
        'chinese' => ['你好', 'nǐ hǎo'],
        'arabic' => ['مرحبا', 'marhaban'],
        'russian' => ['привет', 'privet'],
        'hindi' => ['नमस्ते', 'namaste'],
        'swahili' => ['hujambo'],
        'greek' => ['γεια σας', 'gia sas'],
        'japanese' => ['こんにちは', 'konnichiwa'],
        'korean' => ['안녕하세요', 'annyeonghaseyo'],
        'italian' => ['ciao'],
        'portuguese' => ['olá'],
    ];

    foreach ($greetings as $language => $languageGreetings) {
        foreach ($languageGreetings as $greeting) {
            if (strpos($message, $greeting) !== false) {
                return getGreetingResponseByLanguage($language);
            }
        }
    }

    // Default response
    return 'I\'m not sure how to respond to that. Can you please try a different greeting?';
}

// Function to get a greeting response based on the language
function getGreetingResponseByLanguage($language) {
    $greetingResponses = [
        'english' => 'Hello, how can I assist you?',
        'spanish' => 'Hola, ¿cómo puedo ayudarte?',
        'french' => 'Bonjour, comment puis-je vous aider?',
        'german' => 'Hallo, wie kann ich Ihnen helfen?',
        'chinese' => '你好，我能帮助你什么呢？',
        'arabic' => 'مرحبا، كيف يمكنني مساعدتك؟',
        'russian' => 'Привет, как я могу вам помочь?',
        'hindi' => 'नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?',
        'swahili' => 'Hujambo, nawezaje kusaidia?',
        'greek' => 'Γεια σας, πώς μπορώ να σας βοηθήσω;',
        'japanese' => 'こんにちは、どのようにお手伝いできますか？',
        'korean' => '안녕하세요, 어떻게 도와 드릴까요?',
        'italian' => 'Ciao, come posso aiutarti?',
        'portuguese' => 'Olá, como posso ajudar você?',
    ];

    return $greetingResponses[$language] ?? 'Hello, how can I assist you?'; // Default to English if language not found
}

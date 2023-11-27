

<?php
// Set your OpenAI API key
$apiKey = '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';

// Get user message from the request
$userMessage = isset($_POST['userMessage']) ? $_POST['userMessage'] : '';

// Check if the user message is not empty
if (!empty($userMessage)) {
    // Prepare the prompt
    $prompt = "User: $userMessage\nAssistant:";

    // Set the OpenAI GPT-3 API endpoint
    $endpoint = 'https://api.openai.com/v1/completions';

    // Set the model name
    $model = 'text-davinci-002';

    // Set additional parameters
    $temperature = 0.7;
    $maxTokens = 150;

    // Prepare the cURL request
    $ch = curl_init($endpoint);

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ];

    $data = [
        'model' => $model,
        'prompt' => $prompt,
        'temperature' => $temperature,
        'max_tokens' => $maxTokens,
    ];

    // Set cURL options
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Execute cURL request
    $response = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    // Decode and return the response as JSON
    $responseData = json_decode($response, true);
    echo json_encode(['assistantReply' => $responseData['choices'][0]['text']]);
} else {
    // Return an error message if the user message is empty
    echo json_encode(['error' => 'User message is empty.']);
}


<?php
// Set your OpenAI API key (consider using environment variables)
$apiKey = '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';

// Sanitize user input
$userMessage = isset($_POST['userMessage']) ? htmlspecialchars($_POST['userMessage']) : '';

// Check if the user message is not empty
if (!empty($userMessage)) {
    // Prepare the prompt
    $prompt = "User: $userMessage\nAssistant:";

    // Set the OpenAI GPT-3 API endpoint
    $endpoint = 'https://api.openai.com/v1/completions';

    // Set the model name and other parameters
    $model = 'text-davinci-002';
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

    // Check for cURL and API response errors
    if ($response === false) {
        echo json_encode(['error' => 'cURL request failed.']);
    } else {
        // Decode and return the response as JSON
        $responseData = json_decode($response, true);

        if ($responseData === null || !isset($responseData['choices'][0]['text'])) {
            echo json_encode(['error' => 'Invalid or unexpected API response.']);
        } else {
            echo json_encode(['assistantReply' => $responseData['choices'][0]['text']]);
        }
    }

    // Close cURL session
    curl_close($ch);
} else {
    // Return an error message if the user message is empty
    echo json_encode(['error' => 'User message is empty.']);
}

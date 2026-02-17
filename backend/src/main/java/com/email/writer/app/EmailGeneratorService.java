package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailGeneratorService {

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.api.key}")
    private String apiKey;

    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "model", "mistralai/mistral-7b-instruct",
                "messages", new Object[]{
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                }
        );

        String response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(String.class);

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            return rootNode.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        // Base instruction
        prompt.append("Write a professional email reply. ");

        // Include sender and receiver names if provided and requested
        if(emailRequest.getIncludeNames() != null && emailRequest.getIncludeNames()) {
            if(emailRequest.getSenderName() != null && !emailRequest.getSenderName().isBlank()) {
                prompt.append("The reply is form ").append(emailRequest.getSenderName()).append(". ");
            }
            if(emailRequest.getReceiverName() != null && !emailRequest.getReceiverName().isBlank()) {
                prompt.append("It is addressed to ").append(emailRequest.getReceiverName()).append(". ");
            }
        }

        // Add tone instruction
        if (emailRequest.getTone() != null && !emailRequest.getTone().isBlank()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        } else {
            prompt.append("Use a professional tone. ");
        }

        // Include subject if provided (for context)
        if (emailRequest.getSubject() != null && !emailRequest.getSubject().isBlank()) {
            prompt.append("The original email subject is: \"").append(emailRequest.getSubject()).append("\". ");
        }

        // Signature handling
        if (emailRequest.getIncludeSignature() != null && emailRequest.getIncludeSignature()) {
            prompt.append("Include a standard email signature at the end. ");
        } else {
            prompt.append("Do not include a signature. ");
        }

        // Provide the original email content
        prompt.append("\n\nOriginal email:\n").append(emailRequest.getEmailContent());

        // Additional instruction to avoid adding a new subject line (if desired)
        prompt.append("\n\nDo not include a subject line in your reply.");

        return prompt.toString();
    }
}

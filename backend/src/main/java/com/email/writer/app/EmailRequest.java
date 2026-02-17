package com.email.writer.app;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {

    @NotBlank(message = "Email content cannot be empty")
    private String emailContent;

    private String tone = "professional";  // Default value
    private String senderName;
    private String receiverName;
    private String subject;
    private Boolean includeNames = true;
    private Boolean includeSignature = true;
    private Boolean keepFormatting = false;
}
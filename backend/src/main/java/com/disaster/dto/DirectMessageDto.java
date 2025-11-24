package com.disaster.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating direct messages
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectMessageDto {
    
    @NotNull(message = "Recipient ID is required")
    private Long recipientId;
    
    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message content cannot exceed 2000 characters")
    private String content;
    
    // Optional: Link to emergency request
    private Long relatedRequestId;
}

package com.disaster.dto;

import com.disaster.entity.DirectMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO for DirectMessage responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectMessageResponseDto {
    
    private Long id;
    private UserSummaryDto sender;
    private UserSummaryDto recipient;
    private String content;
    private Boolean isRead;
    private Instant readAt;
    private Instant createdAt;
    private Long relatedRequestId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserSummaryDto {
        private Long id;
        private String username;
        private String fullName;
        private String role;
        private String email;
    }
    
    /**
     * Convert DirectMessage entity to DTO
     */
    public static DirectMessageResponseDto fromEntity(DirectMessage message) {
        if (message == null) {
            return null;
        }
        
        UserSummaryDto senderDto = UserSummaryDto.builder()
                .id(message.getSender().getId())
                .username(message.getSender().getUsername())
                .fullName(message.getSender().getFullName())
                .role(message.getSender().getRole().toString())
                .email(message.getSender().getEmail())
                .build();
        
        UserSummaryDto recipientDto = UserSummaryDto.builder()
                .id(message.getRecipient().getId())
                .username(message.getRecipient().getUsername())
                .fullName(message.getRecipient().getFullName())
                .role(message.getRecipient().getRole().toString())
                .email(message.getRecipient().getEmail())
                .build();
        
        return DirectMessageResponseDto.builder()
                .id(message.getId())
                .sender(senderDto)
                .recipient(recipientDto)
                .content(message.getContent())
                .isRead(message.getIsRead())
                .readAt(message.getReadAt())
                .createdAt(message.getCreatedAt())
                .relatedRequestId(message.getRelatedRequest() != null ? message.getRelatedRequest().getId() : null)
                .build();
    }
}

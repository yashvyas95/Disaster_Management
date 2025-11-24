package com.disaster.service;

import com.disaster.dto.EmergencyRequestDto;
import com.disaster.entity.EmergencyRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for sending real-time notifications via WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Broadcast new emergency request to all admins and dispatchers
     */
    public void notifyNewEmergencyRequest(EmergencyRequest request) {
        log.info("Broadcasting new emergency request: {}", request.getId());
        messagingTemplate.convertAndSend("/topic/emergency/new", toDto(request));
    }
    
    /**
     * Notify about status update to subscribed users
     */
    public void notifyStatusUpdate(EmergencyRequest request) {
        log.info("Broadcasting status update for request {}: {}", request.getId(), request.getStatus());
        messagingTemplate.convertAndSend("/topic/emergency/status/" + request.getId(), toDto(request));
        
        // Also broadcast to general status updates channel
        messagingTemplate.convertAndSend("/topic/emergency/updates", toDto(request));
    }
    
    /**
     * Notify team assignment
     */
    public void notifyTeamAssignment(EmergencyRequest request) {
        log.info("Broadcasting team assignment for request {}", request.getId());
        
        // Notify the assigned team
        if (request.getAssignedTeam() != null) {
            messagingTemplate.convertAndSend("/topic/team/" + request.getAssignedTeam().getId() + "/assignments", toDto(request));
        }
        
        // Notify general updates
        messagingTemplate.convertAndSend("/topic/emergency/updates", toDto(request));
    }
    
    /**
     * Send notification to specific user
     */
    public void notifyUser(String username, String message) {
        log.info("Sending notification to user {}: {}", username, message);
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", message);
    }
    
    /**
     * Convert entity to DTO for WebSocket transmission
     */
    private EmergencyRequestDto toDto(EmergencyRequest request) {
        return EmergencyRequestDto.builder()
                .id(request.getId())
                .victimName(request.getVictimName())
                .victimPhone(request.getVictimPhone())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .emergencyType(request.getEmergencyType().name())
                .priority(request.getPriority().name())
                .status(request.getStatus().name())
                .description(request.getDescription())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}

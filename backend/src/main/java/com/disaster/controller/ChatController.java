package com.disaster.controller;

import com.disaster.entity.Message;
import com.disaster.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;

import java.util.Map;

/**
 * WebSocket controller for real-time chat messaging
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handle incoming chat messages
     * Client sends to: /app/chat/send
     * Server broadcasts to: /topic/chat/{requestId}
     */
    @MessageMapping("/chat/send")
    public void sendMessage(@Payload Map<String, Object> payload, Authentication authentication) {
        try {
            Long requestId = Long.valueOf(payload.get("requestId").toString());
            String content = payload.get("content").toString();
            String senderName = payload.get("senderName").toString();
            String senderType = payload.get("senderType").toString();

            log.info("Received WebSocket message for request {} from {}", requestId, senderName);

            // Save message to database
            Message savedMessage = messageService.sendMessage(
                    requestId, 
                    content, 
                    senderName, 
                    Message.SenderType.valueOf(senderType)
            );

            // Broadcast to all subscribers of this request's chat topic
            messagingTemplate.convertAndSend(
                    "/topic/chat/" + requestId, 
                    savedMessage
            );

            log.info("Broadcasted message to /topic/chat/{}", requestId);

        } catch (Exception e) {
            log.error("Error processing WebSocket message: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle typing indicator
     * Client sends to: /app/chat/typing/{requestId}
     * Server broadcasts to: /topic/chat/{requestId}/typing
     */
    @MessageMapping("/chat/typing/{requestId}")
    @SendTo("/topic/chat/{requestId}/typing")
    public Map<String, Object> handleTyping(
            @DestinationVariable Long requestId,
            @Payload Map<String, Object> payload
    ) {
        log.debug("User {} is typing in request {}", payload.get("senderName"), requestId);
        return payload;
    }

    /**
     * Notify when emergency request status changes
     */
    public void notifyStatusChange(Long requestId, String newStatus) {
        Map<String, Object> notification = Map.of(
                "type", "STATUS_CHANGE",
                "requestId", requestId,
                "status", newStatus,
                "timestamp", System.currentTimeMillis()
        );
        
        messagingTemplate.convertAndSend("/topic/requests/" + requestId, notification);
        log.info("Sent status change notification for request {}: {}", requestId, newStatus);
    }

    /**
     * Notify when team is assigned to request
     */
    public void notifyTeamAssignment(Long requestId, Long teamId, String teamName) {
        Map<String, Object> notification = Map.of(
                "type", "TEAM_ASSIGNED",
                "requestId", requestId,
                "teamId", teamId,
                "teamName", teamName,
                "timestamp", System.currentTimeMillis()
        );
        
        messagingTemplate.convertAndSend("/topic/requests/" + requestId, notification);
        log.info("Sent team assignment notification for request {}: team {}", requestId, teamName);
    }
}

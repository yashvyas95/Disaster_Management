package com.disaster.controller;

import com.disaster.entity.Message;
import com.disaster.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for chat message management
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Chat message management endpoints")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @Operation(summary = "Send message", description = "Send new chat message for emergency request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Message sent successfully"),
            @ApiResponse(responseCode = "404", description = "Request not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long requestId,
            @RequestParam String content,
            @RequestParam String senderName,
            @RequestParam String senderType
    ) {
        Message.SenderType type = Message.SenderType.valueOf(senderType);
        Message message = messageService.sendMessage(requestId, content, senderName, type);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping
    @Operation(summary = "Get messages", description = "Retrieve paginated messages for emergency request")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER', 'RESCUE_TEAM', 'VICTIM')")
    public ResponseEntity<Page<Message>> getMessages(
            @RequestParam Long requestId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageService.getMessagesByRequestId(requestId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all messages", description = "Retrieve all messages for emergency request (non-paginated)")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER', 'RESCUE_TEAM', 'VICTIM')")
    public ResponseEntity<List<Message>> getAllMessages(@RequestParam Long requestId) {
        List<Message> messages = messageService.getAllMessagesByRequestId(requestId);
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark message as read", description = "Mark specific message as read")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message marked as read"),
            @ApiResponse(responseCode = "404", description = "Message not found")
    })
    public ResponseEntity<Message> markAsRead(@PathVariable Long id) {
        Message message = messageService.markAsRead(id);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all as read", description = "Mark all messages in request as read")
    public ResponseEntity<Void> markAllAsRead(@RequestParam Long requestId) {
        messageService.markAllAsRead(requestId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread count", description = "Get count of unread messages for request")
    public ResponseEntity<Long> getUnreadCount(@RequestParam Long requestId) {
        long count = messageService.getUnreadCount(requestId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/by-sender")
    @Operation(summary = "Get messages by sender type", description = "Filter messages by sender type")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<List<Message>> getBySenderType(
            @RequestParam Long requestId,
            @RequestParam String senderType
    ) {
        Message.SenderType type = Message.SenderType.valueOf(senderType);
        List<Message> messages = messageService.getMessagesBySenderType(requestId, type);
        return ResponseEntity.ok(messages);
    }
}

package com.disaster.controller;

import com.disaster.dto.DirectMessageDto;
import com.disaster.dto.DirectMessageResponseDto;
import com.disaster.entity.DirectMessage;
import com.disaster.service.DirectMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
 * REST Controller for direct messaging between users
 */
@RestController
@RequestMapping("/api/direct-messages")
@RequiredArgsConstructor
@Tag(name = "Direct Messages", description = "User-to-user messaging endpoints")
public class DirectMessageController {

    private final DirectMessageService messageService;

    @PostMapping
    @Operation(summary = "Send message", description = "Send a direct message to another user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Message sent successfully"),
            @ApiResponse(responseCode = "404", description = "Recipient not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DirectMessageResponseDto> sendMessage(@Valid @RequestBody DirectMessageDto dto) {
        DirectMessageResponseDto message = messageService.sendMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/conversation/{userId}")
    @Operation(summary = "Get conversation", description = "Get all messages between current user and specified user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DirectMessageResponseDto>> getConversation(@PathVariable Long userId) {
        List<DirectMessageResponseDto> messages = messageService.getConversation(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/my-messages")
    @Operation(summary = "Get my messages", description = "Get all messages for current user (paginated)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<DirectMessage>> getMyMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DirectMessage> messages = messageService.getMyMessages(pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread messages", description = "Get all unread messages for current user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DirectMessage>> getUnreadMessages() {
        List<DirectMessage> messages = messageService.getUnreadMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread count", description = "Get count of unread messages for current user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getUnreadCount() {
        long count = messageService.getUnreadCount();
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark as read", description = "Mark a message as read")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message marked as read"),
            @ApiResponse(responseCode = "404", description = "Message not found")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DirectMessage> markAsRead(@PathVariable Long id) {
        DirectMessage message = messageService.markAsRead(id);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/conversation/{userId}/read")
    @Operation(summary = "Mark conversation as read", description = "Mark all messages in conversation as read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markConversationAsRead(@PathVariable Long userId) {
        messageService.markConversationAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available-recipients")
    @Operation(summary = "Get available recipients", description = "Get list of users who can receive messages from current user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DirectMessageResponseDto.UserSummaryDto>> getAvailableRecipients() {
        List<DirectMessageResponseDto.UserSummaryDto> recipients = messageService.getAvailableRecipients();
        return ResponseEntity.ok(recipients);
    }

    @GetMapping("/conversation-partners")
    @Operation(summary = "Get conversation partners", description = "Get users with whom current user has conversations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DirectMessageResponseDto.UserSummaryDto>> getConversationPartners() {
        List<DirectMessageResponseDto.UserSummaryDto> partners = messageService.getConversationPartners();
        return ResponseEntity.ok(partners);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete message", description = "Delete a sent message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Message deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Message not found"),
            @ApiResponse(responseCode = "403", description = "Not authorized to delete this message")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}

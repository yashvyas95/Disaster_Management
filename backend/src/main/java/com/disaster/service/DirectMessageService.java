package com.disaster.service;

import com.disaster.dto.DirectMessageDto;
import com.disaster.dto.DirectMessageResponseDto;
import com.disaster.entity.DirectMessage;
import com.disaster.entity.EmergencyRequest;
import com.disaster.entity.User;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.DirectMessageRepository;
import com.disaster.repository.EmergencyRequestRepository;
import com.disaster.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service for managing direct messages between users
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DirectMessageService {

    private final DirectMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final EmergencyRequestRepository requestRepository;

    /**
     * Send a direct message
     */
    @Transactional
    public DirectMessageResponseDto sendMessage(DirectMessageDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User sender = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + dto.getRecipientId()));

        DirectMessage.DirectMessageBuilder messageBuilder = DirectMessage.builder()
                .sender(sender)
                .recipient(recipient)
                .content(dto.getContent())
                .isRead(false);

        // Add related request if provided
        if (dto.getRelatedRequestId() != null) {
            EmergencyRequest request = requestRepository.findById(dto.getRelatedRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + dto.getRelatedRequestId()));
            messageBuilder.relatedRequest(request);
        }

        DirectMessage message = messageBuilder.build();
        DirectMessage savedMessage = messageRepository.save(message);
        
        log.info("Message sent from {} to {}", sender.getUsername(), recipient.getUsername());
        return DirectMessageResponseDto.fromEntity(savedMessage);
    }

    /**
     * Get conversation between current user and another user
     */
    @Transactional(readOnly = true)
    public List<DirectMessageResponseDto> getConversation(Long otherUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + otherUserId));

        List<DirectMessage> messages = messageRepository.findConversation(currentUser, otherUser);
        return messages.stream()
                .map(DirectMessageResponseDto::fromEntity)
                .toList();
    }

    /**
     * Get all messages for current user
     */
    @Transactional(readOnly = true)
    public Page<DirectMessage> getMyMessages(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        return messageRepository.findByUser(currentUser, pageable);
    }

    /**
     * Get unread messages for current user
     */
    @Transactional(readOnly = true)
    public List<DirectMessage> getUnreadMessages() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        return messageRepository.findUnreadMessages(currentUser);
    }

    /**
     * Get unread message count for current user
     */
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        return messageRepository.countUnreadMessages(currentUser);
    }

    /**
     * Mark a message as read
     */
    @Transactional
    public DirectMessage markAsRead(Long messageId) {
        DirectMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));

        if (!message.getIsRead()) {
            message.setIsRead(true);
            message.setReadAt(Instant.now());
            return messageRepository.save(message);
        }

        return message;
    }

    /**
     * Mark all messages from a user as read
     */
    @Transactional
    public void markConversationAsRead(Long otherUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + otherUserId));

        List<DirectMessage> conversation = messageRepository.findConversation(currentUser, otherUser);
        Instant now = Instant.now();

        conversation.stream()
                .filter(m -> m.getRecipient().equals(currentUser) && !m.getIsRead())
                .forEach(m -> {
                    m.setIsRead(true);
                    m.setReadAt(now);
                });

        messageRepository.saveAll(conversation);
    }

    /**
     * Get all users who can be messaged by current user
     */
    @Transactional(readOnly = true)
    public List<DirectMessageResponseDto.UserSummaryDto> getAvailableRecipients() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User.UserRole currentRole = currentUser.getRole();

        // Admin can message everyone
        if (currentRole == User.UserRole.ROLE_ADMIN) {
            return userRepository.findAll().stream()
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    .map(this::convertToUserSummary)
                    .toList();
        }

        // Employees can message other employees and admin
        if (currentRole == User.UserRole.ROLE_DEPARTMENT_HEAD ||
            currentRole == User.UserRole.ROLE_DISPATCHER ||
            currentRole == User.UserRole.ROLE_RESCUE_TEAM_MEMBER) {
            
            return userRepository.findAll().stream()
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    .filter(u -> u.getRole() == User.UserRole.ROLE_ADMIN ||
                               u.getRole() == User.UserRole.ROLE_DEPARTMENT_HEAD ||
                               u.getRole() == User.UserRole.ROLE_DISPATCHER ||
                               u.getRole() == User.UserRole.ROLE_RESCUE_TEAM_MEMBER)
                    .map(this::convertToUserSummary)
                    .toList();
        }

        // Victims can message admin and rescue teams assigned to their requests
        if (currentRole == User.UserRole.ROLE_VICTIM) {
            return userRepository.findAll().stream()
                    .filter(u -> !u.getId().equals(currentUser.getId()))
                    .filter(u -> u.getRole() == User.UserRole.ROLE_ADMIN ||
                               u.getRole() == User.UserRole.ROLE_RESCUE_TEAM_MEMBER)
                    .map(this::convertToUserSummary)
                    .toList();
        }

        return List.of();
    }

    /**
     * Get users with whom current user has conversations
     */
    @Transactional(readOnly = true)
    public List<DirectMessageResponseDto.UserSummaryDto> getConversationPartners() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Get users who sent messages to current user
        List<User> senders = messageRepository.findDistinctSendersByRecipient(currentUser);
        
        // Get users who received messages from current user
        List<User> recipients = messageRepository.findDistinctRecipientsBySender(currentUser);
        
        // Combine both lists and remove duplicates
        Set<User> allPartners = new HashSet<>();
        allPartners.addAll(senders);
        allPartners.addAll(recipients);
        
        return allPartners.stream()
                .map(this::convertToUserSummary)
                .toList();
    }

    /**
     * Helper method to convert User to UserSummaryDto
     */
    private DirectMessageResponseDto.UserSummaryDto convertToUserSummary(User user) {
        return DirectMessageResponseDto.UserSummaryDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().toString())
                .email(user.getEmail())
                .build();
    }

    /**
     * Delete a message (soft delete by marking as deleted)
     */
    @Transactional
    public void deleteMessage(Long messageId) {
        DirectMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));

        // Only sender can delete
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        if (!message.getSender().getUsername().equals(currentUsername)) {
            throw new IllegalStateException("Only sender can delete message");
        }

        messageRepository.delete(message);
        log.info("Message deleted: {}", messageId);
    }
}

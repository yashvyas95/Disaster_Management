package com.disaster.service;

import com.disaster.entity.EmergencyRequest;
import com.disaster.entity.Message;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.EmergencyRequestRepository;
import com.disaster.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing chat messages
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final EmergencyRequestRepository requestRepository;

    /**
     * Send new message
     */
    @Transactional
    public Message sendMessage(Long requestId, String content, String senderName, 
                               Message.SenderType senderType) {
        log.info("Sending message for request {} from {}", requestId, senderName);

        EmergencyRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        Message message = Message.builder()
                .request(request)
                .content(content)
                .senderName(senderName)
                .senderType(senderType)
                .isRead(false)
                .build();

        return messageRepository.save(message);
    }

    /**
     * Get messages by request ID (paginated)
     */
    @Transactional(readOnly = true)
    public Page<Message> getMessagesByRequestId(Long requestId, Pageable pageable) {
        return messageRepository.findByRequestId(requestId, pageable);
    }

    /**
     * Get all messages for a request (ordered by time)
     */
    @Transactional(readOnly = true)
    public List<Message> getAllMessagesByRequestId(Long requestId) {
        return messageRepository.findByRequestIdOrderByCreatedAtDesc(requestId);
    }

    /**
     * Mark message as read
     */
    @Transactional
    public Message markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));
        
        message.setIsRead(true);
        return messageRepository.save(message);
    }

    /**
     * Mark all messages in a request as read
     */
    @Transactional
    public void markAllAsRead(Long requestId) {
        List<Message> messages = messageRepository.findByRequestIdOrderByCreatedAtDesc(requestId);
        messages.forEach(msg -> msg.setIsRead(true));
        messageRepository.saveAll(messages);
        log.info("Marked {} messages as read for request {}", messages.size(), requestId);
    }

    /**
     * Get unread message count for a request
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long requestId) {
        return messageRepository.countUnreadByRequestId(requestId);
    }

    /**
     * Get messages by sender type
     */
    @Transactional(readOnly = true)
    public List<Message> getMessagesBySenderType(Long requestId, Message.SenderType senderType) {
        return messageRepository.findByRequestIdAndSenderType(requestId, senderType);
    }
}

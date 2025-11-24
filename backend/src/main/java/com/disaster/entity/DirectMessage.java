package com.disaster.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

/**
 * DirectMessage entity for user-to-user messaging
 */
@Entity
@Table(name = "direct_messages", indexes = {
    @Index(name = "idx_sender", columnList = "sender_id"),
    @Index(name = "idx_recipient", columnList = "recipient_id"),
    @Index(name = "idx_created_at", columnList = "createdAt"),
    @Index(name = "idx_is_read", columnList = "isRead")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@lombok.ToString(exclude = {"sender", "recipient", "relatedRequest"})
public class DirectMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    @NotNull(message = "Sender is required")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    @NotNull(message = "Recipient is required")
    private User recipient;

    @NotBlank(message = "Message content is required")
    @Size(max = 2000)
    @Column(nullable = false, length = 2000)
    private String content;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isRead = false;

    @Column
    private Instant readAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // Optional: Link to emergency request if message is related to one
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_request_id")
    private EmergencyRequest relatedRequest;
}

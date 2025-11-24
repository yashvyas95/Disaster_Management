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
 * Message entity for real-time chat between victims and rescue teams
 */
@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_request", columnList = "request_id"),
    @Index(name = "idx_sender", columnList = "senderType"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@lombok.ToString(exclude = {"request"})
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @NotNull(message = "Request is required")
    private EmergencyRequest request;

    @NotBlank(message = "Content is required")
    @Size(max = 2000)
    @Column(nullable = false, length = 2000)
    private String content;

    @NotBlank(message = "Sender name is required")
    @Column(nullable = false, length = 100)
    private String senderName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SenderType senderType;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isRead = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public enum SenderType {
        VICTIM,
        RESCUE_TEAM,
        DISPATCHER,
        SYSTEM
    }
}

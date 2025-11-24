package com.disaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * EmergencyRequest entity representing disaster/emergency requests from victims
 */
@Entity
@Table(name = "emergency_requests", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_type", columnList = "emergencyType"),
    @Index(name = "idx_priority", columnList = "priority"),
    @Index(name = "idx_location", columnList = "location"),
    @Index(name = "idx_created_at", columnList = "createdAt"),
    @Index(name = "idx_assigned_team", columnList = "assigned_team_id")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@lombok.ToString(exclude = {"assignedTeam", "messages"})
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Victim name is required")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String victimName;

    @Size(max = 100)
    @Column(length = 100)
    private String victimPhone;

    @NotBlank(message = "Location is required")
    @Size(max = 300)
    @Column(nullable = false, length = 300)
    private String location;

    private Double latitude;

    private Double longitude;

    @NotNull(message = "Emergency type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RescueTeam.EmergencyType emergencyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RequestPriority priority = RequestPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Size(max = 1000)
    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_team_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"department", "user", "currentRequest", "requestHistory", "hibernateLazyInitializer", "handler"})
    private RescueTeam assignedTeam;

    @JsonIgnore
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @Column
    private Instant assignedAt;

    @Column
    private Instant respondedAt;

    @Column
    private Instant completedAt;

    @Size(max = 1000)
    @Column(length = 1000)
    private String resolutionNotes;

    @Column(length = 100)
    private String createdBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    public enum RequestStatus {
        PENDING,
        ASSIGNED,
        EN_ROUTE,
        ON_SCENE,
        RESOLVED,
        CANCELLED
    }

    public enum RequestPriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}

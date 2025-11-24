package com.disaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * RescueTeam entity representing emergency response teams
 */
@Entity
@Table(name = "rescue_teams", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_department", columnList = "department_id"),
    @Index(name = "idx_current_request", columnList = "current_request_id")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@lombok.ToString(exclude = {"department", "user", "currentRequest", "requestHistory"})
public class RescueTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Team name is required")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    @NotNull(message = "Department is required")
    private Department department;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "team_capabilities", 
                     joinColumns = @JoinColumn(name = "team_id"))
    @Column(name = "capability")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<EmergencyType> capabilities = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TeamStatus status = TeamStatus.AVAILABLE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_request_id")
    private EmergencyRequest currentRequest;

    @JsonIgnore
    @OneToMany(mappedBy = "assignedTeam")
    @Builder.Default
    private List<EmergencyRequest> requestHistory = new ArrayList<>();

    @Positive(message = "Member count must be positive")
    @Column(nullable = false)
    @Builder.Default
    private Integer memberCount = 1;

    @Size(max = 500)
    @Column(length = 500)
    private String equipment;

    @Column(length = 200)
    private String currentLocation;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    public enum TeamStatus {
        AVAILABLE,
        ASSIGNED,
        EN_ROUTE,
        ON_SCENE,
        RETURNING,
        OFF_DUTY
    }

    public enum EmergencyType {
        FIRE,
        MEDICAL,
        CRIME,
        NATURAL_DISASTER,
        ACCIDENT,
        RESCUE,
        HAZMAT
    }
}

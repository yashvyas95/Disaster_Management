package com.disaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO for emergency request responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyRequestResponseDto {
    private Long id;
    private String victimName;
    private String victimPhone;
    private String location;
    private Double latitude;
    private Double longitude;
    private String emergencyType;
    private String priority;
    private String status;
    private String description;
    private Long assignedTeamId;
    private String assignedTeamName;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant assignedAt;
    private Instant respondedAt;
    private Instant completedAt;
    private String resolutionNotes;
}

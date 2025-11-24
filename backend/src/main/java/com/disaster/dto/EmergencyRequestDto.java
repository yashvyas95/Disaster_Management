package com.disaster.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO for creating emergency requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyRequestDto {

    private Long id;

    @NotBlank(message = "Victim name is required")
    private String victimName;

    private String victimPhone;

    @NotBlank(message = "Location is required")
    @Size(max = 300)
    private String location;

    private Double latitude;
    private Double longitude;

    @NotBlank(message = "Emergency type is required")
    private String emergencyType;

    private String priority;
    private String status;

    @Size(max = 1000)
    private String description;
    
    private Instant createdAt;
    private Instant updatedAt;
}

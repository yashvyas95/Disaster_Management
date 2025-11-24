package com.disaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for victim dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VictimDashboardDto {
    private Long totalRequests;
    private Long pendingRequests;
    private Long resolvedRequests;
    private List<EmergencyRequestResponseDto> recentRequests;
}

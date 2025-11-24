package com.disaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for department dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDashboardDto {
    private Long assignedRequests;
    private Long completedRequests;
    private Long pendingAssignments;
    private Double teamUtilization; // percentage
    private List<EmergencyRequestResponseDto> requests;
}

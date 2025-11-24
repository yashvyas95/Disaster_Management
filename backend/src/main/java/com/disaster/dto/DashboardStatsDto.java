package com.disaster.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    // Overall statistics
    private Long totalRequests;
    private Long pendingRequests;
    private Long activeRequests;
    private Long resolvedRequests;
    private Long totalVictims;
    private Long totalRescueTeams;
    private Long totalDepartments;
    private Long availableTeams;
    private Long busyTeams;

    // Request breakdown by status
    private Map<String, Long> requestsByStatus;

    // Request breakdown by emergency type
    private Map<String, Long> requestsByType;

    // Request breakdown by priority
    private Map<String, Long> requestsByPriority;

    // Department statistics
    private Map<String, Long> requestsByDepartment;

    // Recent activity
    private Long requestsLast24Hours;
    private Long requestsLast7Days;
    private Double averageResponseTime; // in minutes

    // Performance metrics
    private Double resolutionRate; // percentage
    private Long criticalRequests;
    private Long highPriorityRequests;
}

package com.disaster.controller;

import com.disaster.dto.DashboardStatsDto;
import com.disaster.dto.DepartmentDashboardDto;
import com.disaster.dto.VictimDashboardDto;
import com.disaster.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for dashboard statistics and analytics
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard statistics and analytics endpoints")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    @Operation(
        summary = "Get comprehensive dashboard statistics",
        description = "Retrieve overall system statistics including requests, teams, and departments (Admin/Department Head only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - insufficient permissions")
    })
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/victim")
    @PreAuthorize("hasRole('VICTIM')")
    @Operation(
        summary = "Get victim dashboard data",
        description = "Retrieve dashboard data for the authenticated victim's own requests"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<VictimDashboardDto> getVictimDashboard(Authentication authentication) {
        String username = authentication.getName();
        VictimDashboardDto dashboard = dashboardService.getVictimDashboard(username);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/department")
    @PreAuthorize("hasAnyRole('DEPARTMENT_HEAD', 'DISPATCHER', 'RESCUE_TEAM_MEMBER')")
    @Operation(
        summary = "Get department dashboard data",
        description = "Retrieve dashboard data for the authenticated user's department including assigned requests and team utilization"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "User not assigned to any department")
    })
    public ResponseEntity<DepartmentDashboardDto> getDepartmentDashboard(Authentication authentication) {
        String username = authentication.getName();
        DepartmentDashboardDto dashboard = dashboardService.getDepartmentDashboard(username);
        return ResponseEntity.ok(dashboard);
    }

    // Keep old endpoint for backward compatibility
    @GetMapping("/victim/stats")
    @PreAuthorize("hasRole('VICTIM')")
    @Operation(
        summary = "Get victim dashboard statistics (deprecated)",
        description = "Use /api/dashboard/victim instead"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @Deprecated
    public ResponseEntity<DashboardStatsDto> getVictimDashboardStats(Authentication authentication) {
        String username = authentication.getName();
        DashboardStatsDto stats = dashboardService.getVictimDashboardStats(username);
        return ResponseEntity.ok(stats);
    }
}

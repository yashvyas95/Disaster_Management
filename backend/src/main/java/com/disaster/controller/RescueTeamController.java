package com.disaster.controller;

import com.disaster.entity.RescueTeam;
import com.disaster.service.RescueTeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * REST Controller for rescue team management
 */
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Tag(name = "Rescue Teams", description = "Rescue team management endpoints")
public class RescueTeamController {

    private final RescueTeamService teamService;

    @GetMapping
    @Operation(summary = "Get all teams", description = "Retrieve all rescue teams")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    public ResponseEntity<List<RescueTeam>> getAllTeams() {
        List<RescueTeam> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/available")
    @Operation(summary = "Get available teams", description = "Retrieve teams with AVAILABLE status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER', 'RESCUE_TEAM')")
    public ResponseEntity<List<RescueTeam>> getAvailableTeams() {
        List<RescueTeam> teams = teamService.getAvailableTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/available/{capability}")
    @Operation(summary = "Get available teams by capability", description = "Find available teams with specific emergency type capability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Teams retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid capability type")
    })
    public ResponseEntity<List<RescueTeam>> getAvailableByCapability(@PathVariable String capability) {
        List<RescueTeam> teams = teamService.getAvailableByCapability(capability);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get team by ID", description = "Retrieve specific rescue team details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Team found"),
            @ApiResponse(responseCode = "404", description = "Team not found")
    })
    public ResponseEntity<RescueTeam> getTeamById(@PathVariable Long id) {
        RescueTeam team = teamService.getById(id);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get teams by status", description = "Filter teams by status (AVAILABLE, ASSIGNED, EN_ROUTE, ON_SCENE, RETURNING, OFF_DUTY)")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    public ResponseEntity<List<RescueTeam>> getByStatus(@PathVariable String status) {
        List<RescueTeam> teams = teamService.getByStatus(status);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get teams by department", description = "Retrieve teams belonging to specific department")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<List<RescueTeam>> getByDepartmentId(@PathVariable Long departmentId) {
        List<RescueTeam> teams = teamService.getByDepartmentId(departmentId);
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    @Operation(summary = "Create rescue team", description = "Create new rescue team")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Team created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Department not found")
    })
    public ResponseEntity<RescueTeam> createTeam(@Valid @RequestBody RescueTeam team) {
        RescueTeam created = teamService.createTeam(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update team status", description = "Change rescue team status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'RESCUE_TEAM')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Team not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<RescueTeam> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        RescueTeam updated = teamService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/location")
    @Operation(summary = "Update team location", description = "Update current location of rescue team")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESCUE_TEAM')")
    public ResponseEntity<RescueTeam> updateLocation(
            @PathVariable Long id,
            @RequestParam String location
    ) {
        RescueTeam updated = teamService.updateLocation(id, location);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/capabilities")
    @Operation(summary = "Update team capabilities", description = "Update emergency type capabilities of team")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RescueTeam> updateCapabilities(
            @PathVariable Long id,
            @RequestBody Set<RescueTeam.EmergencyType> capabilities
    ) {
        RescueTeam updated = teamService.updateCapabilities(id, capabilities);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete team", description = "Delete rescue team (only if not assigned)")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Team deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Team not found"),
            @ApiResponse(responseCode = "400", description = "Team has active assignment")
    })
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/by-status")
    @Operation(summary = "Get team statistics", description = "Get count of teams by status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<Map<String, Long>> getStatsByStatus() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("AVAILABLE", teamService.countByStatus("AVAILABLE"));
        stats.put("ASSIGNED", teamService.countByStatus("ASSIGNED"));
        stats.put("EN_ROUTE", teamService.countByStatus("EN_ROUTE"));
        stats.put("ON_SCENE", teamService.countByStatus("ON_SCENE"));
        stats.put("RETURNING", teamService.countByStatus("RETURNING"));
        stats.put("OFF_DUTY", teamService.countByStatus("OFF_DUTY"));
        return ResponseEntity.ok(stats);
    }
}

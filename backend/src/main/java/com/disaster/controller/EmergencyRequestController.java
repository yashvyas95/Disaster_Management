package com.disaster.controller;

import com.disaster.dto.EmergencyRequestDto;
import com.disaster.entity.EmergencyRequest;
import com.disaster.service.EmergencyRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for emergency request management
 */
@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@Tag(name = "Emergency Requests", description = "Emergency request management endpoints")
public class EmergencyRequestController {

    private final EmergencyRequestService requestService;

    @PostMapping("/emergency")
    @Operation(summary = "Create emergency request", description = "Submit new emergency request from victim")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<EmergencyRequest> createRequest(@Valid @RequestBody EmergencyRequestDto request) {
        EmergencyRequest created = requestService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "Get all requests", description = "Retrieve paginated list of emergency requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    public ResponseEntity<Page<EmergencyRequest>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("ASC") ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EmergencyRequest> requests = requestService.getAllRequests(pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/active")
    @Operation(summary = "Get active requests", description = "Retrieve all unresolved emergency requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER', 'RESCUE_TEAM')")
    public ResponseEntity<Page<EmergencyRequest>> getActiveRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmergencyRequest> requests = requestService.getActiveRequests(pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request by ID", description = "Retrieve specific emergency request details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Request found"),
            @ApiResponse(responseCode = "404", description = "Request not found")
    })
    public ResponseEntity<EmergencyRequest> getRequestById(@PathVariable Long id) {
        EmergencyRequest request = requestService.getById(id);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get requests by status", description = "Filter requests by status (PENDING, ASSIGNED, EN_ROUTE, ON_SCENE, RESOLVED)")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    public ResponseEntity<Page<EmergencyRequest>> getByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmergencyRequest> requests = requestService.getByStatus(status, pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/team/{teamId}")
    @Operation(summary = "Get team requests", description = "Retrieve requests assigned to specific rescue team")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'RESCUE_TEAM')")
    public ResponseEntity<Page<EmergencyRequest>> getByTeamId(
            @PathVariable Long teamId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmergencyRequest> requests = requestService.getByTeamId(teamId, pageable);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/{id}/assign/{teamId}")
    @Operation(summary = "Assign team to request", description = "Manually assign rescue team to emergency request")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Team assigned successfully"),
            @ApiResponse(responseCode = "404", description = "Request or team not found"),
            @ApiResponse(responseCode = "400", description = "Team lacks required capability")
    })
    public ResponseEntity<EmergencyRequest> assignTeamPost(
            @PathVariable Long id,
            @PathVariable Long teamId
    ) {
        EmergencyRequest updated = requestService.assignTeamToRequest(id, teamId);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign team to request", description = "Manually assign rescue team to emergency request")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Team assigned successfully"),
            @ApiResponse(responseCode = "404", description = "Request or team not found"),
            @ApiResponse(responseCode = "400", description = "Team lacks required capability")
    })
    public ResponseEntity<EmergencyRequest> assignTeam(
            @PathVariable Long id,
            @RequestParam Long teamId
    ) {
        EmergencyRequest updated = requestService.assignTeamToRequest(id, teamId);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update request status", description = "Change emergency request status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'DISPATCHER', 'RESCUE_TEAM')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Request not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    public ResponseEntity<EmergencyRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        EmergencyRequest updated = requestService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/notes")
    @Operation(summary = "Add resolution notes", description = "Add notes after resolving emergency request")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'RESCUE_TEAM')")
    public ResponseEntity<EmergencyRequest> addResolutionNotes(
            @PathVariable Long id,
            @RequestParam String notes
    ) {
        EmergencyRequest updated = requestService.addResolutionNotes(id, notes);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/stats/by-status")
    @Operation(summary = "Get request statistics", description = "Get count of requests by status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD')")
    public ResponseEntity<Map<String, Long>> getStatsByStatus() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("PENDING", requestService.countByStatus("PENDING"));
        stats.put("ASSIGNED", requestService.countByStatus("ASSIGNED"));
        stats.put("EN_ROUTE", requestService.countByStatus("EN_ROUTE"));
        stats.put("ON_SCENE", requestService.countByStatus("ON_SCENE"));
        stats.put("RESOLVED", requestService.countByStatus("RESOLVED"));
        return ResponseEntity.ok(stats);
    }
}

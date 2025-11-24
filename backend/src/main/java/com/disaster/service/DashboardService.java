package com.disaster.service;

import com.disaster.dto.DashboardStatsDto;
import com.disaster.dto.DepartmentDashboardDto;
import com.disaster.dto.EmergencyRequestResponseDto;
import com.disaster.dto.VictimDashboardDto;
import com.disaster.entity.Department;
import com.disaster.entity.EmergencyRequest;
import com.disaster.entity.RescueTeam;
import com.disaster.entity.User;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.DepartmentRepository;
import com.disaster.repository.EmergencyRequestRepository;
import com.disaster.repository.RescueTeamRepository;
import com.disaster.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for dashboard statistics and analytics
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final EmergencyRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RescueTeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;

    /**
     * Get comprehensive dashboard statistics
     */
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        log.info("Generating dashboard statistics");

        // Get all requests
        List<EmergencyRequest> allRequests = requestRepository.findAll();

        // Calculate basic counts
        long totalRequests = allRequests.size();
        long pendingRequests = allRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.PENDING)
                .count();
        long activeRequests = allRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.ASSIGNED ||
                           r.getStatus() == EmergencyRequest.RequestStatus.EN_ROUTE ||
                           r.getStatus() == EmergencyRequest.RequestStatus.ON_SCENE)
                .count();
        long resolvedRequests = allRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.RESOLVED)
                .count();

        // User counts
        long totalVictims = userRepository.countByRole(com.disaster.entity.User.UserRole.ROLE_VICTIM);

        // Team counts
        long totalTeams = teamRepository.count();
        long availableTeams = teamRepository.countByStatus(com.disaster.entity.RescueTeam.TeamStatus.AVAILABLE);
        long busyTeams = teamRepository.countByStatus(com.disaster.entity.RescueTeam.TeamStatus.ASSIGNED);

        // Department count
        long totalDepartments = departmentRepository.count();

        // Requests by status
        Map<String, Long> requestsByStatus = allRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatus().toString(),
                        Collectors.counting()
                ));

        // Requests by emergency type
        Map<String, Long> requestsByType = allRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getEmergencyType().toString(),
                        Collectors.counting()
                ));

        // Requests by priority
        Map<String, Long> requestsByPriority = allRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getPriority().toString(),
                        Collectors.counting()
                ));

        // Requests by department (for assigned requests)
        Map<String, Long> requestsByDepartment = allRequests.stream()
                .filter(r -> r.getAssignedTeam() != null && 
                           r.getAssignedTeam().getDepartment() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getAssignedTeam().getDepartment().getName(),
                        Collectors.counting()
                ));

        // Time-based statistics
        Instant now = Instant.now();
        Instant yesterday = now.minus(24, ChronoUnit.HOURS);
        Instant weekAgo = now.minus(7, ChronoUnit.DAYS);

        long requestsLast24Hours = allRequests.stream()
                .filter(r -> r.getCreatedAt().isAfter(yesterday))
                .count();

        long requestsLast7Days = allRequests.stream()
                .filter(r -> r.getCreatedAt().isAfter(weekAgo))
                .count();

        // Calculate average response time (for resolved requests)
        Double averageResponseTime = allRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.RESOLVED &&
                           r.getUpdatedAt() != null)
                .mapToLong(r -> ChronoUnit.MINUTES.between(r.getCreatedAt(), r.getUpdatedAt()))
                .average()
                .orElse(0.0);

        // Calculate resolution rate
        Double resolutionRate = totalRequests > 0 
                ? (resolvedRequests * 100.0 / totalRequests) 
                : 0.0;

        // Priority counts
        long criticalRequests = allRequests.stream()
                .filter(r -> r.getPriority() == EmergencyRequest.RequestPriority.CRITICAL)
                .count();
        long highPriorityRequests = allRequests.stream()
                .filter(r -> r.getPriority() == EmergencyRequest.RequestPriority.HIGH)
                .count();

        return DashboardStatsDto.builder()
                .totalRequests(totalRequests)
                .pendingRequests(pendingRequests)
                .activeRequests(activeRequests)
                .resolvedRequests(resolvedRequests)
                .totalVictims(totalVictims)
                .totalRescueTeams(totalTeams)
                .totalDepartments(totalDepartments)
                .availableTeams(availableTeams)
                .busyTeams(busyTeams)
                .requestsByStatus(requestsByStatus)
                .requestsByType(requestsByType)
                .requestsByPriority(requestsByPriority)
                .requestsByDepartment(requestsByDepartment)
                .requestsLast24Hours(requestsLast24Hours)
                .requestsLast7Days(requestsLast7Days)
                .averageResponseTime(averageResponseTime)
                .resolutionRate(resolutionRate)
                .criticalRequests(criticalRequests)
                .highPriorityRequests(highPriorityRequests)
                .build();
    }

    /**
     * Get victim-specific dashboard stats
     */
    @Transactional(readOnly = true)
    public DashboardStatsDto getVictimDashboardStats(String username) {
        log.info("Generating victim dashboard statistics for: {}", username);

        List<EmergencyRequest> userRequests = requestRepository.findByCreatedByOrderByCreatedAtDesc(username);

        long totalRequests = userRequests.size();
        long pendingRequests = userRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.PENDING)
                .count();
        long activeRequests = userRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.ASSIGNED ||
                           r.getStatus() == EmergencyRequest.RequestStatus.EN_ROUTE ||
                           r.getStatus() == EmergencyRequest.RequestStatus.ON_SCENE)
                .count();
        long resolvedRequests = userRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.RESOLVED)
                .count();

        Map<String, Long> requestsByStatus = userRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatus().toString(),
                        Collectors.counting()
                ));

        Map<String, Long> requestsByType = userRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getEmergencyType().toString(),
                        Collectors.counting()
                ));

        return DashboardStatsDto.builder()
                .totalRequests(totalRequests)
                .pendingRequests(pendingRequests)
                .activeRequests(activeRequests)
                .resolvedRequests(resolvedRequests)
                .requestsByStatus(requestsByStatus)
                .requestsByType(requestsByType)
                .build();
    }

    /**
     * Get victim-specific dashboard data
     */
    @Transactional(readOnly = true)
    public VictimDashboardDto getVictimDashboard(String username) {
        log.info("Generating victim dashboard for: {}", username);

        List<EmergencyRequest> userRequests = requestRepository.findByCreatedByOrderByCreatedAtDesc(username);

        long totalRequests = userRequests.size();
        long pendingRequests = userRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.PENDING)
                .count();
        long resolvedRequests = userRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.RESOLVED)
                .count();

        List<EmergencyRequestResponseDto> recentRequests = userRequests.stream()
                .limit(10)
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        return VictimDashboardDto.builder()
                .totalRequests(totalRequests)
                .pendingRequests(pendingRequests)
                .resolvedRequests(resolvedRequests)
                .recentRequests(recentRequests)
                .build();
    }

    /**
     * Get department-specific dashboard data
     */
    @Transactional(readOnly = true)
    public DepartmentDashboardDto getDepartmentDashboard(String username) {
        log.info("Generating department dashboard for: {}", username);

        // Get user and their department
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Department department = user.getDepartment();
        if (department == null) {
            throw new ResourceNotFoundException("User is not assigned to any department");
        }

        // Get all teams in the department
        List<RescueTeam> departmentTeams = teamRepository.findByDepartment(department);
        
        // Get all requests assigned to teams in this department
        List<EmergencyRequest> departmentRequests = departmentTeams.stream()
                .flatMap(team -> requestRepository.findByAssignedTeam(team).stream())
                .collect(Collectors.toList());

        long assignedRequests = departmentRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.ASSIGNED ||
                           r.getStatus() == EmergencyRequest.RequestStatus.EN_ROUTE ||
                           r.getStatus() == EmergencyRequest.RequestStatus.ON_SCENE)
                .count();

        long completedRequests = departmentRequests.stream()
                .filter(r -> r.getStatus() == EmergencyRequest.RequestStatus.RESOLVED)
                .count();

        long pendingAssignments = requestRepository.findByStatus(EmergencyRequest.RequestStatus.PENDING).size();

        // Calculate team utilization (percentage of teams that are busy)
        long busyTeams = departmentTeams.stream()
                .filter(team -> team.getStatus() == RescueTeam.TeamStatus.ASSIGNED ||
                              team.getStatus() == RescueTeam.TeamStatus.EN_ROUTE ||
                              team.getStatus() == RescueTeam.TeamStatus.ON_SCENE)
                .count();
        
        double teamUtilization = departmentTeams.isEmpty() ? 0.0 
                : (busyTeams * 100.0 / departmentTeams.size());

        // Get recent requests for this department
        List<EmergencyRequestResponseDto> requests = departmentRequests.stream()
                .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()))
                .limit(20)
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());

        return DepartmentDashboardDto.builder()
                .assignedRequests(assignedRequests)
                .completedRequests(completedRequests)
                .pendingAssignments((long) pendingAssignments)
                .teamUtilization(teamUtilization)
                .requests(requests)
                .build();
    }

    /**
     * Convert EmergencyRequest entity to response DTO
     */
    private EmergencyRequestResponseDto convertToResponseDto(EmergencyRequest request) {
        return EmergencyRequestResponseDto.builder()
                .id(request.getId())
                .victimName(request.getVictimName())
                .victimPhone(request.getVictimPhone())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .emergencyType(request.getEmergencyType() != null ? request.getEmergencyType().toString() : null)
                .priority(request.getPriority() != null ? request.getPriority().toString() : null)
                .status(request.getStatus() != null ? request.getStatus().toString() : null)
                .description(request.getDescription())
                .assignedTeamId(request.getAssignedTeam() != null ? request.getAssignedTeam().getId() : null)
                .assignedTeamName(request.getAssignedTeam() != null ? request.getAssignedTeam().getName() : null)
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .assignedAt(request.getAssignedAt())
                .respondedAt(request.getRespondedAt())
                .completedAt(request.getCompletedAt())
                .resolutionNotes(request.getResolutionNotes())
                .build();
    }
}

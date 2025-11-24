package com.disaster.service;

import com.disaster.dto.EmergencyRequestDto;
import com.disaster.entity.EmergencyRequest;
import com.disaster.entity.RescueTeam;
import com.disaster.entity.User;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.EmergencyRequestRepository;
import com.disaster.repository.RescueTeamRepository;
import com.disaster.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Service for managing emergency requests with intelligent team assignment
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyRequestService {

    private final EmergencyRequestRepository requestRepository;
    private final RescueTeamRepository teamRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    /**
     * Create new emergency request with automatic team assignment
     */
    @Transactional
    @CacheEvict(value = "availableTeams", allEntries = true)
    public EmergencyRequest createRequest(EmergencyRequestDto dto) {
        log.info("Creating emergency request for victim: {}", dto.getVictimName());

        // Create victim user account with username = victimName and password = location
        User victimUser = createVictimUser(dto);

        // Build emergency request
        EmergencyRequest request = EmergencyRequest.builder()
                .victimName(dto.getVictimName())
                .victimPhone(dto.getVictimPhone())
                .location(dto.getLocation())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .emergencyType(RescueTeam.EmergencyType.valueOf(dto.getEmergencyType()))
                .priority(dto.getPriority() != null ? 
                    EmergencyRequest.RequestPriority.valueOf(dto.getPriority()) : 
                    EmergencyRequest.RequestPriority.MEDIUM)
                .status(EmergencyRequest.RequestStatus.PENDING)
                .description(dto.getDescription())
                .createdBy(victimUser.getUsername())
                .build();

        // Save request first
        EmergencyRequest savedRequest = requestRepository.save(request);

        // Try to auto-assign to available team
        tryAutoAssignTeam(savedRequest);
        
        // Send real-time notification
        notificationService.notifyNewEmergencyRequest(savedRequest);

        log.info("Emergency request created with ID: {} for user: {}", savedRequest.getId(), victimUser.getUsername());
        return savedRequest;
    }

    /**
     * Create victim user account from emergency request
     */
    private User createVictimUser(EmergencyRequestDto dto) {
        String username = dto.getVictimName().replaceAll("\\s+", ""); // Remove spaces
        String email = username.toLowerCase() + "@victim.disaster"; // Auto-generated email
        
        // Check if user already exists
        if (userRepository.findByUsername(username).isPresent()) {
            log.info("Victim user already exists: {}", username);
            return userRepository.findByUsername(username).get();
        }

        // Encode password (location) with BCrypt
        String encodedPassword = passwordEncoder.encode(dto.getLocation());

        User victimUser = User.builder()
                .username(username)
                .email(email)
                .password(encodedPassword) // BCrypt hashed password
                .fullName(dto.getVictimName())
                .phoneNumber(dto.getVictimPhone())
                .role(User.UserRole.ROLE_VICTIM)
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User savedUser = userRepository.save(victimUser);
        log.info("Created victim user: {} with location-based password", username);
        return savedUser;
    }

    /**
     * Automatically assign request to available rescue team based on capabilities
     */
    @Transactional(noRollbackFor = Exception.class)
    public void tryAutoAssignTeam(EmergencyRequest request) {
        try {
            // Find available teams with matching capability
            List<RescueTeam> availableTeams = teamRepository
                    .findAvailableTeamsByCapabilityOrderBySize(request.getEmergencyType());

            if (!availableTeams.isEmpty()) {
                // Assign to largest available team (most resources)
                RescueTeam selectedTeam = availableTeams.get(0);
                assignTeamToRequest(request.getId(), selectedTeam.getId());
                log.info("Auto-assigned request {} to team {}", request.getId(), selectedTeam.getName());
            } else {
                log.warn("No available teams found for request {} with type {}", 
                    request.getId(), request.getEmergencyType());
            }
        } catch (Exception e) {
            // Don't fail request creation if auto-assignment fails
            log.error("Failed to auto-assign team for request {}: {}", request.getId(), e.getMessage());
        }
    }

    /**
     * Manually assign rescue team to request
     */
    @Transactional
    @CacheEvict(value = {"availableTeams", "requestDetails"}, allEntries = true)
    public EmergencyRequest assignTeamToRequest(Long requestId, Long teamId) {
        log.info("Assigning team {} to request {}", teamId, requestId);

        EmergencyRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        RescueTeam team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + teamId));

        // Validate team has required capability
        if (!team.getCapabilities().contains(request.getEmergencyType())) {
            throw new IllegalArgumentException(
                "Team does not have capability for " + request.getEmergencyType());
        }

        // Update request
        request.setAssignedTeam(team);
        request.setStatus(EmergencyRequest.RequestStatus.ASSIGNED);
        request.setAssignedAt(Instant.now());

        // Update team
        team.setStatus(RescueTeam.TeamStatus.ASSIGNED);
        team.setCurrentRequest(request);

        // Save team first, then request
        RescueTeam savedTeam = teamRepository.save(team);
        EmergencyRequest savedRequest = requestRepository.save(request);
        
        // Ensure both sides are synchronized
        savedRequest.setAssignedTeam(savedTeam);
        
        // Send real-time notification
        notificationService.notifyTeamAssignment(savedRequest);
        
        return savedRequest;
    }

    /**
     * Update request status
     */
    @Transactional
    @CacheEvict(value = "requestDetails", key = "#requestId")
    public EmergencyRequest updateStatus(Long requestId, String newStatus) {
        log.info("Updating request {} status to {}", requestId, newStatus);

        EmergencyRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        EmergencyRequest.RequestStatus status = EmergencyRequest.RequestStatus.valueOf(newStatus);
        request.setStatus(status);

        // Track timestamps
        switch (status) {
            case PENDING:
            case ASSIGNED:
                // No additional actions needed
                break;
            case EN_ROUTE:
                request.setRespondedAt(Instant.now());
                if (request.getAssignedTeam() != null) {
                    request.getAssignedTeam().setStatus(RescueTeam.TeamStatus.EN_ROUTE);
                }
                break;
            case ON_SCENE:
                if (request.getAssignedTeam() != null) {
                    request.getAssignedTeam().setStatus(RescueTeam.TeamStatus.ON_SCENE);
                }
                break;
            case RESOLVED:
                request.setCompletedAt(Instant.now());
                if (request.getAssignedTeam() != null) {
                    RescueTeam team = request.getAssignedTeam();
                    team.setStatus(RescueTeam.TeamStatus.AVAILABLE);
                    team.setCurrentRequest(null);
                    teamRepository.save(team);
                }
                break;
            case CANCELLED:
                if (request.getAssignedTeam() != null) {
                    RescueTeam team = request.getAssignedTeam();
                    team.setStatus(RescueTeam.TeamStatus.AVAILABLE);
                    team.setCurrentRequest(null);
                    teamRepository.save(team);
                }
                break;
        }

        EmergencyRequest savedRequest = requestRepository.save(request);
        
        // Send real-time notification for status update
        notificationService.notifyStatusUpdate(savedRequest);

        return savedRequest;
    }

    /**
     * Get request by ID
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "requestDetails", key = "#id")
    public EmergencyRequest getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + id));
    }

    /**
     * Get all requests (paginated)
     */
    @Transactional(readOnly = true)
    public Page<EmergencyRequest> getAllRequests(Pageable pageable) {
        return requestRepository.findAll(pageable);
    }

    /**
     * Get requests by status
     */
    @Transactional(readOnly = true)
    public Page<EmergencyRequest> getByStatus(String status, Pageable pageable) {
        EmergencyRequest.RequestStatus requestStatus = EmergencyRequest.RequestStatus.valueOf(status);
        return requestRepository.findByStatus(requestStatus, pageable);
    }

    /**
     * Get active (unresolved) requests
     */
    @Transactional(readOnly = true)
    public Page<EmergencyRequest> getActiveRequests(Pageable pageable) {
        List<EmergencyRequest.RequestStatus> activeStatuses = List.of(
            EmergencyRequest.RequestStatus.PENDING,
            EmergencyRequest.RequestStatus.ASSIGNED,
            EmergencyRequest.RequestStatus.EN_ROUTE,
            EmergencyRequest.RequestStatus.ON_SCENE
        );
        return requestRepository.findByStatusIn(activeStatuses, pageable);
    }

    /**
     * Get requests assigned to specific team
     */
    @Transactional(readOnly = true)
    public Page<EmergencyRequest> getByTeamId(Long teamId, Pageable pageable) {
        return requestRepository.findByAssignedTeamId(teamId, pageable);
    }

    /**
     * Add resolution notes
     */
    @Transactional
    public EmergencyRequest addResolutionNotes(Long requestId, String notes) {
        EmergencyRequest request = getById(requestId);
        request.setResolutionNotes(notes);
        return requestRepository.save(request);
    }

    /**
     * Get count by status
     */
    @Transactional(readOnly = true)
    public long countByStatus(String status) {
        EmergencyRequest.RequestStatus requestStatus = EmergencyRequest.RequestStatus.valueOf(status);
        return requestRepository.countByStatus(requestStatus);
    }
}

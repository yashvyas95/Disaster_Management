package com.disaster.service;

import com.disaster.dto.EmergencyRequestDto;
import com.disaster.entity.EmergencyRequest;
import com.disaster.entity.RescueTeam;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.EmergencyRequestRepository;
import com.disaster.repository.RescueTeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for EmergencyRequestService
 */
@ExtendWith(MockitoExtension.class)
class EmergencyRequestServiceTest {

    @Mock
    private EmergencyRequestRepository requestRepository;

    @Mock
    private RescueTeamRepository teamRepository;

    @InjectMocks
    private EmergencyRequestService requestService;

    private EmergencyRequestDto requestDto;
    private EmergencyRequest testRequest;
    private RescueTeam testTeam;

    @BeforeEach
    void setUp() {
        requestDto = new EmergencyRequestDto();
        requestDto.setVictimName("John Doe");
        requestDto.setVictimPhone("123-456-7890");
        requestDto.setLocation("123 Main St");
        requestDto.setLatitude(40.7128);
        requestDto.setLongitude(-74.0060);
        requestDto.setEmergencyType("FIRE");
        requestDto.setPriority("HIGH");
        requestDto.setDescription("House fire");

        testRequest = EmergencyRequest.builder()
                .id(1L)
                .victimName("John Doe")
                .victimPhone("123-456-7890")
                .location("123 Main St")
                .latitude(40.7128)
                .longitude(-74.0060)
                .emergencyType(RescueTeam.EmergencyType.FIRE)
                .priority(EmergencyRequest.RequestPriority.HIGH)
                .status(EmergencyRequest.RequestStatus.PENDING)
                .description("House fire")
                .build();

        testTeam = RescueTeam.builder()
                .id(1L)
                .name("Fire Team Alpha")
                .status(RescueTeam.TeamStatus.AVAILABLE)
                .memberCount(5)
                .build();
    }

    @Test
    void createRequest_Success() {
        // Arrange
        when(requestRepository.save(any(EmergencyRequest.class))).thenReturn(testRequest);
        when(teamRepository.findAvailableTeamsByCapabilityOrderBySize(any()))
                .thenReturn(Arrays.asList(testTeam));

        // Act
        EmergencyRequest created = requestService.createRequest(requestDto);

        // Assert
        assertNotNull(created);
        assertEquals("John Doe", created.getVictimName());
        assertEquals(EmergencyRequest.RequestStatus.PENDING, created.getStatus());
        verify(requestRepository, atLeastOnce()).save(any(EmergencyRequest.class));
    }

    @Test
    void assignTeamToRequest_Success() {
        // Arrange
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
        when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));
        testTeam.getCapabilities().add(RescueTeam.EmergencyType.FIRE);
        when(requestRepository.save(any(EmergencyRequest.class))).thenReturn(testRequest);
        when(teamRepository.save(any(RescueTeam.class))).thenReturn(testTeam);

        // Act
        EmergencyRequest updated = requestService.assignTeamToRequest(1L, 1L);

        // Assert
        assertNotNull(updated);
        verify(requestRepository).findById(1L);
        verify(teamRepository).findById(1L);
        verify(teamRepository).save(any(RescueTeam.class));
        verify(requestRepository).save(any(EmergencyRequest.class));
    }

    @Test
    void assignTeamToRequest_RequestNotFound_ThrowsException() {
        // Arrange
        when(requestRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
                () -> requestService.assignTeamToRequest(999L, 1L));
    }

    @Test
    void assignTeamToRequest_TeamNotFound_ThrowsException() {
        // Arrange
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
        when(teamRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
                () -> requestService.assignTeamToRequest(1L, 999L));
    }

    @Test
    void assignTeamToRequest_TeamLacksCapability_ThrowsException() {
        // Arrange
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
        when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));
        // Team has no FIRE capability

        // Act & Assert
        assertThrows(IllegalArgumentException.class, 
                () -> requestService.assignTeamToRequest(1L, 1L));
    }

    @Test
    void updateStatus_ToEnRoute_Success() {
        // Arrange
        testRequest.setAssignedTeam(testTeam);
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
        when(requestRepository.save(any(EmergencyRequest.class))).thenReturn(testRequest);

        // Act
        EmergencyRequest updated = requestService.updateStatus(1L, "EN_ROUTE");

        // Assert
        assertNotNull(updated);
        verify(requestRepository).save(any(EmergencyRequest.class));
    }

    @Test
    void updateStatus_ToResolved_ReleasesTeam() {
        // Arrange
        testRequest.setAssignedTeam(testTeam);
        testRequest.setStatus(EmergencyRequest.RequestStatus.ON_SCENE);
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
        when(requestRepository.save(any(EmergencyRequest.class))).thenReturn(testRequest);
        when(teamRepository.save(any(RescueTeam.class))).thenReturn(testTeam);

        // Act
        EmergencyRequest updated = requestService.updateStatus(1L, "RESOLVED");

        // Assert
        assertNotNull(updated);
        verify(teamRepository).save(any(RescueTeam.class));
    }

    @Test
    void getById_Success() {
        // Arrange
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));

        // Act
        EmergencyRequest found = requestService.getById(1L);

        // Assert
        assertNotNull(found);
        assertEquals(1L, found.getId());
        verify(requestRepository).findById(1L);
    }

    @Test
    void getById_NotFound_ThrowsException() {
        // Arrange
        when(requestRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> requestService.getById(999L));
    }

    @Test
    void getAllRequests_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<EmergencyRequest> page = new PageImpl<>(Arrays.asList(testRequest));
        when(requestRepository.findAll(pageable)).thenReturn(page);

        // Act
        Page<EmergencyRequest> result = requestService.getAllRequests(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(requestRepository).findAll(pageable);
    }

    @Test
    void getByStatus_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<EmergencyRequest> page = new PageImpl<>(Arrays.asList(testRequest));
        when(requestRepository.findByStatus(EmergencyRequest.RequestStatus.PENDING, pageable))
                .thenReturn(page);

        // Act
        Page<EmergencyRequest> result = requestService.getByStatus("PENDING", pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void addResolutionNotes_Success() {
        // Arrange
        when(requestRepository.findById(1L)).thenReturn(Optional.of(testRequest));
        when(requestRepository.save(any(EmergencyRequest.class))).thenReturn(testRequest);

        // Act
        EmergencyRequest updated = requestService.addResolutionNotes(1L, "Fire extinguished successfully");

        // Assert
        assertNotNull(updated);
        verify(requestRepository).save(any(EmergencyRequest.class));
    }

    @Test
    void countByStatus_Success() {
        // Arrange
        when(requestRepository.countByStatus(EmergencyRequest.RequestStatus.PENDING))
                .thenReturn(5L);

        // Act
        long count = requestService.countByStatus("PENDING");

        // Assert
        assertEquals(5L, count);
        verify(requestRepository).countByStatus(EmergencyRequest.RequestStatus.PENDING);
    }
}

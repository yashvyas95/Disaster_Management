package com.disaster.service;

import com.disaster.entity.RescueTeam;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.DepartmentRepository;
import com.disaster.repository.RescueTeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Service for managing rescue teams
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RescueTeamService {

    private final RescueTeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;

    /**
     * Get team by ID
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "teamDetails", key = "#id")
    public RescueTeam getById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + id));
    }

    /**
     * Get all teams
     */
    @Transactional(readOnly = true)
    public List<RescueTeam> getAllTeams() {
        return teamRepository.findAll();
    }

    /**
     * Get teams by status
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "teamsByStatus", key = "#status")
    public List<RescueTeam> getByStatus(String status) {
        RescueTeam.TeamStatus teamStatus = RescueTeam.TeamStatus.valueOf(status);
        return teamRepository.findByStatus(teamStatus);
    }

    /**
     * Get available teams
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "availableTeams")
    public List<RescueTeam> getAvailableTeams() {
        return teamRepository.findByStatus(RescueTeam.TeamStatus.AVAILABLE);
    }

    /**
     * Get available teams by capability
     */
    @Transactional(readOnly = true)
    public List<RescueTeam> getAvailableByCapability(String capability) {
        RescueTeam.EmergencyType emergencyType = RescueTeam.EmergencyType.valueOf(capability);
        return teamRepository.findAvailableByCapability(emergencyType);
    }

    /**
     * Get teams by department
     */
    @Transactional(readOnly = true)
    public List<RescueTeam> getByDepartmentId(Long departmentId) {
        return teamRepository.findByDepartmentId(departmentId);
    }

    /**
     * Create new rescue team
     */
    @Transactional
    @CacheEvict(value = {"availableTeams", "teamsByStatus"}, allEntries = true)
    public RescueTeam createTeam(RescueTeam team) {
        log.info("Creating rescue team: {}", team.getName());

        // Validate department exists
        if (team.getDepartment() != null && team.getDepartment().getId() != null) {
            departmentRepository.findById(team.getDepartment().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found: " + team.getDepartment().getId()));
        }

        return teamRepository.save(team);
    }

    /**
     * Update team status
     */
    @Transactional
    @CacheEvict(value = {"availableTeams", "teamsByStatus", "teamDetails"}, allEntries = true)
    public RescueTeam updateStatus(Long teamId, String newStatus) {
        log.info("Updating team {} status to {}", teamId, newStatus);

        RescueTeam team = getById(teamId);
        RescueTeam.TeamStatus status = RescueTeam.TeamStatus.valueOf(newStatus);
        team.setStatus(status);

        return teamRepository.save(team);
    }

    /**
     * Update team location
     */
    @Transactional
    @CacheEvict(value = "teamDetails", key = "#teamId")
    public RescueTeam updateLocation(Long teamId, String location) {
        RescueTeam team = getById(teamId);
        team.setCurrentLocation(location);
        return teamRepository.save(team);
    }

    /**
     * Update team capabilities
     */
    @Transactional
    @CacheEvict(value = {"availableTeams", "teamDetails"}, allEntries = true)
    public RescueTeam updateCapabilities(Long teamId, Set<RescueTeam.EmergencyType> capabilities) {
        RescueTeam team = getById(teamId);
        team.setCapabilities(capabilities);
        return teamRepository.save(team);
    }

    /**
     * Get team count by status
     */
    @Transactional(readOnly = true)
    public long countByStatus(String status) {
        RescueTeam.TeamStatus teamStatus = RescueTeam.TeamStatus.valueOf(status);
        return teamRepository.countByStatus(teamStatus);
    }

    /**
     * Delete team
     */
    @Transactional
    @CacheEvict(value = {"availableTeams", "teamsByStatus", "teamDetails"}, allEntries = true)
    public void deleteTeam(Long teamId) {
        RescueTeam team = getById(teamId);
        
        if (team.getCurrentRequest() != null) {
            throw new IllegalStateException("Cannot delete team with active assignment");
        }
        
        teamRepository.delete(team);
        log.info("Deleted team: {}", teamId);
    }
}

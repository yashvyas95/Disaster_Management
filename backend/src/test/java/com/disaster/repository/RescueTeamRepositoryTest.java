package com.disaster.repository;

import com.disaster.entity.Department;
import com.disaster.entity.RescueTeam;
import com.disaster.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for RescueTeamRepository using TestContainers
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RescueTeamRepositoryTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RescueTeamRepository teamRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private Department department;
    private RescueTeam team1;
    private RescueTeam team2;

    @BeforeEach
    void setUp() {
        department = Department.builder()
                .name("Fire Department")
                .description("Fire and rescue services")
                .contactNumber("911")
                .active(true)
                .build();
        department = departmentRepository.save(department);

        Set<RescueTeam.EmergencyType> capabilities1 = new HashSet<>();
        capabilities1.add(RescueTeam.EmergencyType.FIRE);
        capabilities1.add(RescueTeam.EmergencyType.MEDICAL);

        team1 = RescueTeam.builder()
                .name("Fire Team Alpha")
                .department(department)
                .status(RescueTeam.TeamStatus.AVAILABLE)
                .memberCount(5)
                .capabilities(capabilities1)
                .currentLocation("Station 1")
                .build();
        team1 = teamRepository.save(team1);

        Set<RescueTeam.EmergencyType> capabilities2 = new HashSet<>();
        capabilities2.add(RescueTeam.EmergencyType.CRIME);

        team2 = RescueTeam.builder()
                .name("Police Unit Bravo")
                .department(department)
                .status(RescueTeam.TeamStatus.OFF_DUTY)
                .memberCount(3)
                .capabilities(capabilities2)
                .currentLocation("Station 2")
                .build();
        team2 = teamRepository.save(team2);

        entityManager.flush();
    }

    @Test
    void findByStatus_ReturnsCorrectTeams() {
        // Act
        List<RescueTeam> availableTeams = teamRepository.findByStatus(RescueTeam.TeamStatus.AVAILABLE);

        // Assert
        assertEquals(1, availableTeams.size());
        assertEquals("Fire Team Alpha", availableTeams.get(0).getName());
    }

    @Test
    void findByDepartmentId_ReturnsCorrectTeams() {
        // Act
        List<RescueTeam> teams = teamRepository.findByDepartmentId(department.getId());

        // Assert
        assertEquals(2, teams.size());
    }

    @Test
    void findAvailableByCapability_ReturnsCorrectTeams() {
        // Act
        List<RescueTeam> fireTeams = teamRepository.findAvailableByCapability(RescueTeam.EmergencyType.FIRE);

        // Assert
        assertEquals(1, fireTeams.size());
        assertEquals("Fire Team Alpha", fireTeams.get(0).getName());
    }

    @Test
    void findAvailableTeamsByCapabilityOrderBySize_ReturnsOrderedTeams() {
        // Arrange - Create another available fire team with fewer members
        Set<RescueTeam.EmergencyType> capabilities = new HashSet<>();
        capabilities.add(RescueTeam.EmergencyType.FIRE);
        
        RescueTeam smallTeam = RescueTeam.builder()
                .name("Fire Team Charlie")
                .department(department)
                .status(RescueTeam.TeamStatus.AVAILABLE)
                .memberCount(2)
                .capabilities(capabilities)
                .build();
        teamRepository.save(smallTeam);
        entityManager.flush();

        // Act
        List<RescueTeam> teams = teamRepository.findAvailableTeamsByCapabilityOrderBySize(
                RescueTeam.EmergencyType.FIRE);

        // Assert
        assertEquals(2, teams.size());
        assertEquals("Fire Team Alpha", teams.get(0).getName()); // Largest first
        assertEquals(5, teams.get(0).getMemberCount());
    }

    @Test
    void countByStatus_ReturnsCorrectCount() {
        // Act
        long count = teamRepository.countByStatus(RescueTeam.TeamStatus.AVAILABLE);

        // Assert
        assertEquals(1, count);
    }
}

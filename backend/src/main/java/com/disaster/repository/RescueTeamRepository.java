package com.disaster.repository;

import com.disaster.entity.Department;
import com.disaster.entity.RescueTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RescueTeam entity with optimized queries
 */
@Repository
public interface RescueTeamRepository extends JpaRepository<RescueTeam, Long> {

    @Query("SELECT t FROM RescueTeam t WHERE t.status = :status")
    List<RescueTeam> findByStatus(@Param("status") RescueTeam.TeamStatus status);

    @Query("SELECT t FROM RescueTeam t WHERE t.department.id = :departmentId")
    List<RescueTeam> findByDepartmentId(@Param("departmentId") Long departmentId);

    @Query("SELECT t FROM RescueTeam t WHERE t.department = :department")
    List<RescueTeam> findByDepartment(@Param("department") Department department);

    @Query("SELECT t FROM RescueTeam t WHERE :capability MEMBER OF t.capabilities AND t.status = 'AVAILABLE'")
    List<RescueTeam> findAvailableByCapability(
            @Param("capability") RescueTeam.EmergencyType capability
    );

    @Query("SELECT t FROM RescueTeam t WHERE t.status = 'AVAILABLE' AND :capability MEMBER OF t.capabilities ORDER BY t.memberCount DESC")
    List<RescueTeam> findAvailableTeamsByCapabilityOrderBySize(
            @Param("capability") RescueTeam.EmergencyType capability
    );

    @Query("SELECT COUNT(t) FROM RescueTeam t WHERE t.status = :status")
    long countByStatus(@Param("status") RescueTeam.TeamStatus status);

    @Query("SELECT t FROM RescueTeam t WHERE t.user.id = :userId")
    RescueTeam findByUserId(@Param("userId") Long userId);
}

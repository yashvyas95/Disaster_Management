package com.disaster.repository;

import com.disaster.entity.EmergencyRequest;
import com.disaster.entity.RescueTeam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repository for EmergencyRequest entity with optimized queries
 */
@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {

    @Query("SELECT r FROM EmergencyRequest r WHERE r.status = :status")
    Page<EmergencyRequest> findByStatus(
            @Param("status") EmergencyRequest.RequestStatus status,
            Pageable pageable
    );

    @Query("SELECT r FROM EmergencyRequest r WHERE r.status = :status")
    List<EmergencyRequest> findByStatus(@Param("status") EmergencyRequest.RequestStatus status);

    @Query("SELECT r FROM EmergencyRequest r WHERE r.assignedTeam = :team")
    List<EmergencyRequest> findByAssignedTeam(@Param("team") RescueTeam team);

    @Query("SELECT r FROM EmergencyRequest r WHERE r.assignedTeam.id = :teamId ORDER BY r.createdAt DESC")
    Page<EmergencyRequest> findByAssignedTeamId(
            @Param("teamId") Long teamId,
            Pageable pageable
    );

    @Query("SELECT r FROM EmergencyRequest r WHERE r.emergencyType = :type AND r.status = :status")
    List<EmergencyRequest> findByEmergencyTypeAndStatus(
            @Param("type") RescueTeam.EmergencyType type,
            @Param("status") EmergencyRequest.RequestStatus status
    );

    @Query("SELECT r FROM EmergencyRequest r WHERE r.status IN (:statuses)")
    Page<EmergencyRequest> findByStatusIn(
            @Param("statuses") List<EmergencyRequest.RequestStatus> statuses,
            Pageable pageable
    );

    @Query("SELECT r FROM EmergencyRequest r WHERE r.priority = :priority AND r.status != 'RESOLVED' ORDER BY r.createdAt ASC")
    List<EmergencyRequest> findUnresolvedByPriority(
            @Param("priority") EmergencyRequest.RequestPriority priority
    );

    @Query("SELECT r FROM EmergencyRequest r WHERE r.location LIKE %:location% AND r.status = 'PENDING'")
    List<EmergencyRequest> findPendingByLocationContaining(@Param("location") String location);

    @Query("SELECT COUNT(r) FROM EmergencyRequest r WHERE r.status = :status")
    long countByStatus(@Param("status") EmergencyRequest.RequestStatus status);

    @Query("SELECT r FROM EmergencyRequest r WHERE r.createdAt BETWEEN :start AND :end")
    List<EmergencyRequest> findByCreatedAtBetween(
            @Param("start") Instant start,
            @Param("end") Instant end
    );

    @Query("SELECT r FROM EmergencyRequest r WHERE r.createdBy = :username ORDER BY r.createdAt DESC")
    List<EmergencyRequest> findByCreatedByOrderByCreatedAtDesc(@Param("username") String username);
}

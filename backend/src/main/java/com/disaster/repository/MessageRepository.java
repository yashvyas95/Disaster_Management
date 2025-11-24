package com.disaster.repository;

import com.disaster.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Message entity with pagination support
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.request.id = :requestId ORDER BY m.createdAt ASC")
    Page<Message> findByRequestId(@Param("requestId") Long requestId, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.request.id = :requestId ORDER BY m.createdAt DESC")
    List<Message> findByRequestIdOrderByCreatedAtDesc(@Param("requestId") Long requestId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.request.id = :requestId AND m.isRead = false")
    long countUnreadByRequestId(@Param("requestId") Long requestId);

    @Query("SELECT m FROM Message m WHERE m.request.id = :requestId AND m.senderType = :senderType ORDER BY m.createdAt ASC")
    List<Message> findByRequestIdAndSenderType(
            @Param("requestId") Long requestId,
            @Param("senderType") Message.SenderType senderType
    );
}

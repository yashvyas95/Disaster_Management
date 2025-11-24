package com.disaster.repository;

import com.disaster.entity.DirectMessage;
import com.disaster.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for DirectMessage entity
 */
@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {

    /**
     * Find all messages between two users
     */
    @Query("SELECT m FROM DirectMessage m WHERE " +
           "(m.sender = :user1 AND m.recipient = :user2) OR " +
           "(m.sender = :user2 AND m.recipient = :user1) " +
           "ORDER BY m.createdAt ASC")
    List<DirectMessage> findConversation(@Param("user1") User user1, @Param("user2") User user2);

    /**
     * Find all messages where user is sender or recipient
     */
    @Query("SELECT m FROM DirectMessage m WHERE m.sender = :user OR m.recipient = :user " +
           "ORDER BY m.createdAt DESC")
    Page<DirectMessage> findByUser(@Param("user") User user, Pageable pageable);

    /**
     * Find unread messages for a user
     */
    @Query("SELECT m FROM DirectMessage m WHERE m.recipient = :user AND m.isRead = false " +
           "ORDER BY m.createdAt DESC")
    List<DirectMessage> findUnreadMessages(@Param("user") User user);

    /**
     * Count unread messages for a user
     */
    @Query("SELECT COUNT(m) FROM DirectMessage m WHERE m.recipient = :user AND m.isRead = false")
    long countUnreadMessages(@Param("user") User user);

    /**
     * Find messages sent by a user
     */
    List<DirectMessage> findBySenderOrderByCreatedAtDesc(User sender);

    /**
     * Find messages received by a user
     */
    List<DirectMessage> findByRecipientOrderByCreatedAtDesc(User recipient);

    /**
     * Find distinct senders who sent messages to a user
     */
    @Query("SELECT DISTINCT m.sender FROM DirectMessage m WHERE m.recipient = :user")
    List<User> findDistinctSendersByRecipient(@Param("user") User user);

    /**
     * Find distinct recipients who received messages from a user
     */
    @Query("SELECT DISTINCT m.recipient FROM DirectMessage m WHERE m.sender = :user")
    List<User> findDistinctRecipientsBySender(@Param("user") User user);
}

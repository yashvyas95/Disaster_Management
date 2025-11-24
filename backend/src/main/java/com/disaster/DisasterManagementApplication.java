package com.disaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Disaster Management System V2 - Main Application
 * 
 * Modern disaster response coordination platform with:
 * - JWT-based authentication & authorization
 * - Real-time WebSocket communication
 * - Redis caching & session management
 * - Comprehensive monitoring & metrics
 * 
 * @author Disaster Management Team
 * @version 2.0.0
 */
@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
public class DisasterManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(DisasterManagementApplication.class, args);
    }
}

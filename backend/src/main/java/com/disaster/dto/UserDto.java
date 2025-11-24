package com.disaster.dto;

import com.disaster.entity.User.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO for user information (excluding sensitive data)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private UserRole role;
    private Long departmentId;
    private String departmentName;
    private Boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;
}

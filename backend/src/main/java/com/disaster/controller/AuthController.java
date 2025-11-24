package com.disaster.controller;

import com.disaster.dto.AuthResponse;
import com.disaster.dto.LoginRequest;
import com.disaster.dto.SignupRequest;
import com.disaster.dto.VictimRegistrationDto;
import com.disaster.entity.User;
import com.disaster.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @Operation(summary = "Register new user", description = "Create a new user account with role-based access")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "409", description = "User already exists"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and receive JWT tokens")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "400", description = "Invalid request format")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Get new access token using refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        String token = refreshToken.replace("Bearer ", "");
        AuthResponse response = authService.refreshToken(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Retrieve authenticated user information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<User> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout current user (invalidate tokens)")
    @ApiResponse(responseCode = "200", description = "Logout successful")
    public ResponseEntity<String> logout() {
        // With JWT, logout is typically handled client-side by removing tokens
        // For enhanced security, implement token blacklisting with Redis
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/getAllEmp")
    @Operation(summary = "Get all employees", description = "Retrieve all users/employees in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<User>> getAllEmployees() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/userByUsername")
    @Operation(summary = "Get user by username", description = "Retrieve user information by username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        User user = authService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register-victim")
    @Operation(
        summary = "Public victim registration",
        description = "Register as a victim/citizen (no authentication required). This is the public signup for people needing emergency assistance."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Victim registered successfully"),
            @ApiResponse(responseCode = "409", description = "Username or email already exists"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<AuthResponse> registerVictim(@Valid @RequestBody VictimRegistrationDto request) {
        AuthResponse response = authService.registerVictim(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/victimLogin")
    @Operation(summary = "Victim login with name and location", description = "Login for victims using full name and location as credentials")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<AuthResponse> victimLogin(
            @RequestParam String fullName,
            @RequestParam String location) {
        AuthResponse response = authService.victimLogin(fullName, location);
        return ResponseEntity.ok(response);
    }
}

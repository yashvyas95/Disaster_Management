package com.disaster.controller;

import com.disaster.dto.AuthResponse;
import com.disaster.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for victim-specific endpoints
 */
@RestController
@RequestMapping("/api/request")
@RequiredArgsConstructor
@Tag(name = "Victim", description = "Victim-specific endpoints")
public class VictimController {

    private final AuthService authService;

    @GetMapping("/victimLogin/")
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

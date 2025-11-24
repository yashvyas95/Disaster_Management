package com.disaster.service;

import com.disaster.dto.AuthResponse;
import com.disaster.dto.LoginRequest;
import com.disaster.dto.SignupRequest;
import com.disaster.dto.VictimRegistrationDto;
import com.disaster.entity.Department;
import com.disaster.entity.User;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.exception.UserAlreadyExistsException;
import com.disaster.repository.DepartmentRepository;
import com.disaster.repository.UserRepository;
import com.disaster.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for user authentication and registration
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    /**
     * TEMPORARY: Control flag for password encryption
     * When false, passwords stored as plain text for development
     * 
     * BUG: BCrypt encoding/matching not working correctly
     * See SecurityConfig.passwordEncoder() for full bug description
     */
    @Value("${security.password-encryption-enabled:false}")
    private boolean passwordEncryptionEnabled;

    /**
     * Register new user
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Attempting to register user: {}", request.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Get department if provided
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + request.getDepartmentId()));
        }

        // Create new user with BCrypt encrypted password
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encodedPassword)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(User.UserRole.valueOf(request.getRole()))
                .department(department)
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        // Generate tokens
        String accessToken = tokenProvider.generateToken(savedUser.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getJwtExpirationMs())
                .username(savedUser.getUsername())
                .role(savedUser.getRole().toString())
                .build();
    }

    /**
     * Authenticate user and generate JWT tokens
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate tokens
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(request.getUsername());

        // Get user details
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + request.getUsername()));

        log.info("User logged in successfully: {}", user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .expiresIn(86400000L) // 24 hours in milliseconds
                .build();
    }

    /**
     * Get currently authenticated user
     */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    /**
     * Refresh JWT access token
     */
    public AuthResponse refreshToken(String refreshToken) {
        // Validate refresh token
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Generate new access token
        String newAccessToken = tokenProvider.generateToken(username);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Keep same refresh token
                .tokenType("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .expiresIn(86400000L)
                .build();
    }

    /**
     * Get all employees/users
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

    /**
     * Get user by username
     */
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    /**
     * Register new victim (public endpoint - no authentication required)
     */
    @Transactional
    public AuthResponse registerVictim(VictimRegistrationDto request) {
        log.info("Attempting to register victim: {}", request.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Create new victim user
        // TEMPORARY: Conditional password encoding based on security.password-encryption-enabled
        // BUG: BCrypt encoding is currently broken, using plain text for development
        String encodedPassword = passwordEncryptionEnabled 
            ? passwordEncoder.encode(request.getPassword()) // BCrypt (when fixed)
            : request.getPassword(); // Plain text (temporary)
        
        User victim = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encodedPassword)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(User.UserRole.ROLE_VICTIM)
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User savedVictim = userRepository.save(victim);
        log.info("Victim registered successfully: {}", savedVictim.getUsername());

        // Generate tokens
        String accessToken = tokenProvider.generateToken(savedVictim.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(savedVictim.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getJwtExpirationMs())
                .username(savedVictim.getUsername())
                .email(savedVictim.getEmail())
                .role(savedVictim.getRole().toString())
                .build();
    }

    /**
     * Victim login using full name and location
     */
    public AuthResponse victimLogin(String fullName, String location) {
        log.info("Victim login attempt for: {}", fullName);
        
        // Username is fullName with spaces removed
        String username = fullName.replaceAll("\\s+", "");
        
        // Find user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        
        // Verify role is VICTIM
        if (!user.getRole().equals(User.UserRole.ROLE_VICTIM)) {
            throw new IllegalArgumentException("Invalid login method for this user type");
        }
        
        // Verify password (location) - supports both BCrypt and plain text for migration
        boolean passwordMatches = passwordEncoder.matches(location, user.getPassword());
        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        // Generate tokens
        String accessToken = tokenProvider.generateToken(user.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());
        
        log.info("Victim login successful: {}", username);
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getJwtExpirationMs())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .build();
    }
}

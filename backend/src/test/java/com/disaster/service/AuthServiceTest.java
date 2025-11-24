package com.disaster.service;

import com.disaster.dto.AuthResponse;
import com.disaster.dto.LoginRequest;
import com.disaster.dto.SignupRequest;
import com.disaster.entity.Department;
import com.disaster.entity.User;
import com.disaster.exception.UserAlreadyExistsException;
import com.disaster.repository.DepartmentRepository;
import com.disaster.repository.UserRepository;
import com.disaster.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private SignupRequest signupRequest;
    private User testUser;
    private Department testDepartment;

    @BeforeEach
    void setUp() {
        testDepartment = Department.builder()
                .id(1L)
                .name("Fire Department")
                .active(true)
                .build();

        signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("Password123!");
        signupRequest.setRole("VICTIM");

        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .role(User.UserRole.ROLE_VICTIM)
                .enabled(true)
                .build();
    }

    @Test
    void signup_Success() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken("testuser")).thenReturn("refreshToken");

        // Act
        AuthResponse response = authService.signup(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());

        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("Password123!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signup_UsernameAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> authService.signup(signupRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void signup_EmailAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> authService.signup(signupRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void signup_WithDepartment_Success() {
        // Arrange
        signupRequest.setDepartmentId(1L);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken("testuser")).thenReturn("refreshToken");

        // Act
        AuthResponse response = authService.signup(signupRequest);

        // Assert
        assertNotNull(response);
        verify(departmentRepository).findById(1L);
    }

    @Test
    void login_Success() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("Password123!");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken("testuser")).thenReturn("refreshToken");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("ROLE_VICTIM", response.getRole());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }

    @Test
    void getCurrentUser_Success() {
        // Arrange
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        User currentUser = authService.getCurrentUser();

        // Assert
        assertNotNull(currentUser);
        assertEquals("testuser", currentUser.getUsername());
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void refreshToken_Success() {
        // Arrange
        String refreshToken = "validRefreshToken";
        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken(refreshToken)).thenReturn("testuser");
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("newAccessToken");

        // Act
        AuthResponse response = authService.refreshToken(refreshToken);

        // Assert
        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals(refreshToken, response.getRefreshToken());
        verify(jwtTokenProvider).validateToken(refreshToken);
    }

    @Test
    void refreshToken_InvalidToken_ThrowsException() {
        // Arrange
        String invalidToken = "invalidToken";
        when(jwtTokenProvider.validateToken(invalidToken)).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> authService.refreshToken(invalidToken));
    }
}

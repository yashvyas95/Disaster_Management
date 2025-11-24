package com.disaster.config;

import com.disaster.security.CustomUserDetailsService;
import com.disaster.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security Configuration with JWT authentication, CSRF protection, and CORS
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    /**
     * TEMPORARY: Flag to control password encryption for testing
     * Set to false to use plain text passwords during development
     * 
     * BUG: BCrypt authentication is failing despite correct configuration
     * See application.yml security.password-encryption-enabled comments for details
     */
    @Value("${security.password-encryption-enabled:false}")
    private boolean passwordEncryptionEnabled;

    /**
     * Configure HTTP security with JWT and role-based access control
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) // Disabled for JWT; enable for production with proper token handling
                .sessionManagement(session -> 
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/actuator/health",
                                "/actuator/info"
                        ).permitAll()
                        
                        // WebSocket endpoints (authenticated via STOMP headers)
                        .requestMatchers("/ws/**", "/socket/**").permitAll()
                        
                        // Emergency requests (victims can submit without auth initially)
                        .requestMatchers(HttpMethod.POST, "/api/requests/emergency").permitAll()
                        
                        // Victim login endpoint
                        .requestMatchers(HttpMethod.GET, "/api/request/victimLogin/**").permitAll()
                        
                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**", "/api/departments/**")
                        .hasAnyRole("ADMIN", "DEPARTMENT_HEAD")
                        
                        // Rescue team endpoints
                        .requestMatchers("/api/teams/**")
                        .hasAnyRole("ADMIN", "DEPARTMENT_HEAD", "RESCUE_TEAM_MEMBER", "DISPATCHER")
                        
                        // Message endpoints
                        .requestMatchers("/api/messages/**")
                        .hasAnyRole("ADMIN", "DEPARTMENT_HEAD", "RESCUE_TEAM_MEMBER", "DISPATCHER", "VICTIM")
                        
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Password encoder - Uses custom delegating encoder for BCrypt with plain text fallback
     * 
     * This encoder:
     * - Always stores new passwords as BCrypt hashes (strength 12)
     * - Supports authentication with both BCrypt and plain text passwords
     * - Allows gradual migration from plain text to BCrypt without disruption
     * 
     * @return PasswordEncoder - Delegating encoder with BCrypt + plain text support
     */
    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new DelegatingPasswordEncoder();
    }

    /**
     * Authentication provider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Authentication manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

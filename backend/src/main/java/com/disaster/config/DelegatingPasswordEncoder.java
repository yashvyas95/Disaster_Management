package com.disaster.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Custom Password Encoder that supports both BCrypt and plain text passwords
 * This allows gradual migration from plain text to BCrypt
 * 
 * - New passwords are always stored as BCrypt
 * - Login attempts are checked against both BCrypt and plain text
 * - When a plain text password is used successfully, it can be upgraded to BCrypt
 */
@Slf4j
public class DelegatingPasswordEncoder implements PasswordEncoder {
    
    private final BCryptPasswordEncoder bcryptEncoder;
    
    public DelegatingPasswordEncoder() {
        this.bcryptEncoder = new BCryptPasswordEncoder(12);
    }
    
    @Override
    public String encode(CharSequence rawPassword) {
        // Always encode new passwords with BCrypt
        String encoded = bcryptEncoder.encode(rawPassword);
        log.debug("Encoding password - BCrypt hash generated");
        return encoded;
    }
    
    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (encodedPassword == null || rawPassword == null) {
            log.warn("Password matching failed: null password or encoded password");
            return false;
        }
        
        log.debug("Matching password - Encoded password starts with: {}", encodedPassword.substring(0, Math.min(10, encodedPassword.length())));
        
        // If the stored password is a BCrypt hash, use BCrypt matching
        if (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$") || encodedPassword.startsWith("$2y$")) {
            boolean matches = bcryptEncoder.matches(rawPassword, encodedPassword);
            log.debug("BCrypt password match result: {}", matches);
            return matches;
        }
        
        // Otherwise, check if it matches plain text (for backward compatibility)
        // This allows existing users to login with their plain text passwords
        boolean matches = encodedPassword.equals(rawPassword.toString());
        log.debug("Plain text password match result: {}", matches);
        return matches;
    }
    
    @Override
    public boolean upgradeEncoding(String encodedPassword) {
        // Upgrade plain text passwords to BCrypt
        return !encodedPassword.startsWith("$2a$") && 
               !encodedPassword.startsWith("$2b$") && 
               !encodedPassword.startsWith("$2y$");
    }
}

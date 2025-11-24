import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "Admin@123";
        String hash = encoder.encode(password);
        System.out.println("BCrypt hash for '" + password + "':");
        System.out.println(hash);
        
        // Test matching
        boolean matches = encoder.matches(password, hash);
        System.out.println("\nPassword matches: " + matches);
        
        // Test with existing hash
        String existingHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu";
        boolean existingMatches = encoder.matches(password, existingHash);
        System.out.println("Existing hash matches: " + existingMatches);
    }
}

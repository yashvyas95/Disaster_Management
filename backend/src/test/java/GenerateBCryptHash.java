import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateBCryptHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "Admin@123";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash (strength 12): " + hash);
        
        // Test the hash
        boolean matches = encoder.matches(password, hash);
        System.out.println("Test match: " + matches);
    }
}

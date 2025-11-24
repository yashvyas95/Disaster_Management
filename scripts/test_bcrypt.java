import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class Test {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String hash = "`$2a`$12`$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu";
        boolean matches = encoder.matches("Admin@123", hash);
        System.out.println("Password matches: " + matches);
    }
}

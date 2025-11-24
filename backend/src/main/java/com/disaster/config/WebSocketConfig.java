package com.disaster.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration for real-time chat messaging
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable simple broker for topic (broadcasts) and queue (point-to-point)
        registry.enableSimpleBroker("/topic", "/queue");
        
        // Prefix for messages from client to server
        registry.setApplicationDestinationPrefixes("/app");
        
        // Prefix for user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket endpoint for client connections
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:4200", "http://10.0.0.102:4200", "http://127.0.0.1:4200")
                .withSockJS(); // Fallback for browsers that don't support WebSocket
        
        // Additional endpoint without SockJS for native WebSocket clients
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:4200", "http://10.0.0.102:4200", "http://127.0.0.1:4200");
        
        // Add /socket endpoint as an alias (some clients might be using this)
        registry.addEndpoint("/socket")
                .setAllowedOriginPatterns("http://localhost:4200", "http://10.0.0.102:4200", "http://127.0.0.1:4200")
                .withSockJS();
    }
}

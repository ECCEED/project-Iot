package tn.pi.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Allow requests to /api/* endpoints
                .allowedOrigins("http://localhost:3000") // Allow requests from frontend (React)
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow these methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials (cookies, headers, etc.)
    }
}

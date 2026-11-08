
package com.kumarclasses.kumarclasses.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // CSRF disabled for existing admin JS APIs
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Public website
                .requestMatchers(
                    "/",
                    "/error",
                    "/home.html",
                    "/home.css",
                    "/home.js",
                    "/uploads/**"
                ).permitAll()

                // Public gallery and announcements
                .requestMatchers(
                    "/api/public/gallery",
                    "/api/public/announcements"
                ).permitAll()

                // Public courses API
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/courses/public"
                ).permitAll()

                // Public faculty API
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/faculty/public"
                ).permitAll()

                // Public testimonials API
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/testimonials/public"
                ).permitAll()

                // Public student results API
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/results/public"
                ).permitAll()

                // Public admin login page and assets
                .requestMatchers(
                    "/admin-login.html",
                    "/admin-login.css"
                ).permitAll()

                // Public enquiry submission
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/enquiries"
                ).permitAll()

                // Admin-only APIs
                .requestMatchers("/api/**").hasRole("ADMIN")

                // Other pages require login
                .anyRequest().authenticated()
            )

            // Session-based login
            .formLogin(form -> form
                .loginPage("/admin-login.html")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/index.html", true)
                .failureUrl("/admin-login.html?error")
                .permitAll()
            )

            // Logout
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/home.html?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.password}") String password) {

        UserDetails admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

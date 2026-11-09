
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
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Public website pages and assets
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/home.html",
                    "/home.css",
                    "/home.js",
                    "/style.css",
                    "/script.js",
                    "/favicon.ico",
                    "/error",
                    "/uploads/**"
                ).permitAll()

                // Public APIs
                .requestMatchers(
                    "/api/public/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/courses/public",
                    "/api/faculty/public",
                    "/api/testimonials/public",
                    "/api/results/public"
                ).permitAll()

                // Admin login
                .requestMatchers(
                    "/admin-login.html",
                    "/admin-login.css",
                    "/login"
                ).permitAll()

                // Public enquiry submission
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/enquiries"
                ).permitAll()

                // All other API endpoints require admin
                .requestMatchers("/api/**").hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .formLogin(form -> form
                .loginPage("/admin-login.html")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/index.html", true)
                .failureUrl("/admin-login.html?error")
                .permitAll()
            )

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

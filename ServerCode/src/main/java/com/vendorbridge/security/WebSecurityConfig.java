package com.vendorbridge.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
    @Autowired
    private AuthFilter authFilter;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
            return httpSecurity
                            .csrf(csrf -> csrf.disable())
                            .sessionManagement(
                                            sessionConfig -> sessionConfig
                                                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                            .authorizeHttpRequests(
                                            auth -> auth.requestMatchers("/api/auth/**").permitAll()
                                                            .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                            .anyRequest().permitAll())
                            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class).build();
    }
}

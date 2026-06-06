package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.User;
import com.vendorbridge.util.UserRole;

@Repository
public interface UserDAO extends JpaRepository<User, Long> {
    User findByEmailAndActive(String email, Boolean active);

    List<User> findByActive(Boolean active);
    
    List<User> findByRoleAndActive(UserRole role, Boolean active);
    
    boolean existsByEmail(String email);
}

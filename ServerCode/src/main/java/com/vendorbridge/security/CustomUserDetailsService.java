package com.vendorbridge.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.entity.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	 @Autowired
	 private UserDAO userDAO;

	 @Override
	 public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		 User user = userDAO.findByEmailAndActive(email, Boolean.TRUE);
		 if (user == null) throw new UsernameNotFoundException("User not found with email: " + email);
		 return user;
	 }

}

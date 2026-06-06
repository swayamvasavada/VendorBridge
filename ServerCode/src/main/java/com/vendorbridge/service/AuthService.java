package com.vendorbridge.service;

import java.util.Date;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.dao.VendorDAO;
import com.vendorbridge.dto.LoginDTO;
import com.vendorbridge.dto.SignupDTO;
import com.vendorbridge.entity.User;
import com.vendorbridge.entity.Vendor;
import com.vendorbridge.exception.AuthenticationException;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.util.JwtUtil;
import com.vendorbridge.util.UserRole;

@Service
public class AuthService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private VendorDAO vendorDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EmailService emailService;

    public SignupDTO vendorRegistration(SignupDTO signupDTO) throws Exception {
        System.out.println("Entering into AuthService -> vendorRegistration");
        User user = new User();

        boolean isEmailExist = userDAO.existsByEmail(signupDTO.getEmail());
        System.out.println("isEmailExist: " + isEmailExist);
        if (isEmailExist)
            throw new AuthenticationException("User already exists with given email");

        BeanUtils.copyProperties(signupDTO, user);
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        user.setIsVerified(false);
        user.setRole(UserRole.VENDOR); // Default role for vendor registration
        user.setActive(true);
        user.setCreatedAt(new Date());
        
        Vendor vendor = new Vendor();
        BeanUtils.copyProperties(signupDTO, vendor);
        vendor.setUser(user);
        vendor.setActive(true);
        vendor.setCreatedAt(new Date());

        userDAO.save(user);
        vendor = vendorDAO.save(vendor);
        emailService.sendVerificationMail(signupDTO.getEmail()); // Triggered inside async block

        System.out.println("Exiting from AuthService -> vendorRegistration");
        return signupDTO;
    }

    public void sendVerificationMail(String email) throws Exception {
        emailService.sendVerificationMail(email);
    }

    public LoginDTO login(LoginDTO loginDTO) throws Exception {
        User user = userDAO.findByEmailAndActive(loginDTO.getEmail(), true);
        if (user == null)
            throw new ResourceNotFoundException("User not found with given email");

        if (!user.getIsVerified()) {
            loginDTO.setPassword(null);
            loginDTO.setIsVerified(false);
            return loginDTO;
        }

        if (!user.getIsEnabled())
            throw new AuthenticationException("User is not enabled yet. Please contact administrator.");

        boolean isPasswordMatch = passwordEncoder.matches(loginDTO.getPassword(), user.getPassword());
        if (!isPasswordMatch)
            throw new AuthenticationException("Entered password is incorrect!");

        String token = jwtUtil.generateToken(user.getEmail(), Long.valueOf(24 * 60 * 60 * 1000));
        loginDTO.setPassword(null);
        loginDTO.setName(user.getName());
        loginDTO.setIsVerified(true);
        loginDTO.setToken(token);
        loginDTO.setRole(user.getRole());
        return loginDTO;
    }

    public LoginDTO verifyUser(String token) throws Exception {
        String email = jwtUtil.verifyToken(token);
        User user = userDAO.findByEmailAndActive(email, true);
        if (user == null)
            throw new ResourceNotFoundException("User not found with given email");

        if (!user.getIsVerified()) {
            user.setIsVerified(true);
            userDAO.save(user);
        }

        LoginDTO loginDTO = new LoginDTO();
        String authToken = jwtUtil.generateToken(user.getEmail(), Long.valueOf(24 * 60 * 60 * 1000));
        BeanUtils.copyProperties(user, loginDTO);
        loginDTO.setPassword(null);
        loginDTO.setIsVerified(true);
        loginDTO.setToken(authToken);
        return loginDTO;
    }
    
    public void requestPasswordReset(String email) throws Exception {
		User user = userDAO.findByEmailAndActive(email, true);
		if (user == null)
			throw new ResourceNotFoundException("User not found with given email");

		emailService.sendPasswordResetMail(email); // Triggered inside async block
	}

    public void resetPassword(String token, String newPassword) throws Exception {
        String email = jwtUtil.verifyToken(token);
        User user = userDAO.findByEmailAndActive(email, true);
        if (user == null)
            throw new ResourceNotFoundException("User not found with given email");

        user.setPassword(passwordEncoder.encode(newPassword));
        userDAO.save(user);
    }
}

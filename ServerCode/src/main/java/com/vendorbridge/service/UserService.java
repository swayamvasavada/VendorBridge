package com.vendorbridge.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.dto.SignupDTO;
import com.vendorbridge.dto.UserDTO;
import com.vendorbridge.entity.User;
import com.vendorbridge.exception.AuthenticationException;
import com.vendorbridge.exception.ResourceNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public SignupDTO createUser(SignupDTO signupDTO) throws Exception {
        System.out.println("Entering into UserService -> createUser");
        User user = new User();

        boolean isEmailExist = userDAO.existsByEmail(signupDTO.getEmail());
        System.out.println("isEmailExist: " + isEmailExist);
        if (isEmailExist)
            throw new AuthenticationException("User already exists with given email");

        BeanUtils.copyProperties(signupDTO, user);
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        user.setIsVerified(false);
        user.setIsEnabled(true);
        user.setActive(true);
        user.setCreatedAt(new Date());
        
        userDAO.save(user);
        emailService.sendVerificationMail(signupDTO.getEmail()); // Triggered inside async block

        System.out.println("Exiting from UserService -> createUser");
        return signupDTO;
    }

    public List<UserDTO> getAllUsers() {
        System.out.println("Entering into UserService -> getAllUsers");

        List<User> users = userDAO.findByActive(true);
        List<UserDTO> userDTOs = new ArrayList<>();
        
        for (User user : users) {
            UserDTO userDTO = new UserDTO();
            BeanUtils.copyProperties(user, userDTO);
            userDTOs.add(userDTO);
        }

        System.out.println("Exiting from UserService -> getAllUsers");
        return userDTOs;
    }

    public UserDTO toggleUserEnabled(Long userId, Boolean isEnabled) {
        System.out.println("Entering into UserService -> toggleUserEnabled");

        User user = userDAO.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with given id"));

        user.setIsEnabled(isEnabled);
        user.setModifiedAt(new Date());
        userDAO.save(user);

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        userDTO.setUserID(user.getUserID());

        System.out.println("Exiting from UserService -> toggleUserEnabled");
        return userDTO;
    }

    public UserDTO deleteUser(Long userId) {
        System.out.println("Entering into UserService -> deleteUser");

        User user = userDAO.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with given id"));

        user.setActive(false);
        user.setModifiedAt(new Date());
        userDAO.save(user);

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        userDTO.setUserID(user.getUserID());

        System.out.println("Exiting from UserService -> deleteUser");
        return userDTO;
    }

}

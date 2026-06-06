package com.vendorbridge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vendorbridge.dto.ResponseDTO;
import com.vendorbridge.dto.SignupDTO;
import com.vendorbridge.exception.AuthenticationException;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Operation(summary = "Create a new user")
    @PostMapping("/createUser")
    public ResponseEntity<ResponseDTO> createUser(@RequestBody SignupDTO signupDTO) {
		System.out.println("Entering into UserController -> createUser");

		ResponseDTO responseDTO = new ResponseDTO();
		try {
			responseDTO.setServiceResult(userService.createUser(signupDTO));
			responseDTO.setMessage("User created successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (AuthenticationException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(400));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to create user");
			responseDTO.setMessage("Failed to create user");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from UserController -> createUser");
		return ResponseEntity.ok(responseDTO);
	}

    @Operation(summary = "Fetch active users")
    @GetMapping("/fetchUsers")
    public ResponseEntity<ResponseDTO> fetchUsers() {
		System.out.println("Entering into UserController -> fetchUsers");

		ResponseDTO responseDTO = new ResponseDTO();
		try {
			responseDTO.setServiceResult(userService.getAllUsers());
			responseDTO.setMessage("Users fetched successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to fetch users");
			responseDTO.setMessage("Failed to fetch users");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from UserController -> fetchUsers");
		return ResponseEntity.ok(responseDTO);
	}

    @Operation(summary = "Toggle user enabled status")
    @PatchMapping("/toggleUserEnabled")
    public ResponseEntity<ResponseDTO> toggleUserEnabled(@RequestParam Long userId, @RequestParam Boolean isEnabled) {
		System.out.println("Entering into UserController -> toggleUserEnabled");

		ResponseDTO responseDTO = new ResponseDTO();
		try {
			responseDTO.setServiceResult(userService.toggleUserEnabled(userId, isEnabled));
			responseDTO.setMessage("User enabled status updated successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to update user enabled status");
			responseDTO.setMessage("Failed to update user enabled status");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from UserController -> toggleUserEnabled");
		return ResponseEntity.ok(responseDTO);
	}

    @Operation(summary = "Soft delete user")
    @DeleteMapping("/deleteUser")
    public ResponseEntity<ResponseDTO> deleteUser(@RequestParam Long userId) {
		System.out.println("Entering into UserController -> deleteUser");

		ResponseDTO responseDTO = new ResponseDTO();
		try {
			responseDTO.setServiceResult(userService.deleteUser(userId));
			responseDTO.setMessage("User deleted successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to delete user");
			responseDTO.setMessage("Failed to delete user");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from UserController -> deleteUser");
		return ResponseEntity.ok(responseDTO);
	}
}

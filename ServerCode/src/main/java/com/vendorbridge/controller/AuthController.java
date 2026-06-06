package com.vendorbridge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vendorbridge.dto.LoginDTO;
import com.vendorbridge.dto.ResponseDTO;
import com.vendorbridge.dto.SignupDTO;
import com.vendorbridge.exception.AuthenticationException;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.service.AuthService;

@CrossOrigin(allowedHeaders = "*", origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping(value = "/vendor-registration")
	public ResponseEntity<ResponseDTO> vendorRegistration(@RequestBody SignupDTO signupDTO) {
		System.out.println("Entering into AuthController -> vendorRegistration");

		ResponseDTO responseDTO = new ResponseDTO();
		try {
			responseDTO.setServiceResult(authService.vendorRegistration(signupDTO));
			responseDTO.setMessage("User signed up successfully");
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

		System.out.println("Exiting from AuthController -> vendorRegistration");
		return ResponseEntity.ok(responseDTO);
	}

	@GetMapping(value = "/verify")
	public ResponseEntity<ResponseDTO> verifyEmail(@RequestParam(required = true) String email) {
		System.out.println("Entering into AuthController -> verifyEmail");

		ResponseDTO responseDTO = new ResponseDTO();

		try {
			authService.sendVerificationMail(email);
			responseDTO.setServiceResult("Email sent successfully");
			responseDTO.setMessage("Email sent successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to create verification link");
			responseDTO.setMessage("Failed to create verification link");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from AuthController -> verifyEmail");
		return ResponseEntity.ok(responseDTO);
	}

	@PostMapping(value = "/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody LoginDTO loginDTO) {
		System.out.println("Entering into AuthController -> login");

		ResponseDTO responseDTO = new ResponseDTO();

		try {
			loginDTO = authService.login(loginDTO);
			responseDTO.setServiceResult(loginDTO);

			if (loginDTO.getIsVerified()) {
				responseDTO.setMessage("Signed in successfully");
				responseDTO.setSuccess(Boolean.TRUE);
			} else {
				responseDTO.setMessage("Email is not verified");
				responseDTO.setSuccess(Boolean.FALSE);
			}
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (AuthenticationException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(401));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to login");
			responseDTO.setMessage("Failed to login");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from AuthController -> login");
		return ResponseEntity.ok(responseDTO);
	}

	@PostMapping(value = "/verify")
	public ResponseEntity<ResponseDTO> verifyUser(@RequestParam(required = true) String token) {
		System.out.println("Entering into AuthController -> verifyUser");

		ResponseDTO responseDTO = new ResponseDTO();

		try {
			authService.verifyUser(token);
			responseDTO.setServiceResult("User verified successfully");
			responseDTO.setMessage("User verified successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to verify user");
			responseDTO.setMessage("Failed to verify user");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from AuthController -> verifyEmail");
		return ResponseEntity.ok(responseDTO);
	}
	
	@GetMapping("/request-reset-password")
	public ResponseEntity<ResponseDTO> requestResetPassword(@RequestParam(required = true) String email) {
		System.out.println("Entering into AuthController -> requestResetPassword");

		ResponseDTO responseDTO = new ResponseDTO();

		try {
			authService.requestPasswordReset(email);
			responseDTO.setServiceResult("Password reset link sent successfully");
			responseDTO.setMessage("Password reset link sent successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to send password reset link");
			responseDTO.setMessage("Failed to send password reset link");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from AuthController -> requestResetPassword");
		return ResponseEntity.ok(responseDTO);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<ResponseDTO> resetPassword(@RequestParam(required = true) String token, @RequestParam(required = true) String newPassword) {
		System.out.println("Entering into AuthController -> resetPassword");

		ResponseDTO responseDTO = new ResponseDTO();

		try {
			authService.resetPassword(token, newPassword);
			responseDTO.setServiceResult("Password reset successfully");
			responseDTO.setMessage("Password reset successfully");
			responseDTO.setSuccess(Boolean.TRUE);
		} catch (ResourceNotFoundException e) {
			e.printStackTrace();
			responseDTO.setServiceResult(e.getMessage());
			responseDTO.setMessage(e.getMessage());
			responseDTO.setSuccess(Boolean.FALSE);
			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setServiceResult("Failed to reset password");
			responseDTO.setMessage("Failed to reset password");
			responseDTO.setSuccess(Boolean.FALSE);

			return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
		}

		System.out.println("Exiting from AuthController -> resetPassword");
		return ResponseEntity.ok(responseDTO);
	}
}

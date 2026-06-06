package com.vendorbridge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.entity.User;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.util.EmailUtil;
import com.vendorbridge.util.JwtUtil;

@Service
public class EmailService {
	
	@Autowired
	private UserDAO userDAO;

	@Autowired
	private JwtUtil jwtUtil;

	@Value("${frontend-url}")
	String frontendBaseUrl;
	
	@Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private EmailUtil emailUtil;

	@Async
    public void sendVerificationMail(String email) throws Exception {
		System.out.println("Entering into EmailService -> sendVerificationMail");
		
        User user = userDAO.findByEmailAndActive(email, true);
        if (user == null)
            throw new ResourceNotFoundException("User not found with given email");

        String verificationToken = jwtUtil.generateToken(email, Long.valueOf(15 * 60 * 1000));
        String verificationUrl = new String("/user/verify/").concat(verificationToken);

        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("verificationUrl", frontendBaseUrl.concat(verificationUrl));

        String htmlContent = templateEngine.process("vendorbridge-welcome", context);
        emailUtil.sendHtmlEmail(email, "Welcome to Our Platform", htmlContent);
        
        System.out.println("Exiting from EmailService -> sendVerificationMail");
    }
	
	@Async
	public void sendPasswordResetMail(String email) throws Exception {
		System.out.println("Entering into EmailService -> sendPasswordResetMail");
		
		User user = userDAO.findByEmailAndActive(email, true);
		if (user == null)
			throw new ResourceNotFoundException("User not found with given email");

		String resetToken = jwtUtil.generateToken(email, Long.valueOf(15 * 60 * 1000));
		String resetUrl = new String("/user/reset-password/").concat(resetToken);

		Context context = new Context();
		context.setVariable("name", user.getName());
		context.setVariable("resetPasswordUrl", frontendBaseUrl.concat(resetUrl));

		String htmlContent = templateEngine.process("vendorbridge-reset-password", context);
		emailUtil.sendHtmlEmail(email, "Password Reset Request", htmlContent);
		
		System.out.println("Exiting from EmailService -> sendPasswordResetMail");
	}
	
}

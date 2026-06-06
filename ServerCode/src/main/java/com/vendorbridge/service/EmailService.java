package com.vendorbridge.service;

import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.vendorbridge.dao.RFQItemMappingDAO;
import com.vendorbridge.dao.RFQVendorMappingDAO;
import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.dto.RFQItemDTO;
import com.vendorbridge.entity.RFQ;
import com.vendorbridge.entity.RFQItemMapping;
import com.vendorbridge.entity.RFQVendorMapping;
import com.vendorbridge.entity.User;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.util.EmailUtil;
import com.vendorbridge.util.JwtUtil;
import com.vendorbridge.util.UserRole;

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
    
    @Autowired
    private RFQVendorMappingDAO rfqVendorMappingDAO;
    
    @Autowired
    private RFQItemMappingDAO rfqItemMappingDAO;

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
	
	@Async
	public void sendRFQApprovalRequest(Long rfqID) throws Exception {
		System.out.println("Entering into EmailService -> sendRFQApprovalRequest");
		
		try {
			// Get all active managers
			List<User> managers = userDAO.findByRoleAndActive(UserRole.MANAGER, true);
			if (managers == null || managers.isEmpty()) {
				System.out.println("No active managers found for RFQ approval notification");
				return;
			}
			
			// Prepare RFQ data
			Context context = new Context();
			context.setVariable("rfqID", rfqID);
			context.setVariable("approvalUrl", frontendBaseUrl.concat("/rfq/").concat(rfqID.toString()).concat("/approve"));
			
			String htmlContent = templateEngine.process("vendorbridge-rfq-approval-request", context);
			
			// Send email to all managers
			for (User manager : managers) {
				context.setVariable("managerName", manager.getName());
				htmlContent = templateEngine.process("vendorbridge-rfq-approval-request", context);
				emailUtil.sendHtmlEmail(manager.getEmail(), "RFQ Approval Required - ID: " + rfqID, htmlContent);
				System.out.println("RFQ approval request email sent to manager: " + manager.getEmail());
			}
		} catch (Exception e) {
			System.out.println("Error sending RFQ approval request email: " + e.getMessage());
			e.printStackTrace();
		}
		
		System.out.println("Exiting from EmailService -> sendRFQApprovalRequest");
	}
	
	@Async
	public void sendRFQOpenNotification(RFQ rfq) throws Exception {
		System.out.println("Entering into EmailService -> sendRFQOpenNotification");
		
		try {
			if (rfq == null || rfq.getRfqID() == null) {
				System.out.println("Invalid RFQ data for notification");
				return;
			}
			
			// Get all vendors mapped to this RFQ
			List<RFQVendorMapping> vendorMappings = rfqVendorMappingDAO.findByRfqAndActive(rfq, true);
			if (vendorMappings == null || vendorMappings.isEmpty()) {
				System.out.println("No vendors found for RFQ: " + rfq.getRfqID());
				return;
			}
			
			// Get all items for this RFQ
			List<RFQItemMapping> itemMappings = rfqItemMappingDAO.findByRfqAndActive(rfq, true);
			List<RFQItemDTO> itemDTOs = new java.util.ArrayList<>();
			if (itemMappings != null) {
				for (RFQItemMapping itemMapping : itemMappings) {
					RFQItemDTO itemDTO = new RFQItemDTO();
					itemDTO.setItemName(itemMapping.getItemName());
					itemDTO.setUnit(itemMapping.getUnit());
					itemDTO.setQuantity(itemMapping.getQuantity());
					itemDTOs.add(itemDTO);
				}
			}
			
			// Format deadline
			String deadlineStr = "";
			if (rfq.getDeadline() != null) {
				SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy");
				deadlineStr = sdf.format(rfq.getDeadline());
			}
			
			// Prepare common context variables
			Context context = new Context();
			context.setVariable("rfqTitle", rfq.getTitle());
			context.setVariable("rfqDescription", rfq.getDescription());
			context.setVariable("rfqDeadline", deadlineStr);
			context.setVariable("rfqItems", itemDTOs);
			context.setVariable("rfqUrl", frontendBaseUrl.concat("/rfq/").concat(rfq.getRfqID().toString()));
			
			// Send email to each vendor
			for (RFQVendorMapping vendorMapping : vendorMappings) {
				if (vendorMapping.getVendor() != null && vendorMapping.getVendor().getUser() != null) {
					User vendorUser = vendorMapping.getVendor().getUser();
					context.setVariable("vendorName", vendorUser.getName());
					
					String htmlContent = templateEngine.process("vendorbridge-rfq-open", context);
					emailUtil.sendHtmlEmail(vendorUser.getEmail(), "New RFQ: " + rfq.getTitle(), htmlContent);
					System.out.println("RFQ open notification email sent to vendor: " + vendorUser.getEmail());
				}
			}
		} catch (Exception e) {
			System.out.println("Error sending RFQ open notification email: " + e.getMessage());
			e.printStackTrace();
		}
		
		System.out.println("Exiting from EmailService -> sendRFQOpenNotification");
	}
	
}

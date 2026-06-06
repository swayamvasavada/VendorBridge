package com.vendorbridge.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vendorbridge.dao.RFQDAO;
import com.vendorbridge.dao.RFQItemMappingDAO;
import com.vendorbridge.dao.RFQVendorMappingDAO;
import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.dao.VendorDAO;
import com.vendorbridge.dto.RFQDTO;
import com.vendorbridge.dto.RFQItemDTO;
import com.vendorbridge.dto.VendorDTO;
import com.vendorbridge.entity.RFQ;
import com.vendorbridge.entity.RFQItemMapping;
import com.vendorbridge.entity.RFQVendorMapping;
import com.vendorbridge.entity.User;
import com.vendorbridge.entity.Vendor;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.util.RFQStatus;

@Service
public class RFQService {

    @Autowired
    private RFQDAO rfqDAO;

    @Autowired
    private RFQItemMappingDAO rfqItemMappingDAO;

    @Autowired
    private RFQVendorMappingDAO rfqVendorMappingDAO;

    @Autowired
    private VendorDAO vendorDAO;

    @Autowired
    private UserDAO userDAO;
    
    @Autowired
    private EmailService emailService;

    public List<VendorDTO> fetchVendors(String category) {
        System.out.println("Entering into RFQService -> fetchVendors");

        List<Vendor> vendors;
        if (category == null || category.trim().isEmpty()) {
            vendors = vendorDAO.findByActive(true);
        } else {
            vendors = vendorDAO.findByCategoryAndActive(category.trim(), true);
        }
        List<VendorDTO> vendorDTOs = new ArrayList<>();

        for (Vendor vendor : vendors) {
            VendorDTO vendorDTO = new VendorDTO();
            vendorDTO.setVendorID(vendor.getVendorID());
            vendorDTO.setGstNumber(vendor.getGstNumber());
            vendorDTO.setCompanyName(vendor.getCompanyName());
            vendorDTO.setCategory(vendor.getCategory());
            vendorDTO.setAddress(vendor.getAddress());
            vendorDTO.setIsVerified(vendor.getUser().getIsVerified());
            vendorDTO.setIsEnabled(vendor.getUser().getIsEnabled());

            User user = vendor.getUser();
            if (user != null) {
                vendorDTO.setUserID(user.getUserID());
                vendorDTO.setName(user.getName());
                vendorDTO.setEmail(user.getEmail());
                vendorDTO.setPhoneNo(user.getPhoneNo());
            }

            vendorDTOs.add(vendorDTO);
        }

        System.out.println("Exiting from RFQService -> fetchVendors");
        return vendorDTOs;
    }

    @Transactional
    public RFQDTO addRFQ(RFQDTO rfqDTO) {
        System.out.println("Entering into RFQService -> addRFQ");

        validateUserRFQStatus(rfqDTO.getStatus());

        RFQ rfq = new RFQ();
        rfq.setTitle(rfqDTO.getTitle());
        rfq.setDescription(rfqDTO.getDescription());
        rfq.setCategory(rfqDTO.getCategory());
        rfq.setDeadline(rfqDTO.getDeadline());
        rfq.setStatus(rfqDTO.getStatus());
        rfq.setActive(true);
        rfq.setCreatedAt(new Date());
        rfq = rfqDAO.save(rfq);

        saveRFQItemMappings(rfq, rfqDTO.getItems());
        saveRFQVendorMappings(rfq, rfqDTO.getVendorIDs());

        // Send approval request email if RFQ status is PENDING_APPROVAL
        if (rfqDTO.getStatus() == RFQStatus.PENDING_APPROVAL) {
            try {
                emailService.sendRFQApprovalRequest(rfq.getRfqID());
            } catch (Exception e) {
                System.out.println("Error sending RFQ approval request email: " + e.getMessage());
            }
        }

        System.out.println("Exiting from RFQService -> addRFQ");
        return buildRFQDTO(rfq);
    }

    @Transactional
    public RFQDTO updateRFQ(RFQDTO rfqDTO) {
        System.out.println("Entering into RFQService -> updateRFQ");

        if (rfqDTO.getRfqID() == null)
            throw new IllegalArgumentException("RFQ id is required");

        validateUserRFQStatus(rfqDTO.getStatus());

        RFQ rfq = getActiveRFQ(rfqDTO.getRfqID());
        RFQStatus oldStatus = rfq.getStatus();

        rfq.setTitle(rfqDTO.getTitle());
        rfq.setDescription(rfqDTO.getDescription());
        rfq.setCategory(rfqDTO.getCategory());
        rfq.setDeadline(rfqDTO.getDeadline());
        rfq.setStatus(rfqDTO.getStatus());
        rfq.setModifiedAt(new Date());
        rfq = rfqDAO.save(rfq);

        syncRFQItemMappings(rfq, rfqDTO.getItems());
        syncRFQVendorMappings(rfq, rfqDTO.getVendorIDs());

        // Send approval request email if status changed to PENDING_APPROVAL
        if (oldStatus != RFQStatus.PENDING_APPROVAL && rfqDTO.getStatus() == RFQStatus.PENDING_APPROVAL) {
            try {
                emailService.sendRFQApprovalRequest(rfq.getRfqID());
            } catch (Exception e) {
                System.out.println("Error sending RFQ approval request email: " + e.getMessage());
            }
        }

        System.out.println("Exiting from RFQService -> updateRFQ");
        return buildRFQDTO(rfq);
    }

    public RFQDTO fetchRFQDetail(Long rfqID) {
        System.out.println("Entering into RFQService -> fetchRFQDetail");

        RFQ rfq = getActiveRFQ(rfqID);

        System.out.println("Exiting from RFQService -> fetchRFQDetail");
        return buildRFQDTO(rfq);
    }

    public List<RFQDTO> fetchRFQsForApproval() {
        System.out.println("Entering into RFQService -> fetchRFQsForApproval");

        List<RFQDTO> rfqDTOs = new ArrayList<>();
        for (RFQ rfq : rfqDAO.findByStatusAndActive(RFQStatus.PENDING_APPROVAL, true)) {
            rfqDTOs.add(buildRFQDTO(rfq));
        }

        System.out.println("Exiting from RFQService -> fetchRFQsForApproval");
        return rfqDTOs;
    }

    public List<RFQDTO> fetchVendorRFQs() {
        System.out.println("Entering into RFQService -> fetchVendorRFQs");

        Vendor vendor = getCurrentVendor();
        List<RFQDTO> rfqDTOs = new ArrayList<>();
        for (RFQVendorMapping vendorMapping : rfqVendorMappingDAO.findByVendorAndActive(vendor, true)) {
            RFQ rfq = vendorMapping.getRfq();
            if (rfq != null && Boolean.TRUE.equals(rfq.getActive()) && rfq.getStatus() == RFQStatus.OPEN) {
                rfqDTOs.add(buildRFQDTO(rfq));
            }
        }

        System.out.println("Exiting from RFQService -> fetchVendorRFQs");
        return rfqDTOs;
    }

    public RFQDTO updateRFQStatus(Long rfqID, RFQStatus status) {
        System.out.println("Entering into RFQService -> updateRFQStatus");

        if (status == null)
            throw new IllegalArgumentException("RFQ status is required");

        RFQ rfq = getActiveRFQ(rfqID);
        RFQStatus oldStatus = rfq.getStatus();
        rfq.setStatus(status);
        rfq.setModifiedAt(new Date());
        rfq = rfqDAO.save(rfq);

        // Send open notification emails to vendors if status changed to OPEN
        if (oldStatus != RFQStatus.OPEN && status == RFQStatus.OPEN) {
            try {
                emailService.sendRFQOpenNotification(rfq);
            } catch (Exception e) {
                System.out.println("Error sending RFQ open notification emails: " + e.getMessage());
            }
        }

        System.out.println("Exiting from RFQService -> updateRFQStatus");
        return buildRFQDTO(rfq);
    }

    private void validateUserRFQStatus(RFQStatus status) {
        if (status == null)
            throw new IllegalArgumentException("RFQ status is required");

        if (status != RFQStatus.DRAFT && status != RFQStatus.PENDING_APPROVAL)
            throw new IllegalArgumentException("Procurement officer can only save RFQ as DRAFT or PENDING_APPROVAL");
    }

    private RFQ getActiveRFQ(Long rfqID) {
        if (rfqID == null)
            throw new IllegalArgumentException("RFQ id is required");

        RFQ rfq = rfqDAO.findById(rfqID)
                .orElseThrow(() -> new ResourceNotFoundException("RFQ not found with given id"));

        if (!Boolean.TRUE.equals(rfq.getActive()))
            throw new ResourceNotFoundException("RFQ not found with given id");

        return rfq;
    }

    private Vendor getCurrentVendor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null)
            throw new IllegalArgumentException("Authenticated user is required");

        User user = userDAO.findByEmailAndActive(authentication.getName(), true);
        if (user == null)
            throw new ResourceNotFoundException("User not found with given email");

        Vendor vendor = vendorDAO.findByUserAndActive(user, true);
        if (vendor == null)
            throw new ResourceNotFoundException("Vendor not found for current user");

        return vendor;
    }

    private void saveRFQItemMappings(RFQ rfq, List<RFQItemDTO> itemDTOs) {
        if (itemDTOs == null || itemDTOs.isEmpty())
            return;

        List<RFQItemMapping> itemMappings = new ArrayList<>();
        Set<String> itemNames = new HashSet<>();
        Date now = new Date();

        for (RFQItemDTO itemDTO : itemDTOs) {
            if (itemDTO == null || itemDTO.getItemName() == null || itemDTO.getItemName().trim().isEmpty())
                throw new IllegalArgumentException("Item name is required");

            String itemName = itemDTO.getItemName().trim();
            if (!itemNames.add(itemName))
                throw new IllegalArgumentException("Duplicate item names are not allowed");

            RFQItemMapping itemMapping = new RFQItemMapping();
            itemMapping.setRfq(rfq);
            itemMapping.setItemName(itemName);
            itemMapping.setUnit(itemDTO.getUnit());
            itemMapping.setQuantity(itemDTO.getQuantity());
            itemMapping.setActive(true);
            itemMapping.setCreatedAt(now);
            itemMappings.add(itemMapping);
        }

        rfqItemMappingDAO.saveAll(itemMappings);
    }

    private void saveRFQVendorMappings(RFQ rfq, List<Long> vendorIDs) {
        if (vendorIDs == null || vendorIDs.isEmpty())
            return;

        if (vendorIDs.contains(null))
            throw new IllegalArgumentException("Vendor id is required");

        Set<Long> uniqueVendorIDs = new HashSet<>(vendorIDs);
        if (uniqueVendorIDs.size() != vendorIDs.size())
            throw new IllegalArgumentException("Duplicate vendor ids are not allowed");

        List<Vendor> vendors = vendorDAO.findByUser_UserIDInAndActive(new ArrayList<>(uniqueVendorIDs), true);
        if (vendors.size() != uniqueVendorIDs.size())
            throw new ResourceNotFoundException("One or more vendors were not found");

        List<RFQVendorMapping> vendorMappings = new ArrayList<>();
        Date now = new Date();

        for (Vendor vendor : vendors) {
            RFQVendorMapping vendorMapping = new RFQVendorMapping();
            vendorMapping.setRfq(rfq);
            vendorMapping.setVendor(vendor);
            vendorMapping.setActive(true);
            vendorMapping.setCreatedAt(now);
            vendorMappings.add(vendorMapping);
        }

        rfqVendorMappingDAO.saveAll(vendorMappings);
    }

    private void syncRFQItemMappings(RFQ rfq, List<RFQItemDTO> itemDTOs) {
        List<RFQItemMapping> currentItemMappings = rfqItemMappingDAO.findByRfqAndActive(rfq, true);
        Map<String, RFQItemMapping> currentItemMappingByName = new HashMap<>();
        for (RFQItemMapping itemMapping : currentItemMappings) {
            currentItemMappingByName.put(itemMapping.getItemName(), itemMapping);
        }

        Map<String, RFQItemDTO> incomingItemByName = new HashMap<>();
        if (itemDTOs != null) {
            for (RFQItemDTO itemDTO : itemDTOs) {
                if (itemDTO == null || itemDTO.getItemName() == null || itemDTO.getItemName().trim().isEmpty())
                    throw new IllegalArgumentException("Item name is required");

                String itemName = itemDTO.getItemName().trim();
                if (incomingItemByName.containsKey(itemName))
                    throw new IllegalArgumentException("Duplicate item names are not allowed");

                incomingItemByName.put(itemName, itemDTO);
            }
        }

        List<RFQItemMapping> itemMappingsToSave = new ArrayList<>();
        Date now = new Date();

        for (RFQItemMapping currentItemMapping : currentItemMappings) {
            RFQItemDTO incomingItem = incomingItemByName.get(currentItemMapping.getItemName());
            if (incomingItem == null) {
                currentItemMapping.setActive(false);
            } else {
                currentItemMapping.setUnit(incomingItem.getUnit());
                currentItemMapping.setQuantity(incomingItem.getQuantity());
            }

            currentItemMapping.setModifiedAt(now);
            itemMappingsToSave.add(currentItemMapping);
        }

        for (Map.Entry<String, RFQItemDTO> incomingItemEntry : incomingItemByName.entrySet()) {
            if (currentItemMappingByName.containsKey(incomingItemEntry.getKey()))
                continue;

            RFQItemDTO incomingItem = incomingItemEntry.getValue();
            RFQItemMapping itemMapping = new RFQItemMapping();
            itemMapping.setRfq(rfq);
            itemMapping.setItemName(incomingItemEntry.getKey());
            itemMapping.setUnit(incomingItem.getUnit());
            itemMapping.setQuantity(incomingItem.getQuantity());
            itemMapping.setActive(true);
            itemMapping.setCreatedAt(now);
            itemMappingsToSave.add(itemMapping);
        }

        rfqItemMappingDAO.saveAll(itemMappingsToSave);
    }

    private void syncRFQVendorMappings(RFQ rfq, List<Long> vendorIDs) {
        List<RFQVendorMapping> currentVendorMappings = rfqVendorMappingDAO.findByRfqAndActive(rfq, true);
        Map<Long, RFQVendorMapping> currentVendorMappingByVendorID = new HashMap<>();
        for (RFQVendorMapping vendorMapping : currentVendorMappings) {
            currentVendorMappingByVendorID.put(vendorMapping.getVendor().getVendorID(), vendorMapping);
        }

        Set<Long> incomingVendorIDs = new HashSet<>();
        if (vendorIDs != null) {
            if (vendorIDs.contains(null))
                throw new IllegalArgumentException("Vendor id is required");

            incomingVendorIDs.addAll(vendorIDs);
            if (incomingVendorIDs.size() != vendorIDs.size())
                throw new IllegalArgumentException("Duplicate vendor ids are not allowed");
        }

        List<Vendor> incomingVendors = new ArrayList<>();
        if (!incomingVendorIDs.isEmpty()) {
            incomingVendors = vendorDAO.findByUser_UserIDInAndActive(new ArrayList<>(incomingVendorIDs), true);
            if (incomingVendors.size() != incomingVendorIDs.size())
                throw new ResourceNotFoundException("One or more vendors were not found");
        }

        List<RFQVendorMapping> vendorMappingsToSave = new ArrayList<>();
        Date now = new Date();

        for (RFQVendorMapping currentVendorMapping : currentVendorMappings) {
            Long vendorID = currentVendorMapping.getVendor().getVendorID();
            if (!incomingVendorIDs.contains(vendorID)) {
                currentVendorMapping.setActive(false);
                currentVendorMapping.setModifiedAt(now);
                vendorMappingsToSave.add(currentVendorMapping);
            }
        }

        for (Vendor incomingVendor : incomingVendors) {
            if (currentVendorMappingByVendorID.containsKey(incomingVendor.getVendorID()))
                continue;

            RFQVendorMapping vendorMapping = new RFQVendorMapping();
            vendorMapping.setRfq(rfq);
            vendorMapping.setVendor(incomingVendor);
            vendorMapping.setActive(true);
            vendorMapping.setCreatedAt(now);
            vendorMappingsToSave.add(vendorMapping);
        }

        rfqVendorMappingDAO.saveAll(vendorMappingsToSave);
    }

    private RFQDTO buildRFQDTO(RFQ rfq) {
        RFQDTO rfqDTO = new RFQDTO();
        rfqDTO.setRfqID(rfq.getRfqID());
        rfqDTO.setTitle(rfq.getTitle());
        rfqDTO.setDescription(rfq.getDescription());
        rfqDTO.setCategory(rfq.getCategory());
        rfqDTO.setDeadline(rfq.getDeadline());
        rfqDTO.setStatus(rfq.getStatus());

        List<RFQItemDTO> itemDTOs = new ArrayList<>();
        for (RFQItemMapping itemMapping : rfqItemMappingDAO.findByRfqAndActive(rfq, true)) {
            RFQItemDTO itemDTO = new RFQItemDTO();
            itemDTO.setRfqItemMappingID(itemMapping.getRfqItemMappingID());
            itemDTO.setItemName(itemMapping.getItemName());
            itemDTO.setUnit(itemMapping.getUnit());
            itemDTO.setQuantity(itemMapping.getQuantity());
            itemDTOs.add(itemDTO);
        }
        rfqDTO.setItems(itemDTOs);

        List<Long> vendorIDs = new ArrayList<>();
        for (RFQVendorMapping vendorMapping : rfqVendorMappingDAO.findByRfqAndActive(rfq, true)) {
            vendorIDs.add(vendorMapping.getVendor().getVendorID());
        }
        rfqDTO.setVendorIDs(vendorIDs);

        return rfqDTO;
    }
}

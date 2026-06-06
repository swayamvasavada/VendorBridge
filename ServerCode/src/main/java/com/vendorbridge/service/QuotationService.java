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

import com.vendorbridge.dao.QuotationDAO;
import com.vendorbridge.dao.QuotationItemDAO;
import com.vendorbridge.dao.RFQDAO;
import com.vendorbridge.dao.RFQItemMappingDAO;
import com.vendorbridge.dao.RFQVendorMappingDAO;
import com.vendorbridge.dao.UserDAO;
import com.vendorbridge.dao.VendorDAO;
import com.vendorbridge.dto.QuotationDTO;
import com.vendorbridge.dto.QuotationItemDTO;
import com.vendorbridge.entity.Quotation;
import com.vendorbridge.entity.QuotationItem;
import com.vendorbridge.entity.RFQ;
import com.vendorbridge.entity.RFQItemMapping;
import com.vendorbridge.entity.User;
import com.vendorbridge.entity.Vendor;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.util.QuotationStatus;
import com.vendorbridge.util.RFQStatus;
import com.vendorbridge.util.UserRole;

@Service
public class QuotationService {

    @Autowired
    private QuotationDAO quotationDAO;

    @Autowired
    private QuotationItemDAO quotationItemDAO;

    @Autowired
    private RFQDAO rfqDAO;

    @Autowired
    private RFQItemMappingDAO rfqItemMappingDAO;

    @Autowired
    private RFQVendorMappingDAO rfqVendorMappingDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private VendorDAO vendorDAO;

    @Transactional
    public QuotationDTO submitQuotation(QuotationDTO quotationDTO) {
        System.out.println("Entering into QuotationService -> submitQuotation");

        if (quotationDTO == null || quotationDTO.getRfqID() == null)
            throw new IllegalArgumentException("RFQ id is required");

        RFQ rfq = getActiveRFQ(quotationDTO.getRfqID());
        if (rfq.getStatus() != RFQStatus.OPEN)
            throw new IllegalArgumentException("Quotation can only be submitted for OPEN RFQs");

        Vendor vendor = getCurrentVendor();
        if (rfqVendorMappingDAO.findByRfqAndVendorAndActive(rfq, vendor, true) == null)
            throw new IllegalArgumentException("Vendor is not invited for this RFQ");

        if (quotationDAO.findByRfqAndVendorAndActive(rfq, vendor, true) != null)
            throw new IllegalArgumentException("Quotation already submitted for this RFQ");

        List<RFQItemMapping> rfqItems = rfqItemMappingDAO.findByRfqAndActive(rfq, true);
        if (rfqItems == null || rfqItems.isEmpty())
            throw new IllegalArgumentException("RFQ does not have any active items");

        Map<Long, RFQItemMapping> rfqItemByID = new HashMap<>();
        for (RFQItemMapping rfqItem : rfqItems) {
            rfqItemByID.put(rfqItem.getRfqItemMappingID(), rfqItem);
        }

        List<QuotationItemDTO> itemDTOs = quotationDTO.getItems();
        if (itemDTOs == null || itemDTOs.isEmpty())
            throw new IllegalArgumentException("Quotation items are required");

        Set<Long> incomingItemIDs = new HashSet<>();
        for (QuotationItemDTO itemDTO : itemDTOs) {
            validateQuotationItemDTO(itemDTO, rfqItemByID, incomingItemIDs);
        }

        if (incomingItemIDs.size() != rfqItemByID.size())
            throw new IllegalArgumentException("Quotation must include price and delivery time for every RFQ item");

        Date now = new Date();
        Quotation quotation = new Quotation();
        quotation.setRfq(rfq);
        quotation.setVendor(vendor);
        quotation.setStatus(QuotationStatus.PENDING);
        quotation.setActive(true);
        quotation.setCreatedAt(now);
        quotation = quotationDAO.save(quotation);

        List<QuotationItem> quotationItems = new ArrayList<>();
        for (QuotationItemDTO itemDTO : itemDTOs) {
            RFQItemMapping rfqItem = rfqItemByID.get(itemDTO.getRfqItemMappingID());

            QuotationItem quotationItem = new QuotationItem();
            quotationItem.setQuotation(quotation);
            quotationItem.setRfqItemMapping(rfqItem);
            quotationItem.setPrice(itemDTO.getPrice());
            quotationItem.setDeliveryTime(itemDTO.getDeliveryTime().trim());
            quotationItem.setActive(true);
            quotationItem.setCreatedAt(now);
            quotationItems.add(quotationItem);
        }

        quotationItemDAO.saveAll(quotationItems);

        System.out.println("Exiting from QuotationService -> submitQuotation");
        return buildQuotationDTO(quotation);
    }

    public QuotationDTO fetchQuotation(Long quotationID) {
        System.out.println("Entering into QuotationService -> fetchQuotation");

        Quotation quotation = getActiveQuotation(quotationID);
        User currentUser = getCurrentUser();
        if (currentUser.getRole() == UserRole.VENDOR) {
            Vendor vendor = getVendorForUser(currentUser);
            if (!quotation.getVendor().getVendorID().equals(vendor.getVendorID()))
                throw new IllegalArgumentException("Vendor can only fetch own quotation");
        }

        System.out.println("Exiting from QuotationService -> fetchQuotation");
        return buildQuotationDTO(quotation);
    }

    public List<QuotationDTO> fetchQuotations(Long rfqID) {
        System.out.println("Entering into QuotationService -> fetchQuotations");

        User currentUser = getCurrentUser();
        List<Quotation> quotations;
        if (currentUser.getRole() == UserRole.VENDOR) {
            Vendor vendor = getVendorForUser(currentUser);
            quotations = quotationDAO.findByVendorAndActive(vendor, true);
        } else {
            if (rfqID == null)
                throw new IllegalArgumentException("RFQ id is required");

            RFQ rfq = getActiveRFQ(rfqID);
            quotations = quotationDAO.findByRfqAndActive(rfq, true);
        }

        List<QuotationDTO> quotationDTOs = new ArrayList<>();
        for (Quotation quotation : quotations) {
            quotationDTOs.add(buildQuotationDTO(quotation));
        }

        System.out.println("Exiting from QuotationService -> fetchQuotations");
        return quotationDTOs;
    }

    @Transactional
    public QuotationDTO updateQuotationStatus(Long quotationID, QuotationStatus status) {
        System.out.println("Entering into QuotationService -> updateQuotationStatus");

        User currentUser = getCurrentUser();
        if (currentUser.getRole() != UserRole.PROCUREMENT_OFFICER && currentUser.getRole() != UserRole.ADMIN)
            throw new IllegalArgumentException("Only procurement can approve or reject quotations");

        if (status == null)
            throw new IllegalArgumentException("Quotation status is required");

        if (status == QuotationStatus.PENDING)
            throw new IllegalArgumentException("Quotation can only be accepted or rejected");

        Quotation quotation = getActiveQuotation(quotationID);
        quotation.setStatus(status);
        quotation.setModifiedAt(new Date());
        quotation = quotationDAO.save(quotation);

        System.out.println("Exiting from QuotationService -> updateQuotationStatus");
        return buildQuotationDTO(quotation);
    }

    private void validateQuotationItemDTO(QuotationItemDTO itemDTO, Map<Long, RFQItemMapping> rfqItemByID,
            Set<Long> incomingItemIDs) {
        if (itemDTO == null || itemDTO.getRfqItemMappingID() == null)
            throw new IllegalArgumentException("RFQ item mapping id is required");

        if (!rfqItemByID.containsKey(itemDTO.getRfqItemMappingID()))
            throw new IllegalArgumentException("Quotation contains item that does not belong to the RFQ");

        if (!incomingItemIDs.add(itemDTO.getRfqItemMappingID()))
            throw new IllegalArgumentException("Duplicate quotation item is not allowed");

        if (itemDTO.getPrice() == null || itemDTO.getPrice().signum() <= 0)
            throw new IllegalArgumentException("Item price must be greater than zero");

        if (itemDTO.getDeliveryTime() == null || itemDTO.getDeliveryTime().trim().isEmpty())
            throw new IllegalArgumentException("Delivery time is required for every item");
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

    private Quotation getActiveQuotation(Long quotationID) {
        if (quotationID == null)
            throw new IllegalArgumentException("Quotation id is required");

        Quotation quotation = quotationDAO.findById(quotationID)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with given id"));

        if (!Boolean.TRUE.equals(quotation.getActive()))
            throw new ResourceNotFoundException("Quotation not found with given id");

        return quotation;
    }

    private Vendor getCurrentVendor() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != UserRole.VENDOR)
            throw new IllegalArgumentException("Only vendors can submit quotation");

        return getVendorForUser(currentUser);
    }

    private Vendor getVendorForUser(User user) {
        Vendor vendor = vendorDAO.findByUserAndActive(user, true);
        if (vendor == null)
            throw new ResourceNotFoundException("Vendor not found for current user");

        return vendor;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null)
            throw new IllegalArgumentException("Authenticated user is required");

        User user = userDAO.findByEmailAndActive(authentication.getName(), true);
        if (user == null)
            throw new ResourceNotFoundException("User not found with given email");

        return user;
    }

    private QuotationDTO buildQuotationDTO(Quotation quotation) {
        QuotationDTO quotationDTO = new QuotationDTO();
        quotationDTO.setQuotationID(quotation.getQuotationID());
        quotationDTO.setRfqID(quotation.getRfq().getRfqID());
        quotationDTO.setVendorID(quotation.getVendor().getVendorID());
        quotationDTO.setStatus(quotation.getStatus());
        quotationDTO.setCreatedAt(quotation.getCreatedAt());
        quotationDTO.setModifiedAt(quotation.getModifiedAt());

        if (quotation.getVendor().getUser() != null)
            quotationDTO.setVendorName(quotation.getVendor().getUser().getName());

        List<QuotationItemDTO> itemDTOs = new ArrayList<>();
        for (QuotationItem quotationItem : quotationItemDAO.findByQuotationAndActive(quotation, true)) {
            RFQItemMapping rfqItem = quotationItem.getRfqItemMapping();

            QuotationItemDTO itemDTO = new QuotationItemDTO();
            itemDTO.setQuotationItemID(quotationItem.getQuotationItemID());
            itemDTO.setRfqItemMappingID(rfqItem.getRfqItemMappingID());
            itemDTO.setItemName(rfqItem.getItemName());
            itemDTO.setUnit(rfqItem.getUnit());
            itemDTO.setQuantity(rfqItem.getQuantity());
            itemDTO.setPrice(quotationItem.getPrice());
            itemDTO.setDeliveryTime(quotationItem.getDeliveryTime());
            itemDTOs.add(itemDTO);
        }
        quotationDTO.setItems(itemDTOs);

        return quotationDTO;
    }
}

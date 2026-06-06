package com.vendorbridge.dto;

import java.util.Date;
import java.util.List;

import com.vendorbridge.util.RFQStatus;

public class RFQDTO {
    private Long rfqID;
    private String title;
    private String description;
    private String category;
    private Date deadline;
    private RFQStatus status;
    private List<RFQItemDTO> items;
    private List<Long> vendorIDs;

    public Long getRfqID() {
        return rfqID;
    }

    public void setRfqID(Long rfqID) {
        this.rfqID = rfqID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public RFQStatus getStatus() {
        return status;
    }

    public void setStatus(RFQStatus status) {
        this.status = status;
    }

    public List<RFQItemDTO> getItems() {
        return items;
    }

    public void setItems(List<RFQItemDTO> items) {
        this.items = items;
    }

    public List<Long> getVendorIDs() {
        return vendorIDs;
    }

    public void setVendorIDs(List<Long> vendorIDs) {
        this.vendorIDs = vendorIDs;
    }
}

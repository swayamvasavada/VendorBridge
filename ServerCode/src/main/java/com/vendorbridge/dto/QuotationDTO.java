package com.vendorbridge.dto;

import java.util.Date;
import java.util.List;

import com.vendorbridge.util.QuotationStatus;

public class QuotationDTO {
    private Long quotationID;
    private Long rfqID;
    private Long vendorID;
    private String vendorName;
    private QuotationStatus status;
    private List<QuotationItemDTO> items;
    private Date createdAt;
    private Date modifiedAt;

    public Long getQuotationID() {
        return quotationID;
    }

    public void setQuotationID(Long quotationID) {
        this.quotationID = quotationID;
    }

    public Long getRfqID() {
        return rfqID;
    }

    public void setRfqID(Long rfqID) {
        this.rfqID = rfqID;
    }

    public Long getVendorID() {
        return vendorID;
    }

    public void setVendorID(Long vendorID) {
        this.vendorID = vendorID;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public QuotationStatus getStatus() {
        return status;
    }

    public void setStatus(QuotationStatus status) {
        this.status = status;
    }

    public List<QuotationItemDTO> getItems() {
        return items;
    }

    public void setItems(List<QuotationItemDTO> items) {
        this.items = items;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}

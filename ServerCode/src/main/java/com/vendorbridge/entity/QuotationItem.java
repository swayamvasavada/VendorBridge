package com.vendorbridge.entity;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "QUOTATIONITEMS")
public class QuotationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QuotationItemID")
    private Long quotationItemID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QuotationID", nullable = false)
    private Quotation quotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RFQItemMappingID", nullable = false)
    private RFQItemMapping rfqItemMapping;

    @Column(name = "Price")
    private BigDecimal price;

    @Column(name = "DeliveryTime")
    private String deliveryTime;

    @Column(name = "Active")
    private Boolean active = true;

    @Column(name = "CreatedAt")
    private Date createdAt;

    @Column(name = "ModifiedAt")
    private Date modifiedAt;

    public Long getQuotationItemID() {
        return quotationItemID;
    }

    public void setQuotationItemID(Long quotationItemID) {
        this.quotationItemID = quotationItemID;
    }

    public Quotation getQuotation() {
        return quotation;
    }

    public void setQuotation(Quotation quotation) {
        this.quotation = quotation;
    }

    public RFQItemMapping getRfqItemMapping() {
        return rfqItemMapping;
    }

    public void setRfqItemMapping(RFQItemMapping rfqItemMapping) {
        this.rfqItemMapping = rfqItemMapping;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(String deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

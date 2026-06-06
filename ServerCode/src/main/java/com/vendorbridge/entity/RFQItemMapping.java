package com.vendorbridge.entity;

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
@Table(name = "RFQITEMMAPPING")
public class RFQItemMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RFQItemMappingID")
    private Long rfqItemMappingID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RFQID", nullable = false)
    private RFQ rfq;

    @Column(name = "ItemName")
    private String itemName;

    @Column(name = "Unit")
    private String unit;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Active")
    private Boolean active = true;

    @Column(name = "CreatedAt")
    private Date createdAt;

    @Column(name = "ModifiedAt")
    private Date modifiedAt;

    public Long getRfqItemMappingID() {
        return rfqItemMappingID;
    }

    public void setRfqItemMappingID(Long rfqItemMappingID) {
        this.rfqItemMappingID = rfqItemMappingID;
    }

    public RFQ getRfq() {
        return rfq;
    }

    public void setRfq(RFQ rfq) {
        this.rfq = rfq;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

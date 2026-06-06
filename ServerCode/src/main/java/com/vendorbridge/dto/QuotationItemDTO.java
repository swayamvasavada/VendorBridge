package com.vendorbridge.dto;

import java.math.BigDecimal;

public class QuotationItemDTO {
    private Long quotationItemID;
    private Long rfqItemMappingID;
    private String itemName;
    private String unit;
    private Integer quantity;
    private BigDecimal price;
    private String deliveryTime;

    public Long getQuotationItemID() {
        return quotationItemID;
    }

    public void setQuotationItemID(Long quotationItemID) {
        this.quotationItemID = quotationItemID;
    }

    public Long getRfqItemMappingID() {
        return rfqItemMappingID;
    }

    public void setRfqItemMappingID(Long rfqItemMappingID) {
        this.rfqItemMappingID = rfqItemMappingID;
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
}

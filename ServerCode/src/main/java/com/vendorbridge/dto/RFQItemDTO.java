package com.vendorbridge.dto;

public class RFQItemDTO {
    private Long rfqItemMappingID;
    private String itemName;
    private String unit;
    private Integer quantity;

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
}

package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.Quotation;
import com.vendorbridge.entity.QuotationItem;

@Repository
public interface QuotationItemDAO extends JpaRepository<QuotationItem, Long> {
    List<QuotationItem> findByQuotationAndActive(Quotation quotation, Boolean active);
}

package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.Quotation;
import com.vendorbridge.entity.RFQ;
import com.vendorbridge.entity.Vendor;

@Repository
public interface QuotationDAO extends JpaRepository<Quotation, Long> {
    Quotation findByRfqAndVendorAndActive(RFQ rfq, Vendor vendor, Boolean active);

    List<Quotation> findByRfqAndActive(RFQ rfq, Boolean active);

    List<Quotation> findByVendorAndActive(Vendor vendor, Boolean active);
}

package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.RFQ;
import com.vendorbridge.entity.RFQVendorMapping;
import com.vendorbridge.entity.Vendor;

@Repository
public interface RFQVendorMappingDAO extends JpaRepository<RFQVendorMapping, Long> {
    List<RFQVendorMapping> findByRfqAndActive(RFQ rfq, Boolean active);

    RFQVendorMapping findByRfqAndVendorAndActive(RFQ rfq, Vendor vendor, Boolean active);

    List<RFQVendorMapping> findByVendorAndActive(Vendor vendor, Boolean active);
}

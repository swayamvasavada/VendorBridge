package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.RFQ;
import com.vendorbridge.entity.RFQItemMapping;

@Repository
public interface RFQItemMappingDAO extends JpaRepository<RFQItemMapping, Long> {
    List<RFQItemMapping> findByRfqAndActive(RFQ rfq, Boolean active);
}

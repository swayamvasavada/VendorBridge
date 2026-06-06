package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.RFQ;
import com.vendorbridge.util.RFQStatus;

@Repository
public interface RFQDAO extends JpaRepository<RFQ, Long> {
    List<RFQ> findByStatusAndActive(RFQStatus status, Boolean active);
}

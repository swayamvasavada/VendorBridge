package com.vendorbridge.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.Vendor;

@Repository
public interface VendorDAO extends JpaRepository<Vendor, Long>{
    
}

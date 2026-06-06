package com.vendorbridge.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vendorbridge.entity.Vendor;
import com.vendorbridge.entity.User;

@Repository
public interface VendorDAO extends JpaRepository<Vendor, Long>{
    List<Vendor> findByActive(Boolean active);

    List<Vendor> findByCategoryAndActive(String category, Boolean active);

    List<Vendor> findByUser_UserIDInAndActive(List<Long> vendorIDs, Boolean active);

    Vendor findByUserAndActive(User user, Boolean active);
}

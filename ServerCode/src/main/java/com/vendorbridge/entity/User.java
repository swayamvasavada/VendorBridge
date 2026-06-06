package com.vendorbridge.entity;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.vendorbridge.util.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "USERS")
public class User implements UserDetails {

	private static final long serialVersionUID = 1L;

	// No Args constructor for Hibernate
	public User() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "UserID")
	private Long userID;

	@Column(name = "Email", unique = true, nullable = false)
	private String email;

	@Column(name = "Name", nullable = false)
	private String name;

	@Column(name = "Password", nullable = false)
	private String password;

	@Column(name = "PhoneNo")
	private String phoneNo;

	@Enumerated(EnumType.STRING)
	@Column(name = "Role", nullable = false)
	private UserRole role;
	
	@Column(name = "IsVerified")
	private Boolean isVerified = false;

	@Column(name = "IsEnabled")
	private Boolean isEnabled = false; // For enabling/disabling user by admin without deleting the account

	@Column(name = "Active")
	private Boolean active = true;

	@Column(name = "CreatedAt")
	private Date createdAt;

	@Column(name = "ModifiedAt")
	private Date modifiedAt;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	// Added getUsername function to fetch email beacuse Spring Security allows
	// custom user config using getUsername
	public String getUsername() {
		return this.email;
	}

	public Long getUserID() {
		return userID;
	}

	public void setUserID(Long userID) {
		this.userID = userID;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public Boolean getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(Boolean isVerified) {
		this.isVerified = isVerified;
	}

	public Boolean getIsEnabled() {
		return isEnabled;
	}

	public void setIsEnabled(Boolean isEnabled) {
		this.isEnabled = isEnabled;
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

	public @Nullable String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setRole(UserRole role) {
		this.role = role;
	}

	public UserRole getRole() {
		return this.role;
	}
}

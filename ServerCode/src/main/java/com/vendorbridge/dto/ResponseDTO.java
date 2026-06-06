package com.vendorbridge.dto;

public class ResponseDTO {
	private Boolean success;
	private Object serviceResult;
	private String message;
	
	public Boolean getSuccess() {
		return success;
	}
	
	public void setSuccess(Boolean success) {
		this.success = success;
	}
	
	public Object getServiceResult() {
		return serviceResult;
	}
	
	public void setServiceResult(Object serviceResult) {
		this.serviceResult = serviceResult;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
}

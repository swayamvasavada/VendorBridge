package com.vendorbridge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vendorbridge.dto.RFQDTO;
import com.vendorbridge.dto.ResponseDTO;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.service.RFQService;
import com.vendorbridge.util.RFQStatus;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/rfq")
@CrossOrigin(allowedHeaders = "*", origins = "*")
public class RFQController {

    @Autowired
    private RFQService rfqService;

    @Operation(summary = "Fetch active vendors for RFQ")
    @GetMapping("/fetchVendors")
    public ResponseEntity<ResponseDTO> fetchVendors(@RequestParam(required = false) String category) {
        System.out.println("Entering into RFQController -> fetchVendors");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.fetchVendors(category));
            responseDTO.setMessage("Vendors fetched successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to fetch vendors");
            responseDTO.setMessage("Failed to fetch vendors");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> fetchVendors");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Add RFQ")
    @PostMapping("/addRFQ")
    public ResponseEntity<ResponseDTO> addRFQ(@RequestBody RFQDTO rfqDTO) {
        System.out.println("Entering into RFQController -> addRFQ");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.addRFQ(rfqDTO));
            responseDTO.setMessage("RFQ saved successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(400));
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to save RFQ");
            responseDTO.setMessage("Failed to save RFQ");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> addRFQ");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Update RFQ")
    @PutMapping("/updateRFQ")
    public ResponseEntity<ResponseDTO> updateRFQ(@RequestBody RFQDTO rfqDTO) {
        System.out.println("Entering into RFQController -> updateRFQ");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.updateRFQ(rfqDTO));
            responseDTO.setMessage("RFQ updated successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(400));
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to update RFQ");
            responseDTO.setMessage("Failed to update RFQ");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> updateRFQ");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Fetch RFQ detail")
    @GetMapping("/fetchRFQDetail")
    public ResponseEntity<ResponseDTO> fetchRFQDetail(@RequestParam Long rfqID) {
        System.out.println("Entering into RFQController -> fetchRFQDetail");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.fetchRFQDetail(rfqID));
            responseDTO.setMessage("RFQ detail fetched successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(400));
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to fetch RFQ detail");
            responseDTO.setMessage("Failed to fetch RFQ detail");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> fetchRFQDetail");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Fetch RFQs for approval")
    @GetMapping("/fetchRFQsForApproval")
    public ResponseEntity<ResponseDTO> fetchRFQsForApproval() {
        System.out.println("Entering into RFQController -> fetchRFQsForApproval");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.fetchRFQsForApproval());
            responseDTO.setMessage("RFQs for approval fetched successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to fetch RFQs for approval");
            responseDTO.setMessage("Failed to fetch RFQs for approval");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> fetchRFQsForApproval");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Fetch RFQs for current vendor")
    @GetMapping("/fetchVendorRFQs")
    public ResponseEntity<ResponseDTO> fetchVendorRFQs() {
        System.out.println("Entering into RFQController -> fetchVendorRFQs");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.fetchVendorRFQs());
            responseDTO.setMessage("Vendor RFQs fetched successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(400));
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to fetch vendor RFQs");
            responseDTO.setMessage("Failed to fetch vendor RFQs");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> fetchVendorRFQs");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Update RFQ status")
    @PatchMapping("/updateRFQStatus")
    public ResponseEntity<ResponseDTO> updateRFQStatus(@RequestParam Long rfqID, @RequestParam RFQStatus status) {
        System.out.println("Entering into RFQController -> updateRFQStatus");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(rfqService.updateRFQStatus(rfqID, status));
            responseDTO.setMessage("RFQ status updated successfully");
            responseDTO.setSuccess(Boolean.TRUE);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(404));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            responseDTO.setServiceResult(e.getMessage());
            responseDTO.setMessage(e.getMessage());
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(400));
        } catch (Exception e) {
            e.printStackTrace();
            responseDTO.setServiceResult("Failed to update RFQ status");
            responseDTO.setMessage("Failed to update RFQ status");
            responseDTO.setSuccess(Boolean.FALSE);

            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from RFQController -> updateRFQStatus");
        return ResponseEntity.ok(responseDTO);
    }
}

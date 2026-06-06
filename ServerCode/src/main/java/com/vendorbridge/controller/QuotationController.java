package com.vendorbridge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vendorbridge.dto.QuotationDTO;
import com.vendorbridge.dto.ResponseDTO;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.service.QuotationService;
import com.vendorbridge.util.QuotationStatus;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/quotation")
@CrossOrigin(allowedHeaders = "*", origins = "*")
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    @Operation(summary = "Submit quotation")
    @PostMapping("/submitQuotation")
    public ResponseEntity<ResponseDTO> submitQuotation(@RequestBody QuotationDTO quotationDTO) {
        System.out.println("Entering into QuotationController -> submitQuotation");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(quotationService.submitQuotation(quotationDTO));
            responseDTO.setMessage("Quotation submitted successfully");
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
            responseDTO.setServiceResult("Failed to submit quotation");
            responseDTO.setMessage("Failed to submit quotation");
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from QuotationController -> submitQuotation");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Fetch quotation")
    @GetMapping("/fetchQuotation")
    public ResponseEntity<ResponseDTO> fetchQuotation(@RequestParam Long quotationID) {
        System.out.println("Entering into QuotationController -> fetchQuotation");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(quotationService.fetchQuotation(quotationID));
            responseDTO.setMessage("Quotation fetched successfully");
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
            responseDTO.setServiceResult("Failed to fetch quotation");
            responseDTO.setMessage("Failed to fetch quotation");
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from QuotationController -> fetchQuotation");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Fetch quotations")
    @GetMapping("/fetchQuotations")
    public ResponseEntity<ResponseDTO> fetchQuotations(@RequestParam(required = false) Long rfqID) {
        System.out.println("Entering into QuotationController -> fetchQuotations");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(quotationService.fetchQuotations(rfqID));
            responseDTO.setMessage("Quotations fetched successfully");
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
            responseDTO.setServiceResult("Failed to fetch quotations");
            responseDTO.setMessage("Failed to fetch quotations");
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from QuotationController -> fetchQuotations");
        return ResponseEntity.ok(responseDTO);
    }

    @Operation(summary = "Update quotation status")
    @PatchMapping("/updateQuotationStatus")
    public ResponseEntity<ResponseDTO> updateQuotationStatus(@RequestParam Long quotationID,
            @RequestParam QuotationStatus status) {
        System.out.println("Entering into QuotationController -> updateQuotationStatus");

        ResponseDTO responseDTO = new ResponseDTO();
        try {
            responseDTO.setServiceResult(quotationService.updateQuotationStatus(quotationID, status));
            responseDTO.setMessage("Quotation status updated successfully");
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
            responseDTO.setServiceResult("Failed to update quotation status");
            responseDTO.setMessage("Failed to update quotation status");
            responseDTO.setSuccess(Boolean.FALSE);
            return new ResponseEntity<>(responseDTO, HttpStatusCode.valueOf(500));
        }

        System.out.println("Exiting from QuotationController -> updateQuotationStatus");
        return ResponseEntity.ok(responseDTO);
    }
}

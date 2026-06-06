import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";
import { venderordetails } from "../apiPath";

export interface Vendor {
  _id: string;
  id?: string | number;
  name: string;
  category: string;
  gst: string;
  contact: string; // Used by frontend for Phone numbers
  address: string;
  status?: string;
  isVerified?: boolean;
  isEnabled?: boolean;
  email?: string;
  userID?: number;
  vendorID?: number;
}

interface VendorStore {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  fetchVendors: () => Promise<void>;
}

let fetchVendorsRequest: Promise<void> | null = null;

const getAuthHeaders = () => {
  const { user } = useAuthStore.getState();
  const token = user?.token;
  if (!token) {
    throw new Error("Authentication token missing.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const useVendorStore = create<VendorStore>((set) => ({
  vendors: [],
  loading: false,
  error: null,

  fetchVendors: () => {
    if (fetchVendorsRequest) {
      return fetchVendorsRequest;
    }

    set({ loading: true, error: null });

    fetchVendorsRequest = Promise.resolve()
      .then(() =>
        axios.get(venderordetails, {
          headers: getAuthHeaders(),
        })
      )
      .then((response) => {
        let incomingVendors: any = response.data.serviceResult ?? response.data;

        if (Array.isArray(incomingVendors)) {
          // Standard Array
        } else if (incomingVendors && Array.isArray(incomingVendors.vendors)) {
          incomingVendors = incomingVendors.vendors;
        } else if (incomingVendors && Array.isArray(incomingVendors.data)) {
          incomingVendors = incomingVendors.data;
        } else {
          const foundArray = Object.values(incomingVendors || {}).find((v) =>
            Array.isArray(v)
          );
          incomingVendors = foundArray ?? [];
        }

        // Map and normalize keys according to your exact backend payload template
        const normalizedVendors: Vendor[] = incomingVendors.map((vendor: any) => {
          // Fallback ID checking using vendorID or userID from API
          const resolvedId = String(vendor.vendorID ?? vendor.userID ?? vendor._id ?? vendor.id ?? Date.now());
          
          return {
            ...vendor,
            _id: resolvedId,
            id: resolvedId,
            
            // Prioritize companyName if available, fallback to name string
            name: vendor.companyName ?? vendor.name ?? "Unknown Vendor",
            
            category: vendor.category ?? "General",
            
            // Map backend "gstNumber" field securely to "gst"
            gst: vendor.gstNumber ?? vendor.gst ?? vendor.gstin ?? "N/A", 
            
            // FIXED: Explicitly captures backend "phoneNo" property
            contact: String(
              vendor.phoneNo ?? 
              vendor.contact ?? 
              vendor.phone ?? 
              vendor.phoneNumber ?? 
              "N/A"
            ),
            
            // Handle null addresses gracefully
            address: vendor.address ?? "No address registered",
          };
        });

        set({ vendors: normalizedVendors });
      })
      .catch((error: any) => {
        set({
          error: error?.response?.data?.message || "Failed to fetch vendors",
        });
        throw error;
      })
      .finally(() => {
        set({ loading: false });
        fetchVendorsRequest = null;
      });

    return fetchVendorsRequest;
  },
}));

export default useVendorStore;
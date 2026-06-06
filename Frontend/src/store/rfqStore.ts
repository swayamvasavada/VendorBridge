import axios from "axios";
import { create } from "zustand";
import {
  fetchRFQsForApproval,
  fetchVendorRFQs as fetchVendorRFQsPath,
  rfq,
  updateRFQStatus,
} from "../apiPath";
import { useAuthStore } from "./authStore";

export type RFQStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "OPEN"
  | "CLOSED";

export interface RFQItemPayload {
  rfqItemMappingID: number;
  itemName: string;
  unit: string;
  quantity: number;
}

export interface RFQPayload {
  rfqID: number;
  title: string;
  description: string;
  deadline: string;
  status: RFQStatus;
  items: RFQItemPayload[];
  vendorIDs: number[];
}

export interface VendorRFQ {
  rfqID: number;
  title: string;
  description: string;
  deadline: string;
  status: RFQStatus | string;
  items: RFQItemPayload[];
  vendorIDs?: number[];
}

interface RFQState {
  loadingStatus: RFQStatus | null;
  vendorRFQs: VendorRFQ[];
  vendorRFQsLoading: boolean;
  approvalRFQs: VendorRFQ[];
  approvalRFQsLoading: boolean;
  statusUpdateLoading: Record<number, boolean>;
  createRFQ: (payload: RFQPayload) => Promise<unknown>;
  fetchVendorRFQs: () => Promise<void>;
  fetchRFQsForApproval: () => Promise<void>;
  updateRFQStatus: (rfqID: number, status: "OPEN" | "REJECTED") => Promise<void>;
}

const getAuthHeaders = () => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("Authentication token missing.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const normalizeRFQs = (data: any): VendorRFQ[] => {
  let rfqs = data?.serviceResult ?? data;

  if (Array.isArray(rfqs)) {
    // already normalized enough to map below
  } else if (Array.isArray(rfqs?.rfqs)) {
    rfqs = rfqs.rfqs;
  } else if (Array.isArray(rfqs?.data)) {
    rfqs = rfqs.data;
  } else {
    const foundArray = Object.values(rfqs || {}).find((value) =>
      Array.isArray(value),
    );
    rfqs = foundArray ?? [];
  }

  return rfqs.map((item: any) => ({
    ...item,
    rfqID: item.rfqID ?? item.rfqId ?? item.id ?? item.RFQID ?? 0,
    title: item.title ?? item.rfqTitle ?? item.name ?? "Untitled RFQ",
    description: item.description ?? "",
    deadline: item.deadline ?? item.dueDate ?? item.submissionDeadline ?? "",
    status: item.status ?? "PENDING",
    items: Array.isArray(item.items) ? item.items : [],
    vendorIDs: item.vendorIDs ?? item.vendorIds,
  }));
};

export const useRFQStore = create<RFQState>((set) => ({
  loadingStatus: null,
  vendorRFQs: [],
  vendorRFQsLoading: false,
  approvalRFQs: [],
  approvalRFQsLoading: false,
  statusUpdateLoading: {},

  createRFQ: async (payload) => {
    set({ loadingStatus: payload.status });

    try {
      const response = await axios.post(rfq, payload, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } finally {
      set({ loadingStatus: null });
    }
  },

  fetchVendorRFQs: async () => {
    set({ vendorRFQsLoading: true });

    try {
      const response = await axios.get(fetchVendorRFQsPath, {
        headers: getAuthHeaders(),
      });

      set({ vendorRFQs: normalizeRFQs(response.data) });
    } finally {
      set({ vendorRFQsLoading: false });
    }
  },

  fetchRFQsForApproval: async () => {
    set({ approvalRFQsLoading: true });

    try {
      const response = await axios.get(fetchRFQsForApproval, {
        headers: getAuthHeaders(),
      });

      set({ approvalRFQs: normalizeRFQs(response.data) });
    } finally {
      set({ approvalRFQsLoading: false });
    }
  },

  updateRFQStatus: async (rfqID, status) => {
    set((state) => ({
      statusUpdateLoading: {
        ...state.statusUpdateLoading,
        [rfqID]: true,
      },
    }));

    try {
      await axios.patch(
        updateRFQStatus,
        {},
        {
          headers: getAuthHeaders(),
          params: { rfqID, status },
        },
      );

      set((state) => ({
        approvalRFQs: state.approvalRFQs.filter((rfq) => rfq.rfqID !== rfqID),
        vendorRFQs: state.vendorRFQs.map((rfq) =>
          rfq.rfqID === rfqID ? { ...rfq, status } : rfq,
        ),
      }));
    } finally {
      set((state) => ({
        statusUpdateLoading: {
          ...state.statusUpdateLoading,
          [rfqID]: false,
        },
      }));
    }
  },
}));

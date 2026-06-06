import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";
import { baseURL } from "../apiPath";

export type UserRole = "ADMIN" | "PROCUREMENT_OFFICER" | "VENDOR" | "APPROVER";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  enabled: boolean;
}

type UserApiRecord = Omit<UserRecord, "id" | "enabled"> & {
  id?: number;
  userID?: number;
  userId?: number;
  UserID?: number;
  UserId?: number;
  enabled?: boolean;
  isEnabled?: boolean;
};

interface UserState {
  users: UserRecord[];
  toggleLoading: Record<number, boolean>;
  deleteLoading: Record<number, boolean>;
  fetchLoading: boolean;
  setUsers: (users: UserRecord[]) => void;
  fetchUsers: () => Promise<void>;
  toggleUserEnabled: (userId: number, isEnabled: boolean) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
}

let fetchUsersRequest: Promise<void> | null = null;

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

export const useUserStore = create<UserState>((set) => ({
  users: [],
  toggleLoading: {},
  deleteLoading: {},
  fetchLoading: true,

  setUsers: (users) => set({ users }),

  fetchUsers: () => {
    if (fetchUsersRequest) {
      return fetchUsersRequest;
    }

    set({ fetchLoading: true });
    fetchUsersRequest = Promise.resolve()
      .then(() =>
        axios.get(`${baseURL}/api/user/fetchUsers`, {
          headers: getAuthHeaders(),
        }),
      )
      .then((response) => {
        // Normalize API response to an array of users.
        let users: any = response.data.serviceResult ?? response.data;

        if (Array.isArray(users)) {
          // already an array
        } else if (users && Array.isArray(users.users)) {
          users = users.users;
        } else if (users && Array.isArray(users.data)) {
          users = users.data;
        } else {
          // fallback: try to find first array value in response
          const foundArray = Object.values(users || {}).find((v) =>
            Array.isArray(v),
          );
          users = foundArray ?? [];
        }

        const normalizedUsers: UserRecord[] = users.map(
          (user: UserApiRecord) => ({
            ...user,
            id:
              user.userID ??
              user.userId ??
              user.UserID ??
              user.UserId ??
              user.id,
            enabled: user.isEnabled ?? user.enabled ?? false,
          }),
        );

        set({ users: normalizedUsers });
      })
      .finally(() => {
        set({ fetchLoading: false });
        fetchUsersRequest = null;
      });

    return fetchUsersRequest;
  },

  toggleUserEnabled: async (userId, isEnabled) => {
    if (userId == null) {
      throw new Error("User ID missing.");
    }

    set((state) => ({
      toggleLoading: {
        ...state.toggleLoading,
        [userId]: true,
      },
    }));

    try {
      await axios.patch(
        `${baseURL}/api/user/toggleUserEnabled?userId=${userId}&isEnabled=${isEnabled}`,
        {},
        {
          headers: getAuthHeaders(),
        },
      );

      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                enabled: isEnabled,
              }
            : user,
        ),
      }));
    } catch (error) {
      throw error;
    } finally {
      set((state) => ({
        toggleLoading: {
          ...state.toggleLoading,
          [userId]: false,
        },
      }));
    }
  },

  deleteUser: async (userId) => {
    if (userId == null) {
      throw new Error("User ID missing.");
    }

    set((state) => ({
      deleteLoading: {
        ...state.deleteLoading,
        [userId]: true,
      },
    }));
    try {
      await axios.delete(`${baseURL}/api/user/deleteUser?userId=${userId}`, {
        headers: getAuthHeaders(),
      });

      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      throw error;
    } finally {
      set((state) => ({
        deleteLoading: {
          ...state.deleteLoading,
          [userId]: false,
        },
      }));
    }
  },
}));

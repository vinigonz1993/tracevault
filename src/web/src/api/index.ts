import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChangeLog {
  id: string;
  objectId: string;
  objectType: string;
  operation: string;
  previousState?: Record<string, unknown> | null;
  currentState: Record<string, unknown>;
  userId?: string | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GetChangeLogsParams {
  page?: number;
  pageSize?: number;
  objectId?: string;
  objectType?: string;
  userId?: string;
  operation?: string;
}

export interface ChangeLogsResponse {
  data: ChangeLog[];
  pagination: Pagination;
}

export interface ObjectTypesResponse {
  data: string[];
}

export const getChangeLogs = async (
  params: GetChangeLogsParams = {},
): Promise<ChangeLogsResponse> => {
  const response = await api.get<ChangeLogsResponse>("/change-logs", {
    params,
  });

  return response.data;
};

export const getObjectTypes = async (): Promise<string[]> => {
  const response = await api.get<ObjectTypesResponse>("/change-logs/object-types");
  return response.data.data;
};

export default api;
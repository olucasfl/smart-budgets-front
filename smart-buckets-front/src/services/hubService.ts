import { api } from "../api/axios";
import type { HubRequest } from "../dtos/HubRequest";
import type { HubSummaryResponse } from "../dtos/HubSummaryResponse";
import type { HubDetailResponse } from "../dtos/HubDetailResponse";

export const hubService = {
  create: (data: HubRequest) =>
    api.post<HubSummaryResponse>("/hub/create", data),

  listSummary: () =>
    api.get<HubSummaryResponse[]>("/hub/list-summary"),

  findDetail: (id: number) =>
    api.get<HubDetailResponse>(`/hub/list-detail/${id}`),

  update: (id: number, data: HubRequest) =>
    api.put<HubSummaryResponse>(`/hub/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`/hub/delete/${id}`),
};

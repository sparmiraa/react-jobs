import { privateInstance } from "../axios";
import type {
  GetMyVacanciesResponse,
  VacancyCandidateListResponse,
  VacancyDetails,
  VacancyUpsertDto,
} from "./vacancyTypes";

export type VacancyListItemDto = {
  id: number;
  title: string;
  employerId: number | null;
  employerName: string | null;
  cityId: number | null;
  cityName: string | null;
  salaryFrom: number | null;
  salaryTo: number | null;
  createdAt: string;
  skills: { id: number; name: string }[];
};

export type VacancyListResponse = {
  items: VacancyListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type VacancyViewDto = {
  id: number;
  title: string;

  employerId: number | null;
  employerName: string | null;
  employerShortBio?: string | null;
  employerBio?: string | null;
  employerEmployeesCount?: number | null;

  cityId: number | null;
  cityName: string | null;

  salaryFrom: number | null;
  salaryTo: number | null;

  requiredText: string | null;
  plusText: string | null;
  responsibilities: string | null;
  assumptions: string | null;

  createdAt: string;
  skills: { id: number; name: string }[];
};

export type VacancySearchParams = {
  page?: number;
  limit?: number;
  q?: string;
  cityId?: number | null;
  salaryFrom?: number | null;
  salaryTo?: number | null;
  skillIds?: number[];
};

function buildQuery(params: VacancySearchParams) {
  const sp = new URLSearchParams();

  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));

  const q = params.q?.trim();
  if (q) sp.set("q", q);

  if (params.cityId) sp.set("cityId", String(params.cityId));

  if (
    params.salaryFrom !== null &&
    params.salaryFrom !== undefined &&
    params.salaryFrom !== 0
  ) {
    sp.set("salaryFrom", String(params.salaryFrom));
  }
  if (
    params.salaryTo !== null &&
    params.salaryTo !== undefined &&
    params.salaryTo !== 0
  ) {
    sp.set("salaryTo", String(params.salaryTo));
  }

  if (params.skillIds && params.skillIds.length > 0) {
    sp.set("skillIds", params.skillIds.join(",")); // backend _parseSkillIds поддерживает строку
  }

  return sp.toString();
}

export const vacancyApi = {
  async getAllByEmployerId(
    employerId: number,
    params?: { page?: number; limit?: number },
  ) {
    const { data } = await privateInstance.get<GetMyVacanciesResponse>(
      `/vacancies/employer/${employerId}`,
      {
        params,
      },
    );
    return data;
  },

  async getByIdForEdit(id: number) {
    const { data } = await privateInstance.get<VacancyDetails>(
      `/vacancies/${id}/edit`,
    );
    return data;
  },

  async create(dto: VacancyUpsertDto) {
    const { data } = await privateInstance.post(`/vacancies`, dto);
    return data;
  },

  async update(id: number, dto: VacancyUpsertDto) {
    const { data } = await privateInstance.put(`/vacancies/${id}`, dto);
    return data;
  },

  async changeStatus(id: number, isActive: boolean) {
    const { data } = await privateInstance.patch(`/vacancies/${id}/status`, {
      isActive,
    });
    return data;
  },

  async getAllForCandidate(
    params: VacancySearchParams,
  ): Promise<VacancyListResponse> {
    const qs = buildQuery(params);
    const { data } = await privateInstance.get(
      `/vacancies${qs ? `?${qs}` : ""}`,
    );
    return data;
  },

  async getPublicById(id: number): Promise<VacancyViewDto> {
    const { data } = await privateInstance.get(`/vacancies/${id}`);
    return data;
  },

  async getAllPublicByEmployerId(
    employerId: number,
    params?: { page?: number; limit?: number },
  ): Promise<VacancyCandidateListResponse> {
    const { data } = await privateInstance.get(
      `/vacancies/company/${employerId}`,
      { params },
    );
    return data as VacancyCandidateListResponse;
  },
};

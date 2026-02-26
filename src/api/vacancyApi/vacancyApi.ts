import { privateInstance } from "../axios";
import type {
  GetMyVacanciesResponse,
  VacancyDetails,
  VacancyUpsertDto,
} from "./vacancyTypes";

export const vacancyApi = {
  async getAllByEmployerId(
    employerId: number,
    params?: { page?: number; limit?: number }
  ) {
    const { data } = await privateInstance.get<GetMyVacanciesResponse>(
      `/vacancies/employer/${employerId}`,
      {
        params,
      }
    );
    return data;
  },

  async getByIdForEdit(id: number) {
    const { data } = await privateInstance.get<VacancyDetails>(
      `/vacancies/${id}/edit`
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
};

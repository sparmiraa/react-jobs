import { privateInstance } from "../axios";
import type {
  EmployerProfileDTO,
  SearchParams,
  UpdateEmployerBio,
  UpdateEmployerInfo,
} from "./employerTypes";

export type EmployerPublicDto = {
  id: number;
  name: string;
  shortBio: string | null;
  bio: string | null;
  cityId: number | null;
  cityName: string | null;
  employeesCount: number | null;
  type: { id: number; name: string } | null;
  vacanciesCount: number; // активные вакансии
};

export const employerApi = {
  getCurrentEmployerProfile: async () => {
    const responseDto =
      await privateInstance.get<EmployerProfileDTO>("/employer");
    return responseDto.data as EmployerProfileDTO;
  },

  updateEmployerInfo: async (data: UpdateEmployerInfo) => {
    await privateInstance.patch<void>("/employer/info", data);
  },

  updateEmployerBio: async (data: UpdateEmployerBio) => {
    await privateInstance.patch<void>("/employer/bio", data);
  },

  search: async (params: SearchParams) => {
    const res = await privateInstance.get("/employer/search", { params });
    return res.data;
  },

  getPublicById: async (id: number): Promise<EmployerPublicDto> => {
    const { data } = await privateInstance.get(`/employer/${id}`);
    return data as EmployerPublicDto;
  },
};

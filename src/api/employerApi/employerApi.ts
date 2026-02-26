import { privateInstance } from "../axios";
import {
  EmployerProfileDTO,
  SearchParams,
  UpdateEmployerBio,
  UpdateEmployerInfo,
} from "./employerTypes";

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
};

import {publicInstance} from "../axios";

export const mainApi = {
  getCities: async () => {
    const responseDto = await publicInstance.get<City[]>("/main/cities");
    return responseDto.data as City[];
  },

  getSkills: async () => {
    const responseDto = await publicInstance.get<Skill[]>("/main/skills");
    return responseDto.data as Skill[];
  },

  getEmployerTypes: async () => {
    const responseDto = await publicInstance.get<EmployerType[]>("/main/employer-type");
    return responseDto.data as EmployerType[];
  },
}
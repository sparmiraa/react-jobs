import {privateInstance} from "../axios";
import {
  CandidateExperienceResponse,
  CandidateProfileDTO,
  CreateCandidateExperience,
  UpdateCandidateBio, UpdateCandidateExperience,
  UpdateCandidateInfo
} from "./candidateTypes";

export const candidateApi = {
  getCurrentCandidateProfile: async () => {
    const responseDto = await privateInstance.get<CandidateProfileDTO>("/candidates");
    return responseDto.data as CandidateProfileDTO;
  },

  updateCandidateInfo: async (data: UpdateCandidateInfo) => {
    await privateInstance.patch<void>("/candidates/info", data);
  },

  updateCandidateBio: async (data: UpdateCandidateBio) => {
    await privateInstance.patch<void>("/candidates/bio", data);
  },

  createCandidateExperience: async (data: CreateCandidateExperience) => {
    const responseDto = await privateInstance
      .post<CandidateExperienceResponse>("/candidates/experience", data);
    return responseDto.data as CandidateExperienceResponse;
  },

  updateCandidateExperience: async (experienceId: number, data: UpdateCandidateExperience) => {
    const responseDto = await privateInstance
      .put<CandidateExperienceResponse>(`/candidates/experience${experienceId}`, data);
    return responseDto.data as CandidateExperienceResponse;
  },

  deleteCandidateExperience: async (experienceId: number) => {
    await privateInstance.delete<void>(`/candidates/experience/${experienceId}`);
  },

  changeActiveStatus: async (isActive: boolean) => {
    await privateInstance.patch<void>(`/candidates/active`, {isActive});
  },

}
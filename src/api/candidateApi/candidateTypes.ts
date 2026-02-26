export type CandidateProfileDTO = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  user_id: number;
  city_id: number;
  bio: string | null;
  salary_from: number | null;
  salary_to: number | null;
  birthday: string | null;
  is_active: boolean;
  is_deleted: boolean;
  createdAt: string;

  experience: CandidateExperienceResponse[];
  skillsId: number[];
}

export type UpdateCandidateInfo = {
  name: string;
  phoneNumber: string;
  cityId: number;
  birthday: string;
}

export type UpdateCandidateBio = {
  bio: string;
  salaryFrom: number | string;
  salaryTo: number | string;
  skillsId: number[];
}

export type CreateCandidateExperience = {
  companyName: string;
  title: string;
  bio: string;
  startFrom: string;
  endTo: string | null
}

export type UpdateCandidateExperience = CreateCandidateExperience;

export type CandidateExperienceResponse = CreateCandidateExperience & { id: number };
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type VacancyListItem = {
  id: number;
  title: string;
  cityId: number | null;
  cityName: string | null;
  salaryFrom: number | null;
  salaryTo: number | null;
  isActive: boolean;
  createdAt: string;
};

export type GetMyVacanciesResponse = {
  items: VacancyListItem[];
  pagination: Pagination;
};

export type VacancyDetails = {
  id: number;
  employer_id: number;
  title: string;
  city_id: number | null;
  salary_from: number | null;
  salary_to: number | null;
  required_text: string | null;
  plus_text: string | null;
  responsibilities: string | null;
  assumptions: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  skills: number[];
};

export type VacancyUpsertDto = {
  title: string;
  cityId: number | null;
  salaryFrom: number | null;
  salaryTo: number | null;
  requiredText: string | null;
  plusText: string | null;
  responsibilities: string | null;
  assumptions: string | null;
  skillIds: number[];
};

export type VacancySkillDto = { id: number; name: string };

export type VacancyCandidateListItem = {
  id: number;
  title: string;

  employerId: number | null;
  employerName: string | null;

  cityId: number | null;
  cityName: string | null;

  salaryFrom: number | null;
  salaryTo: number | null;

  createdAt: string;
  skills: VacancySkillDto[];
};

export type VacancyCandidateListResponse = {
  items: VacancyCandidateListItem[];
  pagination: Pagination;
};

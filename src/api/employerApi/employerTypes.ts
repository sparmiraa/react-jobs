export type EmployerProfileDTO = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  user_id: number;
  city_id: number;
  type_id: number;
  bio: string | null;
  shortBio: string | null;
  employeesCount: number | null;
}

export type UpdateEmployerInfo = {
  name: string;
  phoneNumber: string;
  cityId: number;
  typeId: number
}

export type UpdateEmployerBio = {
  employeesCount: number | string;
  shortBio: string;
  bio: string;
}


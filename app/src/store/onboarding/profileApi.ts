import {apiSlice} from "../api/apiSlice"

interface ProfileData{
    goal:string;
    gender:string;
    age:number;
    height_cm:number;
    weight_kg:number;
    activity_level:string;
    target_weight_kg:number;
    pace:string;
    unit_system:"metric"|"imperial";
}
interface ProfileResponse{
  message: string;
  profile: ProfileData;
}

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProfile: builder.mutation<ProfileResponse, ProfileData>({
      query: (body) => ({
        url: "/api/accounts/profile/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateProfileMutation,
} = profileApi;
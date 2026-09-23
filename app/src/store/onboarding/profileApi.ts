import {apiSlice} from "../api/apiSlice"

export interface ProfileData{
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
    getProfile: builder.query<ProfileData, void>({
      query: () => ({
        url: "/api/accounts/profile/",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    createProfile: builder.mutation<ProfileResponse, ProfileData>({
      query: (body) => ({
        url: "/api/accounts/profile/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile", "Nutrition", "Tracking"],
    }),
    updateProfile: builder.mutation<ProfileResponse, Partial<ProfileData>>({
      query: (body) => ({
        url: "/api/accounts/profile/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile", "Nutrition", "Tracking"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} = profileApi;

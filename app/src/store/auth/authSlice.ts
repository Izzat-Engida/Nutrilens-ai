import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User{
    id:number;
    first_name:string;
    last_name:string;
    email:string;
}
interface AuthState{
    accessToken:string|null;
    refreshToken:string|null;
  user:User |null;
  isRestoring: boolean;
}

const initialState:AuthState={
    accessToken:null,
    refreshToken:null,
    user:null,
    isRestoring:true,
};

const authSlice=createSlice({
    name:'auth',
    initialState,

    reducers:{
        setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    )=>{
        state.accessToken=action.payload.accessToken;
        state.refreshToken=action.payload.refreshToken;
        state.user=action.payload.user;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    finishAuthRestoration: (state) => {
      state.isRestoring = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout:(state)=>{
        state.accessToken=null;
        state.refreshToken=null;
        state.user=null;
        state.isRestoring=false;
    }
    }
})

export const { setCredentials, setAccessToken, finishAuthRestoration, setUser, logout } = authSlice.actions;

export default authSlice.reducer;

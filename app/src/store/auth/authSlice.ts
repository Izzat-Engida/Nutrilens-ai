import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User{
    id:number;
    first_name:string;
    last_name:string;
    email:string;
}
interface AuthState{
    accessToken:string|null;
    refreshToken:string|null;
    user:User |null;
}

const initialState:AuthState={
    accessToken:null,
    refreshToken:null,
    user:null
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
    logout:(state)=>{
        state.accessToken=null;
        state.refreshToken=null;
        state.user=null;
    }
    }
})

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
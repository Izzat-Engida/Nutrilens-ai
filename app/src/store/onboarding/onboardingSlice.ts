import {createSlice,PayloadAction} from '@reduxjs/toolkit';


interface OnboardingState{
    goal:string|null;
    gender:string|null;
    age:number|null;
    height_cm:number|null;
    weight_kg:number|null;
    activity_level:string|null;
    target_weight_kg:number|null;
    pace:string|null;
    unit_system:"metric"|"imperial";
}

const initialState:OnboardingState={
    goal:null,
    gender:null,
    age:null,
    height_cm:null,
    weight_kg:null,
    activity_level:null,
    target_weight_kg:null,
    pace:null,
    unit_system:"metric",
}

const onboardingSlice=createSlice({
    name:'onboarding',
    initialState,
    reducers:{
        setOnboardingData:(
            state,
            action: PayloadAction<Partial<OnboardingState>>
        )=>{
            Object.assign(state,action.payload);
        },
        clearOnboarding: (state) => {
      state.goal = null;
      state.height_cm = null;
      state.weight_kg = null;
      state.gender = null;
      state.age = null;
      state.pace=null;
      state.target_weight_kg=null;
      state.activity_level = null;
      state.unit_system = 'metric';
    },
    }
})

export const {
  setOnboardingData,
  clearOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
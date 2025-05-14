import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    userName: null,
    fullName: null,
    profilePicture: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            const { _id, userName, fullName, profilePicture } = action.payload;
            state.id = _id;
            state.userName = userName;
            state.fullName = fullName;
            state.profilePicture = profilePicture;
        },
        clearUserInfo: (state) => {
            state.id = null;
            state.userName = null;
            state.fullName = null;
            state.profilePicture = null;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;

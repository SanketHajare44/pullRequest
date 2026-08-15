import { createSlice } from "@reduxjs/toolkit";

const requeestSlice = createSlice({
    name: "request",
    initialState: [],
    reducers: {
        addRequest: (state, action) => {
            return action.payload;
        },
        removeRequest: (state, action) => {
            const newArray = state.filter(
                (request) => request._id !== action.payload
            );

            return newArray;
        },
    },
});

export const { addRequest, removeRequest } = requeestSlice.actions;

export default requeestSlice.reducer;
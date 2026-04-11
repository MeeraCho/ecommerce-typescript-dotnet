import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";

// store 만들기 
export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        [catalogApi.reducerPath]: catalogApi.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(catalogApi.middleware)
})

// 타입 정의 
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 커스텀 훅
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
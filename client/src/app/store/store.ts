import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";
import { errorApi } from "../../features/about/errorApi";
import { basketApi } from "../../features/basket/basketApi";

// store 만들기 
export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        [catalogApi.reducerPath]: catalogApi.reducer,
        [errorApi.reducerPath]: errorApi.reducer,
        [basketApi.reducerPath]: basketApi.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            catalogApi.middleware, 
            errorApi.middleware,
            basketApi.middleware,
        )
})

store.subscribe(() => {
    localStorage.setItem(
        "darkMode",
        JSON.stringify(store.getState().ui.darkMode)
    );
});

// 타입 정의 
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 커스텀 훅
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>() 
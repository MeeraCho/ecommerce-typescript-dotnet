import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

// 상품 목록 & 상세 정보를 가져오는 API를 정의
export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void>({
            query: () => ({url: 'products'}) //return object 
        }),
        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}` //return string 
        })
    })
});

// 자동 생성된 React hook을 꺼내서 export 하기
export const {useFetchProductDetailsQuery, useFetchProductsQuery} = catalogApi;

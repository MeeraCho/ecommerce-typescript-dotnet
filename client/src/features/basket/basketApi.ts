import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Item, type Basket } from "../../app/models/basket";
import type { Product } from "../../app/models/product";


export const basketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => 'basket',
            providesTags: ['Basket']
        }),
        addBasketItem: builder.mutation<Basket, { product: Product, quantity: number }>({
            query: ({ product, quantity }) => {
                return {
                    url: `basket?productId=${product.id}&quantity=${quantity}`,
                    method: 'POST'
                }
            },
            onQueryStarted: async ({product, quantity}, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        const existingItem = draft.items.find(item => item.productId === product.id);

                        if (existingItem){
                            existingItem.quantity += quantity;
                        } else {
                            draft.items.push(new Item(product, quantity));
                        }
                    })
                )
                
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            }
        }),
    })
});

export const { 
		useFetchBasketQuery, 
		useAddBasketItemMutation, 
		} = basketApi;
import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";


const customBaseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5001/api'
});

// Fake delay 
const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

// Wrapper 
export const baseQueryWithErrorHandling = async (
		args: string | FetchArgs, api: BaseQueryApi, extraOptions: object
    ) => {
    
    // fake delay to show loading spinner
    await sleep();
    
    // actural API Request 
    const result = await customBaseQuery(args, api, extraOptions);
        
    // error handling
    if (result.error) {
        const {status, data} = result.error;
        console.log({status, data});
    }

    return result;
}
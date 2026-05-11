import {
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
} from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customBaseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api",
  credentials: "include"
});

// Union type 정의 - 어떤 타입들이 가능한지 “정의” 1.string 2.object 3.validation error
type ErrorResponse = string | { title: string } | { errors: string[] };

// Fake delay
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

// Wrapper
export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  api.dispatch(startLoading());
  await sleep();
  const result = await customBaseQuery(args, api, extraOptions); // actural API Request
  api.dispatch(stopLoading());

  // error handling
  if (result.error) {
    // 에러 로그 출력
    console.log(result.error);

    // status 확인 - 만약 파싱 에러면 → 원래 status, 아니면 → 그냥 status 씀
    const originalStatus =
      result.error.status === "PARSING_ERROR" && result.error.originalStatus
        ? result.error.originalStatus
        : result.error.status;

    // 응답 데이터 Type 정의
    const responseData = result.error.data as ErrorResponse;

    // 상태 코드별 처리
    switch (originalStatus) {
      case 400:
        // type guard - 실제로 어떤 타입인지 “판별” 1.string 2.object 3.validation error
        if (typeof responseData === "string") toast.error(responseData);
        else if ("errors" in responseData) {
          throw Object.values(responseData.errors).flat().join(", ");
        } else toast.error(responseData.title);
        break;

      case 401:
        if (typeof responseData === "object" && "title" in responseData)
          toast.error(responseData.title);
        break;

      case 404:
        if (typeof responseData === "object" && "title" in responseData)
          router.navigate("/not-found");
        break;

      case 500:
        if (typeof responseData === "object")
          router.navigate("/server-error", { state: { error: responseData } });
        break;

      default:
        break;
    }
  }
  return result;
};

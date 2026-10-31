import { keepPreviousData } from "@tanstack/react-query";

/** Keep the previous page on screen while the next page loads. */
export const listQueryOptions = {
  placeholderData: keepPreviousData,
};

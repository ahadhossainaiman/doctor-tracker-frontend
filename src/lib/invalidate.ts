import type { QueryClient } from "@tanstack/react-query";

/** Doctor and patient writes also change dashboard numbers and filter options. */
export function invalidateCareQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ["doctors"] }),
    queryClient.invalidateQueries({ queryKey: ["patients"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    queryClient.invalidateQueries({ queryKey: ["meta"] }),
  ]);
}

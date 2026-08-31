import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api/v1",
  timeout: 10_000,
});

// A session can expire while the user is on the page; proxy.ts only
// re-checks on navigation, so a stale client-side query would otherwise
// just show a generic error instead of prompting a fresh login.
httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      // Deliberately a hard navigation, not useRouter().push(): this runs
      // outside React's tree (an axios interceptor) and a full reload also
      // clears any client-side state that assumed a valid session.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

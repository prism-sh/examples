import ky from "ky";

export default function useApi() {
  const client = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_PRISM_API_URL,
    hooks: {
      beforeRequest: [
        async (request) => {
          request.headers.set(
            "Authorization",
            `Bearer ${process.env.PRISM_API_SECRET}`
          );
          request.headers.set("Access-Control-Expose-Headers", "x-request-id");
        },
      ],
      beforeError: [
        async (error) => {
          const { response } = error;
          if (response) {
            try {
              const errorBody = await response.text();
              let parsedError = {};
              try {
                parsedError = JSON.parse(errorBody);
              } catch (jsonError) {
                parsedError = { raw: errorBody };
              }
              error.response = {
                ...parsedError,
                status: response.status,
                url: response.url,
                // @ts-expect-error - method is not defined in Response
                method: response.method,
                headers: response.headers,
              };
            } catch (parseError) {
              error.response = {
                status: response.status,
                url: response.url,
                // @ts-expect-error - method is not defined in Response
                method: response.method,
                response: response.statusText,
                headers: response.headers,
              };
            }
          }
          return error;
        },
      ],
    },
  });

  return client;
}

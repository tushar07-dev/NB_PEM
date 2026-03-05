import { defineConfig } from "orval";

export default defineConfig({
  pemApi: {
    input: {
      target: "./docs/api/swagger.json", // Local file - works offline
    },
    output: {
      target: "./src/api/generated/endpoints.ts",
      schemas: "./src/api/generated/schemas",
      client: "react-query",
      mode: "tags-split", // splits by API controller
      override: {
        mutator: {
          path: "./src/api/mutator/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});

const localServerUrl = "http://localhost:8000";
const productionServerUrl = "https://mern-stack-ai.onrender.com";

export const serverUrl =
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.DEV ? localServerUrl : productionServerUrl);

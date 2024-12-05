/**
 * The base URL for the AI service proxy.
 * @type {string}
 */
const AI_SERVICE_URL_PROXY: string = import.meta.env.VITE_AI_SERVICE_URL_PROXY;

/**
 * Makes a request to the AI service proxy.
 * 
 * @param {string} endpoint - The endpoint to make the request to.
 * @param {object} [options] - The options for the request.
 * @param {string} [options.method] - The HTTP method to use (default: "GET").
 * @param {object} [options.headers] - The headers to include in the request. (default content type: "application/json")
 * @returns {Promise<Response>} The response from the server.
 */
export const client = async (endpoint: string, options: any = {}, url = AI_SERVICE_URL_PROXY): Promise<Response> => {
  const config = {
    method: "GET", // default to get if not specified
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };
  return fetch(url + endpoint, config);
};

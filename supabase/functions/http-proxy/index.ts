// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import * as Deno from "https://deno.land/std@0.131.0/http/server.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const API_SERVICE_URL = Deno.env.get("AI_API_URL") ||
  "https://aidmi-backend-221555248574.asia-southeast1.run.app";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20 * 60 * 1000); // 20 minutes timeout

  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Request is OPTIONS");
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Log request headers
    console.log("Request Headers:", JSON.stringify([...req.headers]));
    // Proxy request
    const url = new URL(req.url);
    const path = url.pathname.split("/http-proxy")[1];
    const proxyUrl = `${API_SERVICE_URL}${path}`;
    console.log("proxyUrl", proxyUrl);
    const clonedRequest = req.clone();
    let proxyResponse = await fetch(proxyUrl, {
      method: req.method,
      headers: req.headers,
      body: clonedRequest.body, // reuse the cloned request body
      redirect: "manual", // Prevent automatic redirects
      signal: controller.signal,
    });

    // Check if it's a redirect
    if (proxyResponse.status === 301 || proxyResponse.status === 302) {
      console.log("redirecting request...");
      const location = proxyResponse.headers.get("Location");
      if (location) {
        // Fetch again from the new location
        proxyResponse = await fetch(location, {
          method: req.method,
          headers: req.headers,
          body: req.body,
        });
      }
    }

    const proxyBody = await proxyResponse.arrayBuffer();

    // Log the response headers
    console.log(
      "Response Headers:",
      JSON.stringify([...proxyResponse.headers]),
    );
    console.log("Response Body", proxyBody);

    return new Response(proxyBody, {
      status: proxyResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": proxyResponse.headers.get("Content-Type") ||
          "application/json",
      },
    });
  } catch (error : any) {
    console.error("Error proxying request:", error);
    if (error.name === "AbortError") {
      console.error("Fetch request timed out");
    }
    return new Response("Error occurred", {
      status: 500,
      headers: corsHeaders,
    });
  } finally {
    clearTimeout(timeout);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-patient-diagnosis' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

  3. To deply function: `npx supabase functions deploy`
*/

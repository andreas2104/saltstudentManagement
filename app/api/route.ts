// This file defines an API route in Next.js using the App Router.
// In Next.js 13+, API routes are created in the 'app/api' directory with files named 'route.ts'.
// This route will handle HTTP requests to the path corresponding to this file's location.
// For example, this file at 'app/api/route.ts' handles requests to '/api/route'.

import { NextResponse } from "next/server";

// The GET function handles GET requests to this route.
// It takes a NextRequest object (containing request details) and returns a NextResponse.
// This is asynchronous, allowing for database calls or other async operations.
export async function GET() {
  // You can access request details like headers, query params, etc., from the 'request' object.
  // For now, we'll just return a simple JSON response.

  // Create a response with JSON data. NextResponse.json() is a helper for JSON responses.
  return NextResponse.json({
    message: "Hello from the API!",
    timestamp: new Date().toISOString(),
  });
}

// You can add more handlers like POST, PUT, DELETE for different HTTP methods.
// For example:
// export async function POST(request: NextRequest) {
//   // Handle POST requests here
// }

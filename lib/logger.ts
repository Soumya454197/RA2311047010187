export async function Log(
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg: "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string
): Promise<void> {
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZzA5NTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjA3MCwiaWF0IjoxNzc3NzAxMTcwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDQyNGZlMWMtZTIyMy00MzVmLTg0YTAtMTM2MmUzNjQ5OGRkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic291bXlhIGd1cHRhIiwic3ViIjoiY2RkM2ZiMzItMWJiNS00M2MzLTg2ZjQtODIwOTg0MjlmM2U0In0sImVtYWlsIjoic2cwOTU5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoic291bXlhIGd1cHRhIiwicm9sbE5vIjoicmEyMzExMDQ3MDEwMTg3IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiY2RkM2ZiMzItMWJiNS00M2MzLTg2ZjQtODIwOTg0MjlmM2U0IiwiY2xpZW50U2VjcmV0IjoiUVhTYlNTQVZWekJEdFJKZSJ9.lEbkqCSg8EvVUGNbnvV_GpawoylSJ0MKY0Uw2zHKFys";
  try {
    await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (e) {
    console.error("Log failed", e);
  }
}
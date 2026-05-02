const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZzA5NTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjA3MCwiaWF0IjoxNzc3NzAxMTcwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDQyNGZlMWMtZTIyMy00MzVmLTg0YTAtMTM2MmUzNjQ5OGRkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic291bXlhIGd1cHRhIiwic3ViIjoiY2RkM2ZiMzItMWJiNS00M2MzLTg2ZjQtODIwOTg0MjlmM2U0In0sImVtYWlsIjoic2cwOTU5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoic291bXlhIGd1cHRhIiwicm9sbE5vIjoicmEyMzExMDQ3MDEwMTg3IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiY2RkM2ZiMzItMWJiNS00M2MzLTg2ZjQtODIwOTg0MjlmM2U0IiwiY2xpZW50U2VjcmV0IjoiUVhTYlNTQVZWekJEdFJKZSJ9.lEbkqCSg8EvVUGNbnvV_GpawoylSJ0MKY0Uw2zHKFys"
const BASE_URL = "http://20.207.122.201/evaluation-service";

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

export async function fetchNotifications(params?: {
  limit?: number;
  page?: number;
  notification_type?: string;
}): Promise<Notification[]> {
  const url = new URL(`${BASE_URL}/notifications`);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.notification_type)
    url.searchParams.set("notification_type", params.notification_type);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");
  const data = await res.json();
  return data.notifications;
}

export function getPriorityScore(type: string, timestamp: string): number {
  const typeWeight: Record<string, number> = {
    Placement: 300,
    Result: 200,
    Event: 100,
  };
  const recency = new Date(timestamp).getTime();
  return (typeWeight[type] || 0) + recency / 1e12;
}

export function getTopN(
  notifications: Notification[],
  n: number
): Notification[] {
  return [...notifications]
    .sort(
      (a, b) =>
        getPriorityScore(b.Type, b.Timestamp) -
        getPriorityScore(a.Type, a.Timestamp)
    )
    .slice(0, n);
}
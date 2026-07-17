export type DashWebStatus = "PENDING" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED";

export type DashWebTask = {
  id: string;
  title: string;
  status: DashWebStatus;
  projectId?: string;
  description?: string;
  updatedAt?: string;
};

const baseUrl = () => process.env.DASHWEB_API_URL?.replace(/\/$/, "");

export async function getDashWebTasks(): Promise<{ configured: boolean; tasks: DashWebTask[]; error?: string }> {
  const url = baseUrl();
  const token = process.env.DASHWEB_SERVICE_TOKEN;
  if (!url || !token) {
    return { configured: false, tasks: [], error: "DashWeb service credentials are not configured." };
  }
  try {
    const response = await fetch(`${url}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return { configured: true, tasks: [], error: `DashWeb returned HTTP ${response.status}.` };
    }
    const payload = await response.json();
    const tasks = Array.isArray(payload) ? payload : payload.data ?? payload.items ?? [];
    return { configured: true, tasks };
  } catch {
    return { configured: true, tasks: [], error: "DashWeb could not be reached." };
  }
}

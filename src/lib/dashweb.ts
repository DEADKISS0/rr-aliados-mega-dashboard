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

export type DashWebProject = {
  id: string;
  name: string;
  description?: string;
};

export async function getDashWebProjects(_opts?: { includeDemo?: boolean }): Promise<{ configured: boolean; projects: DashWebProject[]; error?: string }> {
  const url = baseUrl();
  const token = process.env.DASHWEB_SERVICE_TOKEN;
  if (!url || !token) {
    return { configured: false, projects: [], error: "DashWeb service credentials are not configured." };
  }
  try {
    const response = await fetch(`${url}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return { configured: true, projects: [], error: `DashWeb returned HTTP ${response.status}.` };
    }
    const payload = await response.json();
    const projects = Array.isArray(payload) ? payload : payload.data ?? payload.items ?? [];
    return { configured: true, projects };
  } catch {
    return { configured: true, projects: [], error: "DashWeb could not be reached." };
  }
}

export type DashWebUser = {
  id: string;
  name: string;
  email?: string;
};

export async function getDashWebUsers(): Promise<{ configured: boolean; users: DashWebUser[]; error?: string }> {
  const url = baseUrl();
  const token = process.env.DASHWEB_SERVICE_TOKEN;
  if (!url || !token) {
    return { configured: false, users: [], error: "DashWeb service credentials are not configured." };
  }
  try {
    const response = await fetch(`${url}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return { configured: true, users: [], error: `DashWeb returned HTTP ${response.status}.` };
    }
    const payload = await response.json();
    const users = Array.isArray(payload) ? payload : payload.data ?? payload.items ?? [];
    return { configured: true, users };
  } catch {
    return { configured: true, users: [], error: "DashWeb could not be reached." };
  }
}

export async function createDashWebTask(params: {
  title: string;
  description?: string;
  projectId?: string;
  priority?: string;
}): Promise<{ ok: boolean; configured: boolean; task?: { id: string }; error?: string }> {
  const url = baseUrl();
  const token = process.env.DASHWEB_SERVICE_TOKEN;
  if (!url || !token) {
    return { ok: false, configured: false, error: "DashWeb service credentials are not configured." };
  }
  try {
    const response = await fetch(`${url}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      return { ok: false, configured: true, error: `DashWeb returned HTTP ${response.status}.` };
    }
    const payload = await response.json();
    const task = payload.task ?? payload.data ?? payload;
    return { ok: true, configured: true, task: { id: task.id ?? task._id } };
  } catch {
    return { ok: false, configured: true, error: "DashWeb could not be reached." };
  }
}

export async function assignDashWebTask(params: {
  taskId: string;
  assigneeId: string;
}): Promise<{ ok: boolean; configured: boolean; error?: string }> {
  const url = baseUrl();
  const token = process.env.DASHWEB_SERVICE_TOKEN;
  if (!url || !token) {
    return { ok: false, configured: false, error: "DashWeb service credentials are not configured." };
  }
  try {
    const response = await fetch(`${url}/tasks/${params.taskId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ assigneeId: params.assigneeId }),
    });
    if (!response.ok) {
      return { ok: false, configured: true, error: `DashWeb returned HTTP ${response.status}.` };
    }
    return { ok: true, configured: true };
  } catch {
    return { ok: false, configured: true, error: "DashWeb could not be reached." };
  }
}

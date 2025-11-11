const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "API Error" }));
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  }

  // Applications
  async createApplication(data: unknown) {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getApplication(id: string) {
    return this.request(`/applications/${id}`);
  }

  // Admin endpoints (com API key)
  async getAdminApplications() {
    return this.request("/admin/applications", {
      headers: {
        "x-admin-api-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY!,
      },
    });
  }

  async updateApplicationStatus(id: string, data: unknown) {
    return this.request(`/admin/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "x-admin-api-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY!,
      },
      body: JSON.stringify(data),
    });
  }

  async createInvitation(applicationId: string) {
    return this.request(`/admin/applications/${applicationId}/invite`, {
      method: "POST",
      headers: {
        "x-admin-api-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY!,
      },
    });
  }
}

export const apiClient = new ApiClient();

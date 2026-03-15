const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchTeamMembers() {
  const res = await fetch(`${API_URL}/team/`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch team members");
  return res.json();
}

export async function fetchTeamMember(id) {
  const res = await fetch(`${API_URL}/team/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch member ${id}`);
  return res.json();
}

export async function createTeamMember(data) {
  const res = await fetch(`${API_URL}/team/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create team member");
  return res.json();
}

export async function updateTeamMember(id, data) {
  const res = await fetch(`${API_URL}/team/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update member ${id}`);
  return res.json();
}

export async function deleteTeamMember(id) {
  const res = await fetch(`${API_URL}/team/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete member ${id}`);
}

/**
 * Upload a profile photo to the backend.
 * Returns { url, filename, size, content_type }
 */
export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload/photo`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type — browser sets it with boundary automatically
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Photo upload failed");
  }

  const data = await res.json();
  // Make the URL absolute so it works from any origin
  return {
    ...data,
    url: data.url.startsWith("http") ? data.url : `${API_URL}${data.url}`,
  };
}

export async function deletePhoto(filename) {
  const res = await fetch(`${API_URL}/upload/photo/${filename}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete photo");
}


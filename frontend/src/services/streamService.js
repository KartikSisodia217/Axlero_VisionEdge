const API_URL = "http://127.0.0.1:8000/api/v1/streams";

export async function getStreams() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }

  return await response.json();
}

export async function createStream(stream) {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stream),
  });

  if (!response.ok) {
    throw new Error("Failed to create stream");
  }

  return await response.json();
}

export async function updateStream(id, stream) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stream),
  });

  if (!response.ok) {
    throw new Error("Failed to update stream");
  }

  return await response.json();
}

export async function deleteStream(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete stream");
  }

  return await response.json();
}
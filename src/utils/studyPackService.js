import { apiFetch } from "./api";

export async function generateStudyPack({ title, text }) {
  const data = await apiFetch("/api/study-pack", {
    method: "POST",
    body: JSON.stringify({ title, text }),
  });
  return data.pack;
}

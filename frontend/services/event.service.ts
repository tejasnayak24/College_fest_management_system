import api from "@/lib/api";

export const getAllEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};
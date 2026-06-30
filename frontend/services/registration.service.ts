import api from "@/lib/api";

export const registerForEvent = async (eventId: string) => {
  const response = await api.post("/registrations", {
    eventId,
  });

  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get("/registrations/me");
  return response.data;
};
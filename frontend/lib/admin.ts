import api from "./api";

export const fetchUserStats = async () =>
  (await api.get("/admin/stats/users")).data;

export const fetchAllProduce = async () =>
  (await api.get("/admin/produce/all")).data;

export const fetchSoldStats = async () =>
  (await api.get("/admin/produce/sold")).data;

export const fetchAiUsage = async () => (await api.get("/admin/ai/usage")).data;

import apiClient from "../../shared/api/client.js";

export async function obtenerAulas() {
    const response = await apiClient.get("aulas/");
    return response.data.results ? response.data.results : response.data;
}

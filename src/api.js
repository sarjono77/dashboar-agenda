// GANTI DENGAN URL /exec MILIKMU YANG BARU
const API_URL = "https://script.google.com/macros/s/AKfycbzDSeZgajXmnfRzTxsD8Rx0PwDvHA0QPiud2HnaoEXbBlcwMVLZB0z0sBkqEGPq73CoVw/exec";

// Trik khusus untuk menembus CORS Google Apps Script
const sendRequest = async (payload) => {
  try {
    const formData = new URLSearchParams();
    Object.keys(payload).forEach(key => formData.append(key, payload[key]));

    const res = await fetch(API_URL, {
      method: "POST",
      // Gunakan text/plain agar browser tidak memblokir request
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: formData.toString(),
    });
    return await res.json();
  } catch (error) {
    console.error("Error koneksi ke GAS:", error);
    return { status: "error", message: "Gagal koneksi ke server" };
  }
};

export const getAgendas = async () => {
  try {
    const res = await fetch(`${API_URL}?action=read`, { cache: "no-store" });
    return await res.json();
  } catch (error) {
    return { status: "error", data: [] };
  }
};

export const createAgenda = async (data) => {
  return await sendRequest({ action: "create", ...data });
};

export const updateAgenda = async (id, data) => {
  return await sendRequest({ action: "update", id: id, ...data });
};

export const deleteAgenda = async (id) => {
  return await sendRequest({ action: "delete", id: id });
};
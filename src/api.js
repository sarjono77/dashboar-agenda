// PASTIKAN URL INI ADALAH URL /exec MILIKMU
const API_URL = "https://script.google.com/macros/s/AKfycbzDSeZgajXmnfRzTxsD8Rx0PwDvHA0QPiud2HnaoEXbBlcwMVLZB0z0sBkqEGPq73CoVw/exec";

// Fungsi bantu untuk mengirim data (POST)
const sendRequest = async (payload) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      // Kirim sebagai teks JSON
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload), 
    });
    return await res.json();
  } catch (error) {
    console.error("Error koneksi:", error);
    return { status: "error", message: "Gagal koneksi ke server" };
  }
};

// Fungsi Ambil Data (GET)
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
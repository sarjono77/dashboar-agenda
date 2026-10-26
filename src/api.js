// GANTI DENGAN URL /exec MILIKMU
const API_URL = "https://script.google.com/macros/s/AKfycbzDSeZgajXmnfRzTxsD8Rx0PwDvHA0QPiud2HnaoEXbBlcwMVLZB0z0sBkqEGPq73CoVw/exec";

export const getAgendas = async () => {
  try {
    const res = await fetch(`${API_URL}?action=read`);
    return await res.json();
  } catch (error) {
    console.error("Error GET:", error);
    return { status: "error", data: [] };
  }
};

export const createAgenda = async (data) => {
  try {
    const formData = new URLSearchParams();
    formData.append("action", "create");
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData, // Tanpa headers tambahan, biarkan browser yang atur
    });
    return await res.json();
  } catch (error) {
    console.error("Error POST Create:", error);
    return { status: "error", message: "Gagal koneksi ke server" };
  }
};

export const updateAgenda = async (id, data) => {
  try {
    const formData = new URLSearchParams();
    formData.append("action", "update");
    formData.append("id", id);
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error("Error POST Update:", error);
    return { status: "error", message: "Gagal koneksi ke server" };
  }
};

export const deleteAgenda = async (id) => {
  try {
    const formData = new URLSearchParams();
    formData.append("action", "delete");
    formData.append("id", id);

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error("Error POST Delete:", error);
    return { status: "error", message: "Gagal koneksi ke server" };
  }
};
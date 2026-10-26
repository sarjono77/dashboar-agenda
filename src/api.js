const API_URL = "https://script.google.com/macros/s/AKfycbxVPST0q_GQrNj0LGPjzh9ZJ7IqdwVKuXiXkjbhBBwsdl6PpPKbgBj3jQ2n-pJcIbrYiw/exec";

export const getAgendas = async () => {
  const res = await fetch(`${API_URL}?action=read`);
  return await res.json();
};

export const createAgenda = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'create', ...data })
  });
  return await res.json();
};

export const updateAgenda = async (id, data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'update', id, ...data })
  });
  return await res.json();
};

export const deleteAgenda = async (id) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'delete', id })
  });
  return await res.json();
};
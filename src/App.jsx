import React, { useState, useEffect } from 'react';
import {
  getAgendas,
  createAgenda,
  updateAgenda,
  deleteAgenda
} from './api';

export default function App() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Modal Tambah / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    tipe: 'Rapat',
    tanggal: '',
    waktu: '09:00',
    lokasi: '',
    penanggung_jawab: '',
    status: 'Terjadwal',
    disposisi: ''
  });

  // 1. READ: Ambil semua data agenda (sebelumnya memanggil Supabase select)
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAgendas();
      if (res.status === 'success' && Array.isArray(res.data)) {
        setAgendas(res.data);
      } else {
        alert('Gagal mengambil data: ' + (res.message || 'Error'));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. CREATE & UPDATE: Handle Submit Modal (sebelumnya Supabase insert & update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      alert('Judul agenda wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      if (modalMode === 'create') {
        const res = await createAgenda(formData);
        if (res.status === 'success') {
          closeModal();
          await fetchData();
        } else {
          alert('Gagal menambah agenda: ' + res.message);
        }
      } else {
        const res = await updateAgenda(selectedId, formData);
        if (res.status === 'success') {
          closeModal();
          await fetchData();
        } else {
          alert('Gagal memperbarui agenda: ' + res.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. UPDATE: Cepat ubah status agenda (sebelumnya Supabase update status)
  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const res = await updateAgenda(id, { status: newStatus });
      if (res.status === 'success') {
        await fetchData();
      } else {
        alert('Gagal mengubah status: ' + res.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4. UPDATE: Simpan disposisi pimpinan (sebelumnya Supabase update disposisi)
  const handleSaveDisposisi = async (id, disposisiBaru) => {
    setLoading(true);
    try {
      const res = await updateAgenda(id, { disposisi: disposisiBaru });
      if (res.status === 'success') {
        await fetchData();
      } else {
        alert('Gagal memperbarui disposisi: ' + res.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 5. DELETE: Hapus agenda berdasarkan id (sebelumnya Supabase delete eq id)
  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus agenda "${judul}"?`)) return;

    setLoading(true);
    try {
      const res = await deleteAgenda(id);
      if (res.status === 'success') {
        await fetchData();
      } else {
        alert('Gagal menghapus agenda: ' + res.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedId(null);
    setFormData({
      judul: '',
      tipe: 'Rapat',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '09:00',
      lokasi: '',
      penanggung_jawab: '',
      status: 'Terjadwal',
      disposisi: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedId(item.id);
    setFormData({
      judul: item.judul || '',
      tipe: item.tipe || 'Rapat',
      tanggal: item.tanggal || '',
      waktu: item.waktu || '09:00',
      lokasi: item.lokasi || '',
      penanggung_jawab: item.penanggung_jawab || '',
      status: item.status || 'Terjadwal',
      disposisi: item.disposisi || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const filteredAgendas = agendas.filter((item) => {
    const matchesStatus =
      filterStatus === 'Semua' || item.status?.toLowerCase() === filterStatus.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.judul?.toLowerCase().includes(q) ||
      item.lokasi?.toLowerCase().includes(q) ||
      item.penanggung_jawab?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Daftar Agenda (Google Sheets API)</h2>
        <button
          onClick={openCreateModal}
          style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          + Tambah Agenda
        </button>
      </header>

      {/* Filter & Pencarian */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Cari agenda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        >
          {['Semua', 'Terjadwal', 'Berlangsung', 'Selesai', 'Ditunda', 'Dibatalkan'].map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Tabel Agenda */}
      {loading ? (
        <p>Memuat data dari Google Sheets...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ padding: 10 }}>Judul</th>
              <th style={{ padding: 10 }}>Waktu & Lokasi</th>
              <th style={{ padding: 10 }}>PIC</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Disposisi</th>
              <th style={{ padding: 10, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgendas.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: 10 }}>
                  <strong>{item.judul}</strong>
                  <div style={{ fontSize: 12, color: '#666' }}>{item.tipe}</div>
                </td>
                <td style={{ padding: 10 }}>
                  {item.tanggal} {item.waktu}
                  <div style={{ fontSize: 12, color: '#666' }}>{item.lokasi}</div>
                </td>
                <td style={{ padding: 10 }}>{item.penanggung_jawab}</td>
                <td style={{ padding: 10 }}>
                  <select
                    value={item.status || 'Terjadwal'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    style={{ padding: 4, borderRadius: 4 }}
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditunda">Ditunda</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </td>
                <td style={{ padding: 10 }}>
                  {item.disposisi || '-'}
                  <button
                    onClick={() => {
                      const baru = prompt('Ketik disposisi baru:', item.disposisi || '');
                      if (baru !== null) handleSaveDisposisi(item.id, baru);
                    }}
                    style={{ display: 'block', fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Ubah
                  </button>
                </td>
                <td style={{ padding: 10, textAlign: 'right' }}>
                  <button onClick={() => openEditModal(item)} style={{ marginRight: 6 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id, item.judul)} style={{ color: 'red' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, width: 450 }}>
            <h3>{modalMode === 'create' ? 'Tambah Agenda Baru' : 'Edit Agenda'}</h3>
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                placeholder="Judul Agenda *"
                required
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                style={{ padding: 8 }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  style={{ flex: 1, padding: 8 }}
                />
                <input
                  type="time"
                  value={formData.waktu}
                  onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                  style={{ flex: 1, padding: 8 }}
                />
              </div>
              <input
                placeholder="Lokasi"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                style={{ padding: 8 }}
              />
              <input
                placeholder="Penanggung Jawab"
                value={formData.penanggung_jawab}
                onChange={(e) => setFormData({ ...formData, penanggung_jawab: e.target.value })}
                style={{ padding: 8 }}
              />
              <input
                placeholder="Disposisi"
                value={formData.disposisi}
                onChange={(e) => setFormData({ ...formData, disposisi: e.target.value })}
                style={{ padding: 8 }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button type="button" onClick={closeModal}>Batal</button>
                <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '6px 14px' }}>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

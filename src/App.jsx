import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, FileText, Settings, Plus, Search, Trash2, X } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('ikhtisar');
  
  // State untuk Edit & Disposisi
  const [editData, setEditData] = useState(null); 
  const [isDisposisiMode, setIsDisposisiMode] = useState(false);

  // State untuk Profil (Local Storage)
  const [profil, setProfil] = useState(() => {
    const saved = localStorage.getItem('profilUser');
    return saved ? JSON.parse(saved) : { nama: 'Agus Sarjono', email: 'agus@contoh.com' };
  });

  // Fungsi ambil data dari Supabase
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('agendas').select('*').order('created_at', { ascending: false });
    if (!error) setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi hapus data
  const handleDelete = async (id) => {
    if (window.confirm('Hapus agenda ini?')) {
      await supabase.from('agendas').delete().eq('id', id);
      fetchData();
    }
  };

  // Fungsi Ubah Status cepat via Dropdown
  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('agendas')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert('Gagal update status: ' + error.message);
    } else {
      fetchData(); 
    }
  };

  // Buka Modal Edit
  const handleEditClick = (row) => {
    setEditData(row);
    setIsDisposisiMode(false);
    setIsModalOpen(true);
  };

  // Buka Modal Disposisi
  const handleDisposisiClick = (row) => {
    setEditData(row);
    setIsDisposisiMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col justify-between py-4">
        <div>
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#0f172a] font-bold">AJ</div>
            <div>
              <h1 className="font-bold text-sm">Atur Jadwal</h1>
              <p className="text-[10px] text-gray-400">DISPOSISI PRO</p>
            </div>
          </div>
          <p className="px-6 text-xs text-gray-400 mb-2">RUANG KERJA</p>
          <nav className="flex flex-col gap-1 px-3">
            <button 
              onClick={() => setCurrentPage('ikhtisar')} 
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${currentPage === 'ikhtisar' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              <LayoutDashboard size={18} /> Ikhtisar
            </button>
            <button 
              onClick={() => setCurrentPage('jadwal')} 
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${currentPage === 'jadwal' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              <Calendar size={18} /> Jadwal & kalender
            </button>
            <button 
              onClick={() => setCurrentPage('disposisi')} 
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${currentPage === 'disposisi' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              <FileText size={18} /> Disposisi
            </button>
          </nav>
        </div>
        
        <div className="px-6">
          <button 
            onClick={() => setCurrentPage('pengaturan')} 
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${currentPage === 'pengaturan' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Settings size={18} /> Pengaturan
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-gray-200">
          <div className="text-sm text-gray-500 uppercase">
            RUANG KERJA / <span className="text-gray-900 font-medium">{currentPage}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
              {profil.nama.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* ================= HALAMAN IKHTISAR ================= */}
          {currentPage === 'ikhtisar' && (
            <>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Hari Ini</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Selamat datang, {profil.nama}</h1>
                </div>
                <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-[#1e293b] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-gray-800 transition">
                  <Plus size={16} /> Tambah jadwal
                </button>
              </div>

              {/* Kartu Statistik */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { title: "Total agenda", val: data.length, color: "text-blue-600" },
                  { title: "Menunggu", val: data.filter(d => d.status === 'Menunggu').length, color: "text-yellow-600" },
                  { title: "Berjalan", val: data.filter(d => d.status === 'Berjalan').length, color: "text-orange-600" },
                  { title: "Selesai", val: data.filter(d => d.status === 'Selesai').length, color: "text-green-600" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 flex flex-col justify-center shadow-sm">
                    <h2 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h2>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </div>
                ))}
              </div>

              {/* Tabel Ikhtisar */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Agenda terbaru</h3>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="text" placeholder="Cari agenda..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm outline-none" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 border-b">
                      <tr>
                        <th className="px-5 py-3">Tanggal / Waktu</th>
                        <th className="px-5 py-3">Kegiatan</th>
                        <th className="px-5 py-3">Lokasi</th>
                        <th className="px-5 py-3">PJ</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6" className="text-center py-6">Memuat data...</td></tr>
                      ) : data.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-6 text-gray-500">Belum ada agenda. Silakan tambah.</td></tr>
                      ) : (
                        data.map((row) => (
                          <tr key={row.id} className="border-b hover:bg-gray-50">
                            <td className="px-5 py-4">
                              <p className="font-medium">{row.tanggal}</p>
                              <p className="text-xs text-gray-500">{row.waktu} WIB</p>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-medium">{row.judul}</p>
                              <p className="text-xs text-gray-500">{row.tipe}</p>
                            </td>
                            <td className="px-5 py-4">{row.lokasi}</td>
                            <td className="px-5 py-4">{row.penanggung_jawab}</td>
                            <td className="px-5 py-4">
                              <select 
                                value={row.status} 
                                onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                                className={`px-2 py-1 rounded text-xs font-medium cursor-pointer outline-none border border-transparent hover:border-gray-300 ${
                                  row.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                                  row.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' : 
                                  row.status === 'Berjalan' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}
                              >
                                <option value="Menunggu">Menunggu</option>
                                <option value="Berjalan">Berjalan</option>
                                <option value="Disposisi">Disposisi</option>
                                <option value="Selesai">Selesai</option>
                              </select>
                            </td>
                            <td className="px-5 py-4 flex gap-3">
                              <button onClick={() => handleEditClick(row)} className="text-blue-500 hover:text-blue-700" title="Edit Agenda">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                              </button>
                              <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700" title="Hapus Agenda">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ================= HALAMAN JADWAL ================= */}
          {currentPage === 'jadwal' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Daftar Semua Jadwal</h2>
              {loading ? <p>Memuat data...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.map(item => (
                    <div key={item.id} className="border p-4 rounded-lg flex flex-col gap-2 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">{item.judul}</h3>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{item.tipe}</span>
                      </div>
                      <p className="text-sm text-gray-600">📅 {item.tanggal} | ⏰ {item.waktu} WIB</p>
                      <p className="text-sm text-gray-600">📍 {item.lokasi}</p>
                      <p className="text-sm text-gray-600">👤 PJ: {item.penanggung_jawab}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= HALAMAN DISPOSISI ================= */}
          {currentPage === 'disposisi' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-bold">Daftar Disposisi / Tugas Aktif</h2>
                <p className="text-sm text-gray-500">Daftar agenda yang butuh tindak lanjut.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 border-b">
                    <tr>
                      <th className="px-5 py-3">Tanggal</th>
                      <th className="px-5 py-3">Kegiatan</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Catatan Disposisi</th>
                      <th className="px-5 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.filter(d => d.status === 'Disposisi' || d.status === 'Menunggu').map(row => (
                      <tr key={row.id} className="border-b hover:bg-gray-50">
                        <td className="px-5 py-4">{row.tanggal}</td>
                        <td className="px-5 py-4 font-medium">{row.judul}</td>
                        <td className="px-5 py-4">
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">{row.status}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">{row.disposisi || '-'}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleDisposisiClick(row)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition">
                            Beri Disposisi
                          </button>
                        </td>
                      </tr>
                    ))}
                    {data.filter(d => d.status === 'Disposisi' || d.status === 'Menunggu').length === 0 && (
                      <tr><td colSpan="5" className="text-center py-6 text-gray-500">Tidak ada disposisi saat ini.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= HALAMAN PENGATURAN ================= */}
          {currentPage === 'pengaturan' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-2xl">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Pengaturan Profil</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-3xl">
                  {profil.nama.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{profil.nama}</h3>
                  <p className="text-sm text-gray-500">Petugas Administrator</p>
                  <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Ruang Kerja Aktif</span>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem('profilUser', JSON.stringify(profil));
                alert('Profil berhasil disimpan!');
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={profil.nama} 
                    onChange={(e) => setProfil({...profil, nama: e.target.value})}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={profil.email} 
                    onChange={(e) => setProfil({...profil, email: e.target.value})}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Versi Aplikasi</label>
                  <p className="text-sm text-gray-600">Atur Jadwal - Disposisi Pro v1.0.0</p>
                </div>
                <button type="submit" className="bg-[#1e293b] text-white px-6 py-2 rounded-md mt-4 hover:bg-gray-800 transition">
                  Simpan Perubahan
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL TAMBAH/EDIT/DISPOSISI */}
      {isModalOpen && (
        <ModalUtama 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={fetchData} 
          editData={editData}
          isDisposisiMode={isDisposisiMode}
        />
      )}
    </div>
  );
}

// KOMPONEN MODAL UTAMA (Bisa untuk Tambah, Edit, dan Disposisi)
function ModalUtama({ onClose, onRefresh, editData, isDisposisiMode }) {
  const [form, setForm] = useState({ 
    judul: editData?.judul || '', 
    tipe: editData?.tipe || 'Kegiatan',
    tanggal: editData?.tanggal || '', 
    waktu: editData?.waktu ? editData.waktu.substring(0,5) : '', 
    lokasi: editData?.lokasi || '', 
    penanggung_jawab: editData?.penanggung_jawab || '', 
    status: editData?.status || 'Menunggu',
    disposisi: editData?.disposisi || ''
  });

  const simpan = async (e) => {
    e.preventDefault();
    let error;

    if (isDisposisiMode) {
      const result = await supabase.from('agendas').update({ 
        disposisi: form.disposisi, 
        status: 'Disposisi' 
      }).eq('id', editData.id);
      error = result.error;
    } else if (editData) {
      const result = await supabase.from('agendas').update(form).eq('id', editData.id);
      error = result.error;
    } else {
      const result = await supabase.from('agendas').insert([form]);
      error = result.error;
    }

    if (error) alert('Error: ' + error.message);
    else {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isDisposisiMode ? 'Beri Disposisi' : editData ? 'Edit Jadwal' : 'Tambah Jadwal'}
          </h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={simpan} className="space-y-3">
          {isDisposisiMode ? (
            <>
              <p className="text-sm font-medium mb-1">Agenda: {form.judul}</p>
              <textarea 
                required 
                placeholder="Masukkan catatan disposisi/arahan..." 
                className="w-full border p-2 rounded h-24" 
                value={form.disposisi}
                onChange={e => setForm({...form, disposisi: e.target.value})} 
              />
            </>
          ) : (
            <>
              <input required placeholder="Nama Kegiatan" className="w-full border p-2 rounded" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} />
              <div className="flex gap-2">
                <input required type="date" className="w-full border p-2 rounded" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} />
                <input required type="time" className="w-full border p-2 rounded" value={form.waktu} onChange={e => setForm({...form, waktu: e.target.value})} />
              </div>
              <input required placeholder="Lokasi" className="w-full border p-2 rounded" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} />
              <input required placeholder="Penanggung Jawab" className="w-full border p-2 rounded" value={form.penanggung_jawab} onChange={e => setForm({...form, penanggung_jawab: e.target.value})} />
              <select className="w-full border p-2 rounded" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="Menunggu">Menunggu</option>
                <option value="Berjalan">Berjalan</option>
                <option value="Disposisi">Disposisi</option>
                <option value="Selesai">Selesai</option>
              </select>
            </>
          )}
          
          <button type="submit" className="w-full bg-[#1e293b] text-white py-2 rounded mt-4 hover:bg-gray-800 transition">
            {isDisposisiMode ? 'Kirim Disposisi' : 'Simpan Data'}
          </button>
        </form>
      </div>
    </div>
  );
}
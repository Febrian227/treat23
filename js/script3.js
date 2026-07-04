// ===== Kunci penyimpanan data di localStorage =====
const STORAGE_KEY = "dataLayanan";
const EDIT_KEY = "editDataId"; // menyimpan id data yang sedang diedit (lintas halaman)

// ===== Ambil / Simpan data =====
function ambilData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function simpanData(dataArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
}

// =========================================================
// ===== BAGIAN FORM INPUT (index.html) =====
// =========================================================
const formInput = document.getElementById("formInput");

if (formInput) {
  const inputNama = document.getElementById("nama");
  const inputNim = document.getElementById("nim");
  const inputJenis = document.getElementById("jenisLayanan");
  const inputKeterangan = document.getElementById("keterangan");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnBatal = document.getElementById("btnBatal");
  const formTitle = document.getElementById("formTitle");
  const pesan = document.getElementById("pesanSukses");

  let editId = localStorage.getItem(EDIT_KEY); // null jika bukan mode edit

  // Jika ada id edit, muat data yang bersangkutan ke form
  function muatModeEdit() {
    editId = localStorage.getItem(EDIT_KEY);
    if (!editId) return;

    const semuaData = ambilData();
    const target = semuaData.find((item) => item.id === Number(editId));

    if (!target) {
      // Data tidak ditemukan (mungkin sudah dihapus), batalkan mode edit
      localStorage.removeItem(EDIT_KEY);
      return;
    }

    inputNama.value = target.nama;
    inputNim.value = target.nim;
    inputJenis.value = target.jenisLayanan;
    inputKeterangan.value = target.keterangan === "-" ? "" : target.keterangan;

    formTitle.textContent = "Edit Data Layanan";
    btnSubmit.textContent = "Update Data";
    btnBatal.style.display = "inline-block";
  }

  function keluarModeEdit() {
    editId = null;
    localStorage.removeItem(EDIT_KEY);
    formTitle.textContent = "Input Data Layanan";
    btnSubmit.textContent = "Simpan Data";
    btnBatal.style.display = "none";
    formInput.reset();
  }

  muatModeEdit();

  // Event handling tombol submit (menangkap data form)
  formInput.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = inputNama.value.trim();
    const nim = inputNim.value.trim();
    const jenisLayanan = inputJenis.value;
    const keterangan = inputKeterangan.value.trim();

    if (!nama || !nim || !jenisLayanan) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    const semuaData = ambilData();

    if (editId) {
      // Mode update: cari index data lama lalu timpa nilainya
      const index = semuaData.findIndex((item) => item.id === Number(editId));
      if (index !== -1) {
        semuaData[index] = {
          id: Number(editId),
          nama,
          nim,
          jenisLayanan,
          keterangan: keterangan || "-"
        };
        simpanData(semuaData);
      }
      pesan.textContent = "Data berhasil diperbarui!";
      keluarModeEdit();
    } else {
      // Mode tambah data baru
      const dataBaru = {
        id: Date.now(),
        nama,
        nim,
        jenisLayanan,
        keterangan: keterangan || "-"
      };
      semuaData.push(dataBaru);
      simpanData(semuaData);
      formInput.reset();
      pesan.textContent = "Data berhasil disimpan!";
    }

    setTimeout(() => {
      pesan.textContent = "";
    }, 2500);
  });

  // Tombol batal edit
  if (btnBatal) {
    btnBatal.addEventListener("click", function () {
      keluarModeEdit();
    });
  }
}

// =========================================================
// ===== BAGIAN TABEL RIWAYAT (data.html) =====
// =========================================================
const isiTabel = document.getElementById("isiTabel");

if (isiTabel) {
  renderTabel();
}

function renderTabel() {
  const semuaData = ambilData();
  const pesanKosong = document.getElementById("pesanKosong");

  isiTabel.innerHTML = "";

  if (semuaData.length === 0) {
    pesanKosong.style.display = "block";
    return;
  }

  pesanKosong.style.display = "none";

  // Manipulasi DOM: menambahkan baris ke tabel untuk setiap data
  semuaData.forEach((item, index) => {
    const baris = document.createElement("tr");
    baris.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nama}</td>
      <td>${item.nim}</td>
      <td>${item.jenisLayanan}</td>
      <td>${item.keterangan}</td>
      <td class="aksi-cell">
        <button class="btn-edit" data-id="${item.id}">Edit</button>
        <button class="btn-hapus" data-id="${item.id}">Hapus</button>
      </td>
    `;
    isiTabel.appendChild(baris);
  });

  // Event handling tombol Edit -> arahkan ke form dengan data terisi
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      localStorage.setItem(EDIT_KEY, id);
      window.location.href = "index.html";
    });
  });

  // Event handling tombol Hapus
  document.querySelectorAll(".btn-hapus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number(this.getAttribute("data-id"));
      if (confirm("Yakin ingin menghapus data ini?")) {
        hapusData(id);
      }
    });
  });
}

function hapusData(id) {
  let semuaData = ambilData();
  semuaData = semuaData.filter((item) => item.id !== id);
  simpanData(semuaData);
  renderTabel();
}
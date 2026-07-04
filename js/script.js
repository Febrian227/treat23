// ===== Kunci penyimpanan data di localStorage =====
const STORAGE_KEY = "dataLayanan";

// ===== Ambil data dari localStorage =====
function ambilData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// ===== Simpan data ke localStorage =====
function simpanData(dataArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
}

// ===== Proses Form Input (index.html) =====
const formInput = document.getElementById("formInput");

if (formInput) {
  formInput.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const jenisLayanan = document.getElementById("jenisLayanan").value;
    const keterangan = document.getElementById("keterangan").value.trim();

    if (!nama || !nim || !jenisLayanan) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    const dataBaru = {
      id: Date.now(),
      nama: nama,
      nim: nim,
      jenisLayanan: jenisLayanan,
      keterangan: keterangan || "-"
    };

    const semuaData = ambilData();
    semuaData.push(dataBaru);
    simpanData(semuaData);

    // Reset form
    formInput.reset();

    // Tampilkan pesan sukses
    const pesan = document.getElementById("pesanSukses");
    pesan.textContent = "Data berhasil disimpan!";
    setTimeout(() => {
      pesan.textContent = "";
    }, 2500);
  });
}

// ===== Tampilkan Data ke Tabel (data.html) =====
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

  semuaData.forEach((item, index) => {
    const baris = document.createElement("tr");
    baris.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nama}</td>
      <td>${item.nim}</td>
      <td>${item.jenisLayanan}</td>
      <td>${item.keterangan}</td>
      <td><button class="btn-hapus" data-id="${item.id}">Hapus</button></td>
    `;
    isiTabel.appendChild(baris);
  });

  // Tombol hapus data
  document.querySelectorAll(".btn-hapus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number(this.getAttribute("data-id"));
      hapusData(id);
    });
  });
}

function hapusData(id) {
  let semuaData = ambilData();
  semuaData = semuaData.filter((item) => item.id !== id);
  simpanData(semuaData);
  renderTabel();
}

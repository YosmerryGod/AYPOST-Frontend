# AYPOST — Sistem Kasir Modern

> **AYPOST** adalah antarmuka Point of Sale (POS) untuk usaha kuliner, restoran, kedai, dan toko makanan. Fokus utama: transaksi cepat, katalog produk visual, dan pengalaman nyaman di desktop, tablet, maupun HP.

---

## 1. Arah Desain

Desain AYPOST mengambil inspirasi dari referensi yang diberikan: **dark premium food UI** dengan foto makanan sebagai elemen utama, permukaan gelap yang lembut, dan aksen amber/oranye untuk tindakan penting.

### Prinsip desain
- **Dark-first:** latar charcoal hampir hitam, bukan hitam pekat.
- **Food-forward:** foto produk besar dan jelas agar kasir mudah mengenali menu.
- **Fast checkout:** keranjang dan tombol pembayaran selalu mudah dijangkau.
- **Touch-friendly:** tombol dan kontrol jumlah nyaman digunakan pada layar sentuh.
- **Responsive:** desktop menampilkan katalog dan keranjang berdampingan; tablet dan HP memprioritaskan alur transaksi.
- **Low visual noise:** minim ornamen, hierarki informasi jelas, dan angka transaksi mudah dibaca.

### Palet warna

| Token | Warna | Penggunaan |
|---|---|---|
| Background | #111110 | Latar utama |
| Surface | #1B1B19 | Panel, sidebar, kartu |
| Surface elevated | #242421 | Modal, dropdown, hover |
| Border | #34342F | Garis pemisah |
| Primary | #F5A623 | Tombol utama, harga aktif, highlight |
| Primary hover | #FFB83F | Hover dan fokus |
| Text | #F5F3EE | Teks utama |
| Muted | #A19F96 | Teks sekunder |
| Success | #55B879 | Berhasil / stok tersedia |
| Danger | #E56B62 | Hapus / stok habis |

**Tipografi:** Inter atau sans-serif modern. Angka harga dan total dibuat tegas serta mudah dipindai.

---

## 2. Struktur Aplikasi

1. **Kasir** — halaman transaksi utama.
2. **Pesanan** — daftar transaksi dan status pesanan.
3. **Produk** — menu, kategori, harga, dan stok.
4. **Riwayat** — pencarian transaksi sebelumnya.
5. **Laporan** — ringkasan penjualan dan performa.
6. **Pengaturan** — profil usaha, printer, pajak, dan metode pembayaran.

Sidebar desktop dibuat ringkas dengan ikon dan label. Pada layar kecil, navigasi berubah menjadi bottom navigation atau drawer.

---

## 3. Desain Halaman Kasir

Halaman kasir adalah pusat aplikasi dan harus bisa digunakan tanpa banyak berpindah halaman.

### Desktop / laptop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ AYPOST       Cabang Utama  •  Kasir aktif              [Cari] [Notifikasi]  │
├──────────────┬────────────────────────────────────────────┬──────────────────┤
│              │                                            │                  │
│  ◉ Kasir     │  Selamat siang, Kasir                      │  PESANAN BARU    │
│  ▦ Pesanan   │  Mulai transaksi hari ini                  │  Meja / Takeaway │
│  ◫ Produk    │                                            │                  │
│  ◷ Riwayat   │  [Semua] [Makanan] [Minuman] [Paket]       │  Ayam Panggang   │
│  ▤ Laporan   │                                            │  1 x Rp 13.000   │
│              │  [Cari menu atau scan barcode........]     │  [-]  1  [+]     │
│              │                                            │                  │
│              │  MENU POPULER                              │  Nasi Putih      │
│              │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │  1 x Rp 5.000   │
│              │  │  FOTO    │ │  FOTO    │ │  FOTO    │    │  [-]  1  [+]     │
│              │  │ Ayam     │ │ Nasi     │ │ Es Teh   │    │                  │
│              │  │ Panggang │ │ Goreng   │ │          │    │  + Catatan       │
│              │  │ Rp13.000 │ │ Rp18.000 │ │ Rp5.000  │    │  ──────────────  │
│              │  └──────────┘ └──────────┘ └──────────┘    │  Subtotal        │
│              │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │  Rp 36.000      │
│              │  │  FOTO    │ │  FOTO    │ │  FOTO    │    │  Diskon          │
│              │  │ Paket    │ │ Ayam +   │ │ Jus      │    │  Rp 0            │
│              │  │ Kenyang  │ │ Sambal   │ │ Jeruk    │    │  TOTAL           │
│              │  │ Rp20.000 │ │ Rp15.000 │ │ Rp8.000  │    │  Rp 36.000      │
│              │  └──────────┘ └──────────┘ └──────────┘    │                  │
│              │                                            │  [ BAYAR ]       │
└──────────────┴────────────────────────────────────────────┴──────────────────┘
```

**Komposisi:**
- Sidebar kiri: navigasi dan identitas outlet.
- Area tengah: pencarian, filter kategori, dan grid produk bergambar.
- Panel kanan: keranjang yang tetap terlihat, kontrol kuantitas, subtotal, diskon, total, dan tombol bayar.
- Header: nama outlet, status kasir, pencarian cepat, dan akses profil.

### Kartu produk
- Foto makanan memenuhi bagian atas kartu dengan rasio konsisten.
- Nama produk maksimal dua baris.
- Harga tampil tegas dengan aksen amber.
- Badge stok atau varian bila diperlukan.
- Seluruh kartu dapat ditekan untuk menambahkan item ke keranjang.
- Produk tanpa foto menggunakan placeholder yang konsisten.

### Panel keranjang
- Nama item, harga satuan, dan jumlah.
- Tombol plus/minus dengan area sentuh yang cukup.
- Hapus item dan catatan khusus.
- Diskon per transaksi.
- Subtotal dan total akhir selalu terlihat.
- Keranjang kosong memiliki empty state informatif.

---

## 4. Alur Pembayaran

Saat tombol **Bayar** ditekan, tampilkan modal pembayaran yang fokus dan tidak membingungkan.

```text
┌──────────────────────────────────────────────────────┐
│  PEMBAYARAN                                    [ × ]  │
│                                                      │
│  Total yang harus dibayar                            │
│  Rp 36.000                                           │
│                                                      │
│  Metode pembayaran                                   │
│  [ Tunai ]  [ QRIS ]  [ Transfer ]  [ Kartu ]        │
│                                                      │
│  Uang diterima                                       │
│  [ Rp 50.000                                      ]  │
│                                                      │
│  Kembalian                                           │
│  Rp 14.000                                           │
│                                                      │
│  [          KONFIRMASI PEMBAYARAN          ]         │
└──────────────────────────────────────────────────────┘
```

Setelah pembayaran berhasil:
- Tampilkan konfirmasi transaksi.
- Sediakan aksi cetak struk dan bagikan struk.
- Tampilkan nomor transaksi dan nominal kembalian.
- Keranjang dikosongkan setelah transaksi benar-benar berhasil disimpan.

---

## 5. Halaman Lain

### Pesanan
Daftar pesanan dengan tab status seperti Semua, Diproses, Selesai, dan Dibatalkan. Setiap baris menampilkan nomor pesanan, waktu, item, total, dan status.

### Produk
Grid atau tabel produk dengan foto, nama, kategori, harga, stok, dan status aktif. Form tambah/edit produk menggunakan modal atau halaman khusus yang sederhana.

### Riwayat
Pencarian berdasarkan nomor transaksi, tanggal, kasir, atau metode pembayaran. Detail transaksi dapat dibuka untuk melihat item dan mencetak ulang struk.

### Laporan
Ringkasan omzet hari ini, jumlah transaksi, rata-rata transaksi, dan produk terlaris. Gunakan grafik sederhana yang mudah dibaca.

### Pengaturan
Profil outlet, data kasir, kategori, metode pembayaran, pajak/biaya layanan, format struk, dan preferensi tampilan.

---

## 6. Responsiveness

| Perangkat | Layout |
|---|---|
| Desktop (≥ 1200px) | Sidebar + katalog + keranjang permanen |
| Tablet (768–1199px) | Sidebar ringkas + katalog + keranjang yang bisa dibuka |
| Mobile (< 768px) | Header ringkas, kategori horizontal, grid 2 kolom, keranjang sebagai bottom sheet |

### Mobile checkout
- Tombol keranjang dan total belanja menempel di bagian bawah.
- Menekan tombol membuka bottom sheet keranjang.
- Tombol Bayar dibuat lebar dan mudah dijangkau ibu jari.
- Modal pembayaran menggunakan hampir seluruh layar.
- Tidak ada horizontal overflow.

---

## 7. Motion & Interaction

- Transisi halaman singkat dan halus (150–220 ms).
- Kartu produk memberi feedback saat ditekan.
- Penambahan produk memberi animasi kecil pada badge jumlah keranjang.
- Modal dan bottom sheet menggunakan fade + slide.
- Skeleton loading untuk katalog dan daftar transaksi.
- Toast singkat untuk sukses atau gagal.
- Hormati preferensi reduced-motion.

Animasi tidak boleh memperlambat proses kasir.

---

## 8. Komponen UI

- AppShell, Sidebar, Topbar, MobileNavigation
- CategoryTabs, ProductSearch, ProductGrid, ProductCard
- CartPanel, CartItem, OrderSummary
- PaymentModal, PaymentMethodSelector, CashInput
- ReceiptPreview, OrderStatusBadge
- EmptyState, LoadingSkeleton, Toast

Komponen dibuat reusable agar gaya dan perilaku konsisten di semua halaman.

---

## 9. Prinsip Implementasi

- README ini adalah **blueprint desain UI**, bukan klaim bahwa fitur transaksi atau backend sudah diimplementasikan.
- Pertahankan integrasi API yang sudah ada jika repository nantinya berisi kode aplikasi.
- Jangan menambahkan data transaksi palsu ke backend.
- Format mata uang menggunakan Rupiah (id-ID, IDR).
- Validasi input jumlah, harga, diskon, dan pembayaran.
- Status transaksi harus jelas: menunggu, berhasil, atau gagal.
- Sediakan state loading, empty, error, dan success untuk setiap halaman yang memuat data.

---

## 10. Urutan Pengerjaan

1. Design system, app shell, dan navigasi responsif.
2. Halaman Kasir: katalog produk dan keranjang interaktif.
3. Modal pembayaran dan preview struk.
4. Halaman Produk dan kategori.
5. Pesanan dan Riwayat.
6. Dashboard Laporan dan Pengaturan.
7. Integrasi API, validasi, dan pengujian responsif.

---

## Referensi Visual

Gaya visual mengikuti gambar referensi yang diberikan: **dark food photography, charcoal surfaces, rounded cards, dan aksen amber**. Untuk POS, estetika tersebut disesuaikan agar informasi harga, jumlah item, dan tindakan pembayaran tetap menjadi prioritas utama.

---

**Status:** Design blueprint — tahap persetujuan arah UI sebelum implementasi komponen.

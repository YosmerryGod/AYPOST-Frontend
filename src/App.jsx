import { useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, Bell, ChefHat, ChevronDown, CircleHelp, Clock3,
  CreditCard, Grid2X2, LayoutDashboard, LogOut, Minus, MoreHorizontal,
  Package, Plus, Printer, Search, Settings, ShoppingBag, ShoppingCart,
  SlidersHorizontal, Sparkles, Tag, Trash2, TrendingUp, Utensils,
  Wallet, X, Check, Banknote, QrCode, ReceiptText, Menu, XCircle
} from "lucide-react";

const products = [
  { id: 1, name: "Ayam Panggang", category: "Makanan", price: 13000, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=700&q=85", tag: "Terlaris", desc: "Ayam panggang bumbu khas" },
  { id: 2, name: "Nasi Goreng Spesial", category: "Makanan", price: 18000, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&q=85", tag: "Favorit", desc: "Nasi goreng dengan topping lengkap" },
  { id: 3, name: "Paket Kenyang", category: "Paket", price: 20000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=85", tag: "Hemat", desc: "Menu lengkap untuk satu orang" },
  { id: 4, name: "Ayam + Sambal", category: "Makanan", price: 15000, image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=700&q=85", tag: "", desc: "Ayam pilihan dan sambal" },
  { id: 5, name: "Jus Jeruk", category: "Minuman", price: 8000, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=700&q=85", tag: "", desc: "Jeruk segar tanpa pengawet" },
  { id: 6, name: "Es Teh Manis", category: "Minuman", price: 5000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=85", tag: "", desc: "Teh pilihan, dingin menyegarkan" },
  { id: 7, name: "Ayam + Nasi", category: "Paket", price: 17000, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&q=85", tag: "", desc: "Ayam panggang dengan nasi hangat" },
  { id: 8, name: "Kentang Goreng", category: "Snack", price: 10000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&q=85", tag: "", desc: "Kentang goreng renyah" }
];

const categories = ["Semua", "Makanan", "Paket", "Minuman", "Snack"];
const navItems = [
  { label: "Kasir", icon: ShoppingBag },
  { label: "Pesanan", icon: ReceiptText },
  { label: "Produk", icon: Package },
  { label: "Riwayat", icon: Clock3 },
  { label: "Laporan", icon: TrendingUp }
];
const money = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

function App() {
  const [activeNav, setActiveNav] = useState("Kasir");
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [cashReceived, setCashReceived] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderType, setOrderType] = useState("Makan di tempat");
  const [tableNumber, setTableNumber] = useState("01");
  const [successOrder, setSuccessOrder] = useState(null);
  const [toast, setToast] = useState("");

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "Semua" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [category, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const received = Number(cashReceived) || 0;
  const change = Math.max(0, received - total);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__aypostToast);
    window.__aypostToast = window.setTimeout(() => setToast(""), 2400);
  };

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    notify(product.name + " ditambahkan");
  };

  const changeQuantity = (id, amount) => {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  };

  const completePayment = () => {
    if (!cart.length) return;
    if (paymentMethod === "Tunai" && received < total) {
      notify("Nominal uang diterima belum cukup");
      return;
    }
    const order = {
      number: "AY-" + Date.now().toString().slice(-6),
      items: cart,
      total,
      subtotal,
      discount,
      method: paymentMethod,
      change: paymentMethod === "Tunai" ? change : 0,
      date: new Date().toLocaleString("id-ID")
    };
    setSuccessOrder(order);
    setCart([]);
    setDiscount(0);
    setCashReceived("");
    setPaymentOpen(false);
    setMobileCartOpen(false);
  };

  const openCheckout = () => {
    if (!cart.length) return notify("Tambahkan produk terlebih dahulu");
    setPaymentOpen(true);
    setCashReceived("");
  };

  const CartContent = () => (
    <>
      <div className="cart-heading">
        <div>
          <span className="eyebrow">TRANSAKSI AKTIF</span>
          <h2>Pesanan kamu <span className="count-pill">{itemCount}</span></h2>
        </div>
        <button className="icon-button subtle" onClick={() => setCart([])} disabled={!cart.length} aria-label="Kosongkan keranjang"><Trash2 size={17} /></button>
      </div>
      <div className="order-type">
        <button className={orderType === "Makan di tempat" ? "type-option active" : "type-option"} onClick={() => setOrderType("Makan di tempat")}>Dine in</button>
        <button className={orderType === "Bawa pulang" ? "type-option active" : "type-option"} onClick={() => setOrderType("Bawa pulang")}>Take away</button>
        {orderType === "Makan di tempat" && <select value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} aria-label="Nomor meja"><option value="01">Meja 01</option><option value="02">Meja 02</option><option value="03">Meja 03</option><option value="04">Meja 04</option></select>}
      </div>
      <div className="cart-items">
        {!cart.length ? (
          <div className="empty-cart">
            <div className="empty-cart-icon"><ShoppingCart size={25} /></div>
            <strong>Keranjang masih kosong</strong>
            <span>Pilih menu favorit untuk memulai transaksi.</span>
          </div>
        ) : cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <strong>{item.name}</strong>
              <span>{money(item.price)}</span>
              <div className="quantity-control">
                <button onClick={() => changeQuantity(item.id, -1)} aria-label="Kurangi"><Minus size={13} /></button>
                <b>{item.quantity}</b>
                <button onClick={() => changeQuantity(item.id, 1)} aria-label="Tambah"><Plus size={13} /></button>
              </div>
            </div>
            <strong className="line-total">{money(item.price * item.quantity)}</strong>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <button className="discount-trigger" onClick={() => setDiscount(discount ? 0 : Math.round(subtotal * 0.05))}><Tag size={15} /> {discount ? "Hapus diskon 5%" : "Gunakan diskon 5%"} <span>{discount ? "−" + money(discount) : "+"}</span></button>
        <div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
        <div className="summary-line"><span>Diskon</span><strong className="discount-value">− {money(discount)}</strong></div>
        <div className="summary-total"><span>Total pembayaran</span><strong>{money(total)}</strong></div>
        <button className="checkout-button" onClick={openCheckout} disabled={!cart.length}>Lanjut pembayaran <span><ArrowDownUp size={17} /></span></button>
        <div className="secure-note"><Check size={13} /> Transaksi aman dan tercatat</div>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Utensils size={19} /></div><span>AY<span>POST</span></span></div>
        <div className="outlet-switcher"><div className="outlet-avatar">A</div><div><strong>Ayam Panggang</strong><small>Cabang utama</small></div><ChevronDown size={15} /></div>
        <div className="nav-caption">MENU UTAMA</div>
        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "nav-link active" : "nav-link"} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === "Pesanan" && <i>3</i>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Butuh bantuan?</strong><span>Tim kami siap membantu kamu.</span><button onClick={() => notify("Pusat bantuan segera hadir")}>Pusat bantuan <span>↗</span></button></div>
          <button className="nav-link"><Settings size={18} /><span>Pengaturan</span></button>
          <div className="user-profile"><div className="user-avatar">EZ</div><div><strong>Ezy Kasir</strong><small>Administrator</small></div><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions"><div className="open-status"><span></span> Toko buka</div><button className="icon-button notification-button" onClick={() => notify("Tidak ada notifikasi baru")}><Bell size={18} /><i></i></button><div className="top-user"><div className="user-avatar">EZ</div><ChevronDown size={14} /></div></div>
        </header>

        {activeNav === "Kasir" ? (
          <div className="pos-layout">
            <section className="catalog-area">
              <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={13} /> HARI YANG PRODUKTIF</div><h1>Selamat datang, Ezy <span>✦</span></h1><p>Siap melayani pesanan berikutnya?</p></div><div className="date-chip"><Clock3 size={15} /> {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</div></div>
              <div className="quick-stats">
                <div className="stat-card"><div className="stat-icon amber"><Wallet size={17} /></div><div><span>Penjualan hari ini</span><strong>Rp 1.284.000</strong><small className="positive"><TrendingUp size={12} /> +12,8% dari kemarin</small></div></div>
                <div className="stat-card"><div className="stat-icon green"><ReceiptText size={17} /></div><div><span>Total transaksi</span><strong>48 pesanan</strong><small>Hari ini</small></div></div>
                <div className="stat-card"><div className="stat-icon purple"><Activity size={17} /></div><div><span>Rata-rata transaksi</span><strong>Rp 26.750</strong><small>Per pesanan</small></div></div>
              </div>
              <div className="catalog-heading"><div><span className="eyebrow">KATALOG MENU</span><h2>Pilih menu favorit</h2></div><button className="filter-button" onClick={() => notify("Semua menu sedang ditampilkan")}><SlidersHorizontal size={16} /> Filter</button></div>
              <div className="catalog-toolbar"><div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? "category-tab active" : "category-tab"} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama menu..." /><kbd>⌘ K</kbd></label></div>
              <div className="product-grid">
                {filteredProducts.map((product) => <button className="product-card" key={product.id} onClick={() => addToCart(product)}>
                  <div className="product-image-wrap"><img src={product.image} alt={product.name} loading="lazy" />{product.tag && <span className="product-tag">{product.tag}</span>}<span className="add-product"><Plus size={17} /></span></div>
                  <div className="product-details"><div><strong>{product.name}</strong><span>{product.desc}</span></div><b>{money(product.price)}</b></div>
                </button>)}
              </div>
              {!filteredProducts.length && <div className="no-results"><Search size={25} /><strong>Menu tidak ditemukan</strong><span>Coba kata kunci atau kategori lain.</span></div>}
              <div className="catalog-footnote"><ChefHat size={15} /> Menu diperbarui secara otomatis oleh outlet <span>•</span> {filteredProducts.length} produk</div>
            </section>
            <aside className="cart-panel"><CartContent /></aside>
          </div>
        ) : (
          <section className="placeholder-page"><div className="placeholder-icon"><LayoutDashboard size={28} /></div><span className="eyebrow">AYPOST WORKSPACE</span><h1>{activeNav}</h1><p>Halaman {activeNav.toLowerCase()} sedang disiapkan. Fokus utama saat ini adalah pengalaman kasir dan checkout.</p><button className="checkout-button" onClick={() => setActiveNav("Kasir")}>Kembali ke kasir <span>→</span></button></section>
        )}
      </main>

      <nav className="mobile-nav">{navItems.slice(0, 4).map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => setActiveNav(label)}><Icon size={19} /><span>{label}</span></button>)}</nav>
      {cart.length > 0 && <button className="mobile-cart-bar" onClick={() => setMobileCartOpen(true)}><span className="mobile-cart-count">{itemCount}</span><span>Lihat pesanan</span><strong>{money(total)}</strong><ChevronDown size={18} /></button>}

      {mobileCartOpen && <div className="mobile-cart-overlay" onClick={() => setMobileCartOpen(false)}><div className="mobile-cart-sheet" onClick={(event) => event.stopPropagation()}><div className="sheet-handle"></div><button className="sheet-close" onClick={() => setMobileCartOpen(false)}><X size={20} /></button><CartContent /></div></div>}

      {paymentOpen && <div className="modal-backdrop" onClick={() => setPaymentOpen(false)}><div className="payment-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><span className="eyebrow">CHECKOUT</span><h2>Selesaikan pembayaran</h2><p>Pastikan detail pesanan sudah benar.</p></div><button className="icon-button" onClick={() => setPaymentOpen(false)}><X size={19} /></button></div>
        <div className="payment-total"><span>Total yang harus dibayar</span><strong>{money(total)}</strong><small>{itemCount} item dalam pesanan</small></div>
        <div className="form-label">Metode pembayaran</div>
        <div className="payment-methods">
          {[{ name: "Tunai", icon: Banknote }, { name: "QRIS", icon: QrCode }, { name: "Transfer", icon: CreditCard }].map(({ name, icon: Icon }) => <button key={name} className={paymentMethod === name ? "payment-method active" : "payment-method"} onClick={() => setPaymentMethod(name)}><Icon size={19} /><span>{name}</span>{paymentMethod === name && <Check size={14} />}</button>)}
        </div>
        {paymentMethod === "Tunai" ? <div className="cash-section"><label className="form-label" htmlFor="cash">Uang diterima</label><div className="cash-input"><span>Rp</span><input id="cash" type="number" min="0" value={cashReceived} onChange={(event) => setCashReceived(event.target.value)} placeholder="Masukkan nominal" /></div><div className="quick-cash">{[total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000].filter((value, index, array) => array.indexOf(value) === index).map((value) => <button key={value} onClick={() => setCashReceived(String(value))}>{value === total ? "Uang pas" : money(value)}</button>)}</div><div className="change-row"><span>Kembalian</span><strong>{money(change)}</strong></div></div> : <div className="non-cash-note"><QrCode size={22} /><div><strong>{paymentMethod} dipilih</strong><span>Konfirmasi pembayaran akan dicatat sebagai transaksi demo.</span></div></div>}
        <button className="confirm-payment" onClick={completePayment}><Check size={18} /> Konfirmasi pembayaran <span>{money(total)}</span></button>
        <div className="secure-note"><Check size={13} /> Data transaksi demo tersimpan di sesi ini</div>
      </div></div>}

      {successOrder && <div className="modal-backdrop" onClick={() => setSuccessOrder(null)}><div className="success-modal" onClick={(event) => event.stopPropagation()}><div className="success-mark"><Check size={30} /></div><span className="eyebrow">TRANSAKSI BERHASIL</span><h2>Pembayaran diterima!</h2><p>Pesanan berhasil diselesaikan.</p><div className="receipt-card"><div><span>Nomor transaksi</span><strong>{successOrder.number}</strong></div><div><span>Waktu</span><strong>{successOrder.date}</strong></div><div><span>Metode pembayaran</span><strong>{successOrder.method}</strong></div><div className="receipt-total"><span>Total dibayar</span><strong>{money(successOrder.total)}</strong></div>{successOrder.change > 0 && <div><span>Kembalian</span><strong>{money(successOrder.change)}</strong></div>}</div><button className="confirm-payment" onClick={() => { setSuccessOrder(null); notify("Transaksi selesai"); }}><Printer size={17} /> Selesai</button><button className="text-button" onClick={() => setSuccessOrder(null)}>Tutup ringkasan</button></div></div>}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

export default App;
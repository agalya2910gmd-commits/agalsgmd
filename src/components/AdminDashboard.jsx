// components/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Inline SVG Icon Helper ────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  products:
    "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
  orders:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  customers:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  analytics: "M18 20V10 M12 20V4 M6 20v-6",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
  plus: "M12 5v14 M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  package:
    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 001 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  store: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  profile:
    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
};

// ── Seed Data ─────────────────────────────────────────────────────────────────
const seedProducts = [
  {
    id: 1,
    name: "Floral Midi Dress",
    category: "Women",
    price: 1299,
    stock: 24,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=60&h=60&fit=crop",
  },
  {
    id: 2,
    name: "Linen Blazer",
    category: "Women",
    price: 2499,
    stock: 8,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4de1?w=60&h=60&fit=crop",
  },
  {
    id: 3,
    name: "Casual Tote Bag",
    category: "Bags",
    price: 899,
    stock: 0,
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=60&h=60&fit=crop",
  },
  {
    id: 4,
    name: "Strappy Heels",
    category: "Shoes",
    price: 1799,
    stock: 15,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=60&h=60&fit=crop",
  },
  {
    id: 5,
    name: "Summer Sundress",
    category: "Women",
    price: 999,
    stock: 31,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=60&h=60&fit=crop",
  },
];

const seedOrders = [
  {
    id: "#ORD-001",
    customer: "Priya Sharma",
    date: "28 Mar 2025",
    total: 2298,
    status: "Delivered",
    items: 2,
  },
  {
    id: "#ORD-002",
    customer: "Ananya Verma",
    date: "29 Mar 2025",
    total: 1299,
    status: "Processing",
    items: 1,
  },
  {
    id: "#ORD-003",
    customer: "Meera Nair",
    date: "29 Mar 2025",
    total: 4298,
    status: "Shipped",
    items: 3,
  },
  {
    id: "#ORD-004",
    customer: "Kavita Singh",
    date: "30 Mar 2025",
    total: 899,
    status: "Pending",
    items: 1,
  },
  {
    id: "#ORD-005",
    customer: "Ritu Agarwal",
    date: "30 Mar 2025",
    total: 3598,
    status: "Delivered",
    items: 2,
  },
];

const seedCustomers = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@email.com",
    orders: 8,
    spent: 14200,
    joined: "Jan 2024",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Ananya Verma",
    email: "ananya@email.com",
    orders: 3,
    spent: 4800,
    joined: "Feb 2024",
    avatar: "AV",
  },
  {
    id: 3,
    name: "Meera Nair",
    email: "meera@email.com",
    orders: 12,
    spent: 22100,
    joined: "Nov 2023",
    avatar: "MN",
  },
  {
    id: 4,
    name: "Kavita Singh",
    email: "kavita@email.com",
    orders: 1,
    spent: 899,
    joined: "Mar 2025",
    avatar: "KS",
  },
  {
    id: 5,
    name: "Ritu Agarwal",
    email: "ritu@email.com",
    orders: 6,
    spent: 9600,
    joined: "Dec 2023",
    avatar: "RA",
  },
];

const weekSales = [65, 82, 54, 91, 78, 110, 95];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#f472b6" }) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const W = 120,
    H = 40,
    P = 4;
  const pts = data
    .map((v, i) => {
      const x = P + (i / (data.length - 1)) * (W - P * 2);
      const y = P + ((max - v) / (max - min || 1)) * (H - P * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const last = pts.split(" ").at(-1).split(",");
  return (
    <svg width={W} height={H}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: 140,
        padding: "0 4px",
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              background: i === 5 ? "var(--accent)" : "var(--bar-color)",
              height: `${(v / max) * 100}%`,
              borderRadius: "4px 4px 0 0",
              minHeight: 4,
            }}
          />
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    Active: { bg: "#d1fae5", color: "#065f46" },
    Inactive: { bg: "#fee2e2", color: "#991b1b" },
    Delivered: { bg: "#d1fae5", color: "#065f46" },
    Processing: { bg: "#fef3c7", color: "#92400e" },
    Shipped: { bg: "#dbeafe", color: "#1e40af" },
    Pending: { bg: "#f3f4f6", color: "#374151" },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, change, sparkData, color, icon }) {
  return (
    <div className="ad-stat-card" style={{ "--card-accent": color }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {label}
          </p>
          <h3
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {value}
          </h3>
          <p
            style={{
              fontSize: 12,
              color: change >= 0 ? "#10b981" : "#ef4444",
              marginTop: 6,
            }}
          >
            {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs last week
          </p>
        </div>
        <div
          style={{
            background: color + "20",
            padding: 10,
            borderRadius: 12,
            color,
          }}
        >
          <Icon d={icons[icon]} size={22} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Sparkline data={sparkData} color={color} />
      </div>
    </div>
  );
}

// ── Product Modal ─────────────────────────────────────────────────────────────
function ProductModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      category: "Women",
      price: "",
      stock: "",
      status: "Active",
    },
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 16,
          padding: 32,
          width: 420,
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            {initial ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <Icon d={icons.close} />
          </button>
        </div>
        {[
          ["Product Name", "name", "text"],
          ["Price (₹)", "price", "number"],
          ["Stock", "stock", "number"],
        ].map(([lbl, key, type]) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                display: "block",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {lbl}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              display: "block",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-primary)",
              fontSize: 14,
            }}
          >
            {["Women", "Bags", "Shoes", "Accessories"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1.5px solid var(--border)",
              background: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {initial ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD HOME ────────────────────────────────────────────────────────────
function DashboardHome() {
  return (
    <div>
      <div className="ad-stat-grid">
        <StatCard
          label="Total Revenue"
          value="₹2,18,450"
          change={12.4}
          sparkData={[40, 55, 45, 70, 60, 85, 95]}
          color="#f472b6"
          icon="trending"
        />
        <StatCard
          label="Total Orders"
          value="1,284"
          change={8.1}
          sparkData={[30, 40, 35, 55, 50, 65, 70]}
          color="#818cf8"
          icon="orders"
        />
        <StatCard
          label="Products"
          value="142"
          change={3.2}
          sparkData={[100, 105, 110, 108, 115, 130, 142]}
          color="#34d399"
          icon="package"
        />
        <StatCard
          label="Customers"
          value="3,891"
          change={-2.1}
          sparkData={[200, 210, 195, 220, 215, 205, 195]}
          color="#fb923c"
          icon="customers"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div className="ad-card">
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
              color: "var(--text-primary)",
            }}
          >
            Weekly Sales
          </h3>
          <BarChart data={weekSales} labels={weekLabels} />
        </div>
        <div className="ad-card">
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              color: "var(--text-primary)",
            }}
          >
            Recent Orders
          </h3>
          {seedOrders.slice(0, 4).map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {o.customer}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {o.id} · {o.date}
                </p>
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 4,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ₹{o.total.toLocaleString()}
                </p>
                <Badge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ad-card" style={{ marginTop: 20 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text-primary)",
          }}
        >
          Top Products
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {seedProducts.map((p, i) => (
            <div
              key={p.id}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span
                style={{
                  width: 22,
                  fontSize: 12,
                  fontWeight: 800,
                  color: "var(--text-muted)",
                }}
              >
                #{i + 1}
              </span>
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {p.name}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {p.category}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ₹{p.price.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: p.stock > 0 ? "#10b981" : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PRODUCTS PAGE ─────────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState(seedProducts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = (form) => {
    if (editing) {
      setProducts((ps) =>
        ps.map((p) =>
          p.id === editing.id
            ? { ...p, ...form, price: +form.price, stock: +form.stock }
            : p,
        ),
      );
    } else {
      setProducts((ps) => [
        ...ps,
        {
          ...form,
          id: Date.now(),
          price: +form.price,
          stock: +form.stock,
          image:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop",
        },
      ]);
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div>
      {(showModal || editing) && (
        <ProductModal
          initial={editing}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1.5px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text-primary)",
            width: 240,
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          <Icon d={icons.plus} size={16} /> Add Product
        </button>
      </div>
      <div className="ad-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--table-head)" }}>
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderTop: "1px solid var(--border)",
                  background: i % 2 === 0 ? "transparent" : "var(--row-alt)",
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {p.name}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  {p.category}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ₹{p.price.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    color: p.stock > 0 ? "#10b981" : "#ef4444",
                    fontWeight: 700,
                  }}
                >
                  {p.stock > 0 ? p.stock : "Out"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Badge status={p.status} />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setEditing(p)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon d={icons.edit} size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setProducts((ps) => ps.filter((x) => x.id !== p.id))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                    >
                      <Icon d={icons.trash} size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "var(--text-muted)",
            }}
          >
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
function OrdersPage() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered"];
  const filtered =
    filter === "All"
      ? seedOrders
      : seedOrders.filter((o) => o.status === filter);
  return (
    <div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              border: filter === s ? "none" : "1.5px solid var(--border)",
              background: filter === s ? "var(--accent)" : "var(--surface)",
              color: filter === s ? "#fff" : "var(--text-secondary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="ad-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--table-head)" }}>
              {["Order ID", "Customer", "Date", "Items", "Total", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr
                key={o.id}
                style={{
                  borderTop: "1px solid var(--border)",
                  background: i % 2 === 0 ? "transparent" : "var(--row-alt)",
                }}
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  {o.id}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {o.customer}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  {o.date}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  {o.items}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  ₹{o.total.toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Badge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── CUSTOMERS PAGE ────────────────────────────────────────────────────────────
function CustomersPage() {
  return (
    <div className="ad-card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--table-head)" }}>
            {["Customer", "Email", "Orders", "Total Spent", "Joined"].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {seedCustomers.map((c, i) => (
            <tr
              key={c.id}
              style={{
                borderTop: "1px solid var(--border)",
                background: i % 2 === 0 ? "transparent" : "var(--row-alt)",
              }}
            >
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {c.avatar}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {c.name}
                  </span>
                </div>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                {c.email}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                }}
              >
                {c.orders}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                ₹{c.spent.toLocaleString()}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                {c.joined}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── ANALYTICS PAGE ────────────────────────────────────────────────────────────
function AnalyticsPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div className="ad-card" style={{ gridColumn: "1 / -1" }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 20,
            color: "var(--text-primary)",
          }}
        >
          Weekly Revenue Chart
        </h3>
        <BarChart data={weekSales} labels={weekLabels} />
      </div>
      {[
        {
          label: "Conversion Rate",
          value: "3.6%",
          change: "+0.4%",
          color: "#34d399",
        },
        {
          label: "Avg. Order Value",
          value: "₹1,890",
          change: "+₹120",
          color: "#818cf8",
        },
        {
          label: "Return Rate",
          value: "2.1%",
          change: "-0.3%",
          color: "#f472b6",
        },
        {
          label: "New Customers",
          value: "248",
          change: "+18",
          color: "#fb923c",
        },
      ].map((m) => (
        <div key={m.label} className="ad-card">
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {m.label}
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginTop: 8,
            }}
          >
            {m.value}
          </p>
          <p
            style={{
              fontSize: 13,
              color: m.color,
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {m.change} this week
          </p>
        </div>
      ))}
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@nivest.com");
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ maxWidth: 520 }}>
      <div className="ad-card">
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            marginBottom: 24,
            color: "var(--text-primary)",
          }}
        >
          Profile Settings
        </h3>
        {[
          ["Display Name", name, setName, "text"],
          ["Email", email, setEmail, "email"],
        ].map(([lbl, val, setter, type]) => (
          <div key={lbl} style={{ marginBottom: 18 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                display: "block",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {lbl}
            </label>
            <input
              type={type}
              value={val}
              onChange={(e) => setter(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          style={{
            padding: "10px 28px",
            background: saved ? "#10b981" : "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            transition: "background 0.3s",
          }}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "products", label: "Products", icon: "products" },
  { key: "orders", label: "Orders", icon: "orders" },
  { key: "customers", label: "Customers", icon: "customers" },
  { key: "analytics", label: "Analytics", icon: "analytics" },
  { key: "settings", label: "Settings", icon: "settings" },
];

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const pageTitle =
    navItems.find((n) => n.key === active)?.label || "Dashboard";

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <DashboardHome />;
      case "products":
        return <ProductsPage />;
      case "orders":
        return <OrdersPage />;
      case "customers":
        return <CustomersPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <style>{`
        :root {
          --accent:         #e91e8c;
          --bg:             #f8f7f5;
          --surface:        #ffffff;
          --border:         #e8e4df;
          --text-primary:   #1a1412;
          --text-secondary: #4a3f3a;
          --text-muted:     #9e8e88;
          --sidebar-bg:     #1a1412;
          --table-head:     #faf9f7;
          --row-alt:        #fdfcfb;
          --bar-color:      #f8cde3;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ad-layout   { display: flex; height: 100vh; overflow: hidden; background: var(--bg); font-family: system-ui, sans-serif; }
        .ad-sidebar  { width: 240px; background: var(--sidebar-bg); display: flex; flex-direction: column; transition: width 0.3s ease; overflow: hidden; flex-shrink: 0; }
        .ad-sidebar.collapsed { width: 64px; }

        .ad-sidebar-logo { padding: 22px 18px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #2e2420; flex-shrink: 0; }
        .ad-logo-mark    { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 15px; flex-shrink: 0; }
        .ad-logo-text    { color: #fff; font-size: 15px; font-weight: 700; white-space: nowrap; }

        .ad-nav-item        { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; color: #c9b8b2; font-size: 13px; font-weight: 500; transition: all 0.2s; white-space: nowrap; overflow: hidden; border-left: 3px solid transparent; }
        .ad-nav-item:hover  { background: #2e2420; color: #fff; }
        .ad-nav-item.active { background: #2e2420; color: #fff; border-left-color: var(--accent); }
        .ad-nav-icon        { flex-shrink: 0; }

        .ad-main    { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .ad-topbar  { height: 60px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; }
        .ad-content { flex: 1; overflow-y: auto; padding: 24px; }

        .ad-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .ad-stat-card { background: var(--surface); border-radius: 14px; padding: 20px; border: 1px solid var(--border); border-top: 3px solid var(--card-accent); }
        .ad-card      { background: var(--surface); border-radius: 14px; padding: 20px; border: 1px solid var(--border); }

        @media (max-width: 1100px) { .ad-stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .ad-stat-grid { grid-template-columns: 1fr; } .ad-sidebar { width: 64px; } }
      `}</style>

      <div className="ad-layout">
        {/* ── Sidebar ── */}
        <div className={`ad-sidebar${sidebarOpen ? "" : " collapsed"}`}>
          <div className="ad-sidebar-logo">
            <div className="ad-logo-mark">A</div>
            {sidebarOpen && <span className="ad-logo-text">Admin Panel</span>}
          </div>

          <nav style={{ flex: 1, paddingTop: 8 }}>
            {navItems.map((item) => (
              <div
                key={item.key}
                className={`ad-nav-item${active === item.key ? " active" : ""}`}
                onClick={() => setActive(item.key)}
              >
                <span className="ad-nav-icon">
                  <Icon d={icons[item.icon]} size={18} />
                </span>
                {sidebarOpen && item.label}
              </div>
            ))}
          </nav>

          <div
            style={{
              borderTop: "1px solid #2e2420",
              paddingTop: 8,
              paddingBottom: 12,
            }}
          >
            <div className="ad-nav-item" onClick={() => navigate("/")}>
              <span className="ad-nav-icon">
                <Icon d={icons.store} size={18} />
              </span>
              {sidebarOpen && "Back to Store"}
            </div>
            <div className="ad-nav-item" onClick={() => navigate("/profile")}>
              <span className="ad-nav-icon">
                <Icon d={icons.profile} size={18} />
              </span>
              {sidebarOpen && "My Profile"}
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="ad-main">
          <div className="ad-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  display: "flex",
                }}
              >
                <Icon d={sidebarOpen ? icons.close : icons.menu} size={20} />
              </button>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {pageTitle}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Welcome back, Admin
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile")}
              >
                AD
              </div>
            </div>
          </div>

          <div className="ad-content">{renderPage()}</div>
        </div>
      </div>
    </>
  );
}

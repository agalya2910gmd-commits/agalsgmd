// components/SellerDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaBoxOpen,
  FaDollarSign,
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTachometerAlt,
  FaStore,
  FaTags,
  FaChartLine,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaTruck,
  FaUndo,
  FaMoneyBillWave,
  FaStar,
  FaReply,
  FaThumbsUp,
  FaSearch,
  FaFilter,
  FaSort,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const dashboardCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity:0; transform:translateX(100%); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slideOutRight {
    from { opacity:1; transform:translateX(0); }
    to   { opacity:0; transform:translateX(100%); }
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateY(-8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .sd-wrap * { box-sizing:border-box; }
  .sd-wrap { 
    font-family:'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
  }
  
  .sd-wrap .number, 
  .sd-wrap .stat-value,
  .sd-wrap .amount,
  .sd-wrap .sd-value-number {
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .dashboard-container {
    background:#f4f6f9; min-height:100vh;
    animation:fadeInUp 0.4s ease-out;
  }

  .sd-topnav {
    background:#ffffff; border-bottom:1px solid #e9ecef;
    padding:0 28px; height:64px;
    display:flex; justify-content:space-between; align-items:center;
    position:sticky; top:0; z-index:200;
    box-shadow:0 1px 0 #e9ecef, 0 2px 10px rgba(0,0,0,0.04);
  }
  .sd-logo {
    font-family:'Inter', sans-serif; color:#dbba5f;
    font-size:26px; font-weight:800; letter-spacing:-0.5px; text-decoration:none;
  }
  .sd-logo:hover { color:#b3934e; }
  .sd-topnav-right { display:flex; gap:20px; align-items:center; }
  .sd-nav-link {
    color:#5a6e8a; text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s;
  }
  .sd-nav-link:hover { color:#b3934e; }
  .sd-user-btn {
    background:none; border:none; cursor:pointer; padding:7px 12px; border-radius:12px;
    color:#1e293b; display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px;
    font-family:'Inter', sans-serif; transition:background 0.18s;
  }
  .sd-user-btn:hover { background:#f8f9fa; }
  .sd-dropdown {
    position:absolute; top:48px; right:0;
    background:#ffffff; border-radius:14px; min-width:245px; z-index:300;
    box-shadow:0 12px 40px rgba(0,0,0,0.12); border:1px solid #e9ecef;
    animation:fadeInUp 0.18s ease; overflow:hidden;
  }
  .sd-dropdown-head {
    padding:16px; display:flex; gap:12px; align-items:center;
    border-bottom:1px solid #e9ecef; background:#fafafa;
  }
  .sd-dropdown-btn {
    width:100%; text-align:left; padding:12px 16px; background:none; border:none;
    cursor:pointer; font-size:14px; font-weight:500; font-family:'Inter', sans-serif;
    display:flex; align-items:center; gap:10px; transition:background 0.15s; color:#1e293b;
  }
  .sd-dropdown-btn:hover { background:#f8f9fa; }

  .dashboard-sidebar {
    background:#ffffff; border-right:1px solid #e9ecef;
    height:calc(100vh - 64px); min-height:calc(100vh - 64px);
    overflow-y:auto; overflow-x:hidden;
    position:sticky; top:64px;
    box-shadow:2px 0 14px rgba(0,0,0,0.03);
    scrollbar-width:thin; scrollbar-color:#e2e8f0 transparent;
  }
  .dashboard-sidebar::-webkit-scrollbar { width:4px; }
  .dashboard-sidebar::-webkit-scrollbar-track { background:transparent; }
  .dashboard-sidebar::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
  .dashboard-sidebar::-webkit-scrollbar-thumb:hover { background:#d4af6a; }

  .sd-sb-inner { padding:20px 0 40px; }
  .sd-sb-brand { padding:0 20px 18px; border-bottom:1px solid #f1f5f9; margin-bottom:14px; }
  .sd-sb-name  { font-family:'Inter', sans-serif; color:#b3934e; font-size:18px; font-weight:800; letter-spacing:-0.3px; margin:0 0 3px; }
  .sd-sb-user  { font-size:12px; color:#94a3b8; font-weight:500; }
  .sd-sb-sec   { font-size:10px; font-weight:700; color:#94a3b8; letter-spacing:1.2px; text-transform:uppercase; padding:10px 20px 5px; }

  .sidebar-link {
    display:flex; align-items:center; gap:11px;
    padding:11px 16px; margin:2px 10px; border-radius:11px;
    color:#5a6e8a; cursor:pointer; font-weight:500; font-size:13.5px;
    font-family:'Inter', sans-serif;
    background:none; border:none; width:calc(100% - 20px);
    transition:all 0.25s cubic-bezier(0.4,0,0.2,1);
    text-decoration:none; position:relative; overflow:hidden;
  }
  .sidebar-link:hover { background:#f8f9fa; color:#1e293b; transform:translateX(3px); }
  .sidebar-link.active {
    background:linear-gradient(135deg,#fff7ed,#fffbf5);
    color:#b3934e; font-weight:700; border-left:3px solid #b3934e; padding-left:13px;
  }
  .sd-nb { margin-left:auto; background:#b3934e; color:white; font-size:10px; font-weight:700; padding:2px 7px; border-radius:20px; min-width:20px; text-align:center; }
  .sd-nb.danger { background:#ef4444; }
  .sd-divider { margin:14px 18px; border:none; border-top:1px solid #f1f5f9; }

  .sd-main { padding:30px 36px; }

  .sd-ph { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .sd-pt { font-family:'Inter', sans-serif; font-size:24px; font-weight:800; color:#0f172a; margin:0 0 4px; letter-spacing:-0.3px; }
  .sd-ps { font-size:13px; color:#64748b; margin:0; }

  .stat-card {
    background:#ffffff; border-radius:18px; padding:20px;
    border:1px solid #e9ecef;
    box-shadow:0 1px 4px rgba(0,0,0,0.04);
    transition:all 0.32s cubic-bezier(0.4,0,0.2,1);
    cursor:pointer; position:relative; overflow:hidden;
    animation:fadeInUp 0.45s ease-out both;
  }
  .stat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#b3934e,#d4af6a);
    transform:scaleX(0); transform-origin:left; transition:transform 0.32s ease;
  }
  .stat-card:hover { transform:translateY(-5px); box-shadow:0 14px 30px rgba(179,147,78,0.14); border-color:#d4af6a; }
  .stat-card:hover::before { transform:scaleX(1); }
  .stat-icon-box { width:44px; height:44px; background:linear-gradient(135deg,#fff7ed,#fef3c7); border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:13px; }
  .stat-value { font-family:'Inter', sans-serif; font-size:30px; font-weight:800; color:#0f172a; line-height:1; letter-spacing:-0.02em; font-feature-settings: "tnum"; font-variant-numeric: tabular-nums; }
  .stat-label { font-size:11px; font-weight:700; color:#64748b; margin-top:6px; text-transform:uppercase; letter-spacing:0.5px; }
  .stat-trend { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:700; margin-top:7px; }
  .trend-up   { color:#10b981; }
  .trend-down { color:#ef4444; }

  .dashboard-card {
    background:#ffffff; border:1px solid #e9ecef; border-radius:18px;
    box-shadow:0 1px 4px rgba(0,0,0,0.04);
    transition:box-shadow 0.22s;
    animation:fadeInUp 0.4s ease-out both;
  }
  .dashboard-card:hover { box-shadow:0 8px 26px rgba(0,0,0,0.07); }
  .sd-ch { padding:17px 22px; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; }
  .sd-ct { font-size:15px; font-weight:700; color:#0f172a; margin:0; }
  .sd-cs { font-size:12px; color:#94a3b8; margin-top:2px; }

  .dashboard-table { width:100%; border-collapse:collapse; }
  .dashboard-table thead th {
    padding:11px 16px; background:#f8fafc; color:#64748b;
    font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.7px;
    border-bottom:1px solid #e9ecef; text-align:left; white-space:nowrap;
    font-family:'Inter', sans-serif;
  }
  .dashboard-table tbody td { padding:13px 16px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#1e293b; vertical-align:middle; font-family:'Inter', sans-serif; }
  .dashboard-table tbody tr { transition:background 0.15s; }
  .dashboard-table tbody tr:hover { background:#fafbfc; }
  .dashboard-table tbody tr:last-child td { border-bottom:none; }

  .badge-status { padding:5px 12px; border-radius:20px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; font-family:'Inter', sans-serif; }
  .badge-paid      { background:#d1fae5; color:#065f46; }
  .badge-pending   { background:#fef3c7; color:#92400e; }
  .badge-shipped   { background:#dbeafe; color:#1e40af; }
  .badge-delivered { background:#d1fae5; color:#065f46; }
  .badge-processing{ background:#ede9fe; color:#5b21b6; }
  .badge-cancelled { background:#fee2e2; color:#991b1b; }
  .badge-active    { background:#d1fae5; color:#065f46; }
  .badge-lowstock  { background:#fef3c7; color:#92400e; }
  .badge-outstock  { background:#fee2e2; color:#991b1b; }
  .badge-gray      { background:#f1f5f9; color:#475569; }

  .btn-gold {
    background:linear-gradient(135deg,#b3934e,#d4af6a); border:none; color:#fff;
    font-weight:700; padding:10px 22px; border-radius:11px; font-size:13px;
    font-family:'Inter', sans-serif; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px;
    box-shadow:0 4px 14px rgba(179,147,78,0.3); transition:all 0.25s ease; position:relative; overflow:hidden;
  }
  .btn-gold::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent); transition:left 0.4s; }
  .btn-gold:hover::before { left:100%; }
  .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(179,147,78,0.4); }
  .btn-outline-gold { background:transparent; border:1.5px solid #b3934e; color:#b3934e; border-radius:10px; padding:7px 16px; font-size:12.5px; font-weight:600; font-family:'Inter', sans-serif; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:6px; }
  .btn-outline-gold:hover { background:#fff7ed; transform:translateY(-1px); box-shadow:0 4px 12px rgba(179,147,78,0.16); }
  .btn-icon { background:none; border:none; padding:7px; border-radius:8px; cursor:pointer; transition:background 0.15s; display:inline-flex; align-items:center; justify-content:center; }
  .btn-icon:hover { background:#f1f5f9; }

  .chart-bars { display:flex; align-items:flex-end; gap:10px; height:150px; padding-top:8px; }
  .chart-col  { flex:1; display:flex; flex-direction:column; align-items:center; gap:7px; justify-content:flex-end; height:100%; }
  .chart-bar  { width:100%; border-radius:7px 7px 3px 3px; min-height:14px; background:linear-gradient(180deg,#d4af6a,#b3934e); transition:all 0.5s cubic-bezier(0.4,0,0.2,1); cursor:pointer; }
  .chart-bar:hover { filter:brightness(1.1); transform:scaleY(1.05); transform-origin:bottom; }
  .chart-bar.today { background:linear-gradient(180deg,#f0c040,#b3934e); }
  .chart-lbl { font-size:10.5px; color:#94a3b8; font-weight:600; font-family:'Inter', sans-serif; }

  .sd-prog { background:#f1f5f9; border-radius:6px; height:7px; overflow:hidden; }
  .sd-prog-bar { height:100%; border-radius:6px; background:linear-gradient(90deg,#b3934e,#d4af6a); transition:width 0.8s ease; }

  /* ── REVIEWS NEW DESIGN ── */
  .rv-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
  .rv-tabs { display:flex; gap:0; border-bottom:2px solid #e9ecef; margin-bottom:20px; }
  .rv-tab {
    padding:10px 0; margin-right:28px; font-size:14px; font-weight:600;
    color:#94a3b8; border:none; background:none; cursor:pointer;
    border-bottom:2px solid transparent; margin-bottom:-2px;
    font-family:'Inter', sans-serif; transition:all 0.2s;
  }
  .rv-tab.active { color:#b3934e; border-bottom-color:#b3934e; }
  .rv-tab-add { margin-left:auto; font-size:13px; color:#b3934e; background:none; border:none; cursor:pointer; font-family:'Inter', sans-serif; font-weight:600; }

  .rv-ai-banner {
    padding:16px 20px; border-radius:14px; margin-bottom:18px;
    background:linear-gradient(135deg,rgba(239,68,68,0.07),rgba(201,161,74,0.04));
    border:1px solid #fecaca; border-left:4px solid #ef4444;
  }
  .rv-ai-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .rv-ai-issues { display:flex; gap:24px; flex-wrap:wrap; }
  .rv-ai-issue { display:flex; align-items:center; gap:8px; }
  .rv-ai-bar { width:64px; height:4px; background:#e9ecef; border-radius:2px; overflow:hidden; }

  .rv-filters { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:18px; }
  .rv-search-wrap { position:relative; flex:1; min-width:180px; }
  .rv-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:13px; pointer-events:none; }
  .rv-inp {
    width:100%; padding:9px 13px 9px 34px; border:1.5px solid #e2e8f0; border-radius:10px;
    font-size:13px; font-family:'Inter', sans-serif; color:#1e293b; background:#fff; outline:none;
    transition:border-color 0.2s;
  }
  .rv-inp:focus { border-color:#b3934e; box-shadow:0 0 0 3px rgba(179,147,78,0.1); }
  .rv-sel {
    padding:9px 13px; border:1.5px solid #e2e8f0; border-radius:10px;
    font-size:12.5px; font-family:'Inter', sans-serif; color:#475569; background:#fff;
    outline:none; cursor:pointer; font-weight:500;
  }
  .rv-sel:focus { border-color:#b3934e; }

  .rv-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(420px, 1fr));
    gap:16px;
  }
  .rv-card {
    background:#ffffff; border:1px solid #eef2f6; border-radius:16px;
    padding:0; overflow:hidden; position:relative;
    transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
    box-shadow:0 2px 8px rgba(0,0,0,0.03);
    display:flex; flex-direction:column;
    animation:fadeInUp 0.35s ease-out both;
  }
  .rv-card:hover { transform:translateY(-3px); box-shadow:0 16px 28px rgba(179,147,78,0.1); border-color:#e6d5b8; }
  .rv-card-selected { border-color:#b3934e; box-shadow:0 0 0 2px rgba(179,147,78,0.2); }

  .rv-card-top { padding:16px 18px 12px 46px; border-bottom:1px solid #f4f6f9; }
  .rv-card-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .rv-order-id { font-size:11.5px; color:#94a3b8; font-weight:600; font-family:'Inter', sans-serif; }
  .rv-card-rating-date { display:flex; align-items:center; gap:10px; }
  .rv-card-date { font-size:11px; color:#cbd5e1; font-weight:500; }

  .rv-product-label { font-size:10px; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; }
  .rv-product-name { font-size:13.5px; font-weight:700; color:#b3934e; cursor:pointer; transition:color 0.15s; }
  .rv-product-name:hover { color:#8a6f3a; }

  .rv-card-body { padding:14px 18px; flex:1; }
  .rv-comment { font-size:13px; color:#475569; line-height:1.55; margin:0; }

  .rv-card-customer { display:flex; align-items:center; gap:10px; margin-top:12px; }
  .rv-avatar { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:white; flex-shrink:0; }
  .rv-customer-name { font-size:13px; font-weight:600; color:#1e293b; }
  .rv-verified { font-size:10px; color:#16a34a; font-weight:600; margin-top:1px; }

  .rv-images { display:flex; gap:6px; margin-left:auto; }
  .rv-img-thumb { width:46px; height:46px; border-radius:8px; object-fit:cover; cursor:pointer; border:1px solid #e9ecef; transition:transform 0.15s; }
  .rv-img-thumb:hover { transform:scale(1.06); }
  .rv-img-more { width:46px; height:46px; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:11px; color:#64748b; font-weight:700; font-family:'Inter', sans-serif; }

  .rv-reply-box { padding:14px 18px; background:#fafcff; border-top:1px solid #f1f5f9; }
  .rv-reply-text { background:#f1f5f9; border-left:3px solid #b3934e; border-radius:0 10px 10px 0; padding:10px 14px; font-size:12.5px; color:#475569; line-height:1.5; }
  .rv-reply-date { font-size:10px; color:#94a3b8; margin-top:5px; font-family:'Inter', sans-serif; }
  .rv-reply-input-row { display:flex; gap:8px; margin-top:10px; }
  .rv-reply-field { flex:1; padding:9px 13px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:13px; font-family:'Inter', sans-serif; outline:none; transition:border-color 0.2s; }
  .rv-reply-field:focus { border-color:#b3934e; box-shadow:0 0 0 3px rgba(179,147,78,0.1); }

  .rv-card-actions { display:flex; gap:8px; align-items:center; padding:12px 18px; border-top:1px solid #f4f6f9; background:#fafbfc; }
  .rv-action-btn {
    padding:5px 14px; border-radius:20px; font-size:11.5px; font-weight:600;
    font-family:'Inter', sans-serif; cursor:pointer; transition:all 0.18s;
    border:1.5px solid #e2e8f0; background:#fff; color:#64748b;
  }
  .rv-action-btn:hover { background:#f8f9fa; border-color:#b3934e; color:#b3934e; }
  .rv-helpful-btn { display:flex; align-items:center; gap:5px; padding:5px 12px; border-radius:20px; font-size:11.5px; font-weight:600; font-family:'Inter', sans-serif; cursor:pointer; transition:all 0.18s; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; margin-left:auto; }
  .rv-helpful-btn:hover { background:#f8f9fa; border-color:#b3934e; color:#b3934e; }
  .rv-reply-btn-sm { display:flex; align-items:center; gap:5px; padding:5px 12px; border-radius:20px; font-size:11.5px; font-weight:600; font-family:'Inter', sans-serif; cursor:pointer; transition:all 0.18s; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; }
  .rv-reply-btn-sm:hover { background:#f8f9fa; border-color:#b3934e; color:#b3934e; }

  .rv-checkbox { position:absolute; top:16px; left:16px; width:18px; height:18px; cursor:pointer; z-index:1; }

  .rv-bulk-bar {
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
    background:#1e293b; border-radius:14px; padding:12px 24px;
    display:flex; gap:12px; align-items:center; z-index:1000;
    box-shadow:0 8px 30px rgba(0,0,0,0.22); animation:fadeInUp 0.22s ease;
  }
  .rv-bulk-count { font-size:13px; color:#cbd5e1; font-weight:600; font-family:'Inter', sans-serif; white-space:nowrap; }
  .rv-bulk-btn { padding:7px 16px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Inter', sans-serif; cursor:pointer; border:1.5px solid #334155; background:transparent; color:#94a3b8; transition:all 0.18s; }
  .rv-bulk-btn:hover { background:#334155; color:#e2e8f0; }
  .rv-bulk-btn.primary { background:linear-gradient(135deg,#b3934e,#d4af6a); color:white; border-color:transparent; }
  .rv-bulk-btn.primary:hover { opacity:0.9; }

  .rv-star { font-size:13px; }

  .rv-empty { padding:56px 24px; text-align:center; }
  .rv-empty-icon { font-size:48px; margin-bottom:14px; }
  .rv-empty-text { font-size:15px; font-weight:600; color:#64748b; margin-bottom:16px; }

  /* ── ALERT ── */
  .sd-alert { padding:13px 18px; border-radius:12px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:10px; margin-bottom:18px; font-family:'Inter', sans-serif; }
  .sd-alert-warn { background:#fef3c7; color:#92400e; border:1px solid #fde68a; }

  /* ── FORM ── */
  .sd-lbl { font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; display:block; font-family:'Inter', sans-serif; }
  .sd-inp { width:100%; padding:10px 13px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:13px; font-family:'Inter', sans-serif; color:#1e293b; background:#fff; outline:none; transition:border-color 0.2s; }
  .sd-inp:focus { border-color:#b3934e; box-shadow:0 0 0 3px rgba(179,147,78,0.1); }
  .sd-sel { width:100%; padding:10px 13px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:13px; font-family:'Inter', sans-serif; color:#1e293b; background:#fff; outline:none; cursor:pointer; }

  /* ── DRAWER ── */
  .drawer-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:1100; animation:fadeInUp 0.18s ease; }
  .drawer-container { position:fixed; top:0; right:0; bottom:0; width:500px; max-width:92vw; background:#fff; z-index:1101; box-shadow:-6px 0 40px rgba(0,0,0,0.12); display:flex; flex-direction:column; animation:slideInRight 0.28s ease-out; }
  .drawer-container.closing { animation:slideOutRight 0.28s ease-out forwards; }
  .drawer-header { padding:20px 24px; border-bottom:1px solid #e9ecef; display:flex; justify-content:space-between; align-items:center; }
  .drawer-title { font-family:'Inter', sans-serif; font-size:18px; font-weight:800; color:#0f172a; margin:0; letter-spacing:-0.3px; }
  .drawer-close { background:none; border:none; font-size:18px; cursor:pointer; color:#94a3b8; padding:7px; border-radius:50%; transition:all 0.18s; display:flex; align-items:center; }
  .drawer-close:hover { background:#f1f5f9; color:#475569; }
  .drawer-body { flex:1; overflow-y:auto; padding:22px 24px; font-family:'Inter', sans-serif; }
  .drawer-body::-webkit-scrollbar { width:4px; }
  .drawer-body::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }

  /* ── MODAL ── */
  .sd-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:1050; display:flex; align-items:center; justify-content:center; animation:fadeInUp 0.18s ease; }
  .sd-modal { background:#fff; border-radius:20px; width:500px; max-width:95vw; max-height:92vh; overflow-y:auto; box-shadow:0 24px 56px rgba(0,0,0,0.18); animation:fadeInUp 0.22s ease; }
  .sd-modal-header { padding:20px 24px; border-bottom:1px solid #e9ecef; display:flex; align-items:center; justify-content:space-between; }
  .sd-modal-title  { font-family:'Inter', sans-serif; font-size:17px; font-weight:800; color:#0f172a; letter-spacing:-0.2px; }
  .sd-modal-body   { padding:24px; }
  .sd-modal-footer { padding:16px 24px; border-top:1px solid #e9ecef; display:flex; gap:10px; justify-content:flex-end; }

  /* ── TOAST ── */
  .sd-toast { position:fixed; top:20px; right:20px; z-index:9999; padding:13px 20px; border-radius:12px; font-size:13px; font-weight:700; font-family:'Inter', sans-serif; box-shadow:0 6px 24px rgba(0,0,0,0.12); display:flex; align-items:center; gap:9px; animation:toastIn 0.22s ease; }
  .sd-toast-ok  { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
  .sd-toast-err { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }

  /* ── TIMELINE ── */
  .sd-tl-item { display:flex; gap:12px; align-items:flex-start; margin-bottom:12px; }
  .sd-tl-dot { width:22px; height:22px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; margin-top:1px; }
  .sd-tl-dot.done { background:#10b981; color:white; }
  .sd-tl-dot.todo { background:#e2e8f0; color:#94a3b8; }
  .sd-tl-text { font-size:13px; padding-top:2px; font-family:'Inter', sans-serif; }

  /* ── METRIC ROW ── */
  .sd-mrow { display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid #f1f5f9; }
  .sd-mrow:last-child { border-bottom:none; }

  /* ── RESPONSIVE ── */
  @media (max-width:768px) {
    .sidebar-link span:not(.sd-nb) { display:none; }
    .sidebar-link { justify-content:center; padding:11px; }
    .sd-main { padding:16px 14px; }
    .drawer-container { width:100%; }
    .sd-topnav { padding:0 16px; }
    .rv-grid { grid-template-columns:1fr; }
  }
`;

if (!document.getElementById("sd-css-v2")) {
  const s = document.createElement("style");
  s.id = "sd-css-v2";
  s.textContent = dashboardCSS;
  document.head.appendChild(s);
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockProducts = [
  {
    id: "P003",
    name: "Linen Shirt",
    category: "Apparel",
    price: 79,
    stock: 5,
    status: "Low Stock",
    sales: 42,
  },
  {
    id: "P001",
    name: "Classic Tee",
    category: "Apparel",
    price: 49,
    stock: 34,
    status: "Active",
    sales: 128,
  },
  {
    id: "P002",
    name: "Signature Hoodie",
    category: "Apparel",
    price: 89,
    stock: 12,
    status: "Active",
    sales: 89,
  },
  
  {
    id: "P004",
    name: "Slim Chinos",
    category: "Bottomwear",
    price: 99,
    stock: 0,
    status: "Out of Stock",
    sales: 67,
  },
  {
    id: "P005",
    name: "Canvas Sneakers",
    category: "Footwear",
    price: 119,
    stock: 21,
    status: "Active",
    sales: 104,
  },
  {
    id: "P006",
    name: "Leather Belt",
    category: "Accessories",
    price: 39,
    stock: 45,
    status: "Active",
    sales: 76,
  },
];
const mockOrders = [
  {
    id: "#ORD-1001",
    customer: "Alex Morgan",
    phone: "+91 98765 43210",
    date: "2025-03-28",
    total: 178,
    status: "Delivered",
    items: 3,
    product: "Classic Tee × 3",
    city: "Mumbai",
    payment: "Paid",
  },
  {
    id: "#ORD-1002",
    customer: "Jamie Lin",
    phone: "+91 87654 32109",
    date: "2025-03-27",
    total: 89,
    status: "Processing",
    items: 1,
    product: "Signature Hoodie × 1",
    city: "Delhi",
    payment: "COD",
  },
  {
    id: "#ORD-1003",
    customer: "Taylor Reed",
    phone: "+91 76543 21098",
    date: "2025-03-26",
    total: 267,
    status: "Shipped",
    items: 4,
    product: "Linen Shirt × 2, Belt × 2",
    city: "Bangalore",
    payment: "Paid",
  },
  {
    id: "#ORD-1004",
    customer: "Casey Wong",
    phone: "+91 65432 10987",
    date: "2025-03-25",
    total: 49,
    status: "Delivered",
    items: 1,
    product: "Classic Tee × 1",
    city: "Chennai",
    payment: "Paid",
  },
  {
    id: "#ORD-1005",
    customer: "Jordan Blake",
    phone: "+91 54321 09876",
    date: "2025-03-24",
    total: 199,
    status: "Pending",
    items: 2,
    product: "Canvas Sneakers × 1",
    city: "Pune",
    payment: "COD",
  },
  {
    id: "#ORD-1006",
    customer: "Sam Rivers",
    phone: "+91 43210 98765",
    date: "2025-03-23",
    total: 119,
    status: "Cancelled",
    items: 1,
    product: "Canvas Sneakers × 1",
    city: "Hyderabad",
    payment: "Refunded",
  },
  {
    id: "#ORD-1007",
    customer: "Riya Sharma",
    phone: "+91 32109 87654",
    date: "2025-03-22",
    total: 317,
    status: "Delivered",
    items: 5,
    product: "Mixed items",
    city: "Kolkata",
    payment: "Paid",
  },
];
const mockReturns = [
  {
    id: "#RET-001",
    orderId: "#ORD-1006",
    customer: "Sam Rivers",
    reason: "Size issue",
    product: "Canvas Sneakers",
    amount: 119,
    status: "Approved",
    date: "2025-03-24",
  },
  {
    id: "#RET-002",
    orderId: "#ORD-1001",
    customer: "Alex Morgan",
    reason: "Defective product",
    product: "Classic Tee",
    amount: 49,
    status: "Pending",
    date: "2025-03-29",
  },
];
const mockReviews = [
  {
    id: 1,
    customer: "Alex Morgan",
    customerAvatar: "AM",
    product: "Classic Tee",
    productId: "P001",
    orderId: "ORD-1001",
    rating: 5,
    comment:
      "Excellent quality, fits perfectly! The fabric is soft and the color is exactly as shown. Will definitely buy more colors.",
    date: "2025-03-29",
    helpful: 12,
    replied: true,
    replyText:
      "Thank you Alex! We're so glad you loved the Classic Tee. Looking forward to serving you again! 🙏",
    replyDate: "2025-03-30",
    verified: true,
    reviewImages: [],
  },
  {
    id: 2,
    customer: "Taylor Reed",
    customerAvatar: "TR",
    product: "Linen Shirt",
    productId: "P003",
    orderId: "ORD-1003",
    rating: 4,
    comment:
      "Good material, slightly large sizing. I usually wear M but this fits like L. Still comfortable though.",
    date: "2025-03-27",
    helpful: 8,
    replied: false,
    replyText: "",
    replyDate: "",
    verified: true,
    reviewImages: [],
  },
  {
    id: 3,
    customer: "Casey Wong",
    customerAvatar: "CW",
    product: "Canvas Sneakers",
    productId: "P005",
    orderId: "ORD-1004",
    rating: 5,
    comment:
      "Very comfortable, great for daily wear. Been using them for a week and they're super comfortable. Highly recommended!",
    date: "2025-03-26",
    helpful: 15,
    replied: true,
    replyText:
      "Thanks Casey! Our Canvas Sneakers are definitely a customer favorite. Enjoy your walks! 🏃‍♂️",
    replyDate: "2025-03-27",
    verified: false,
    reviewImages: [],
  },
  {
    id: 4,
    customer: "Jordan Blake",
    customerAvatar: "JB",
    product: "Slim Chinos",
    productId: "P004",
    orderId: "ORD-1005",
    rating: 3,
    comment:
      "Average quality, expected better stitching. The fit is good but there are loose threads near the pockets.",
    date: "2025-03-25",
    helpful: 3,
    replied: false,
    replyText: "",
    replyDate: "",
    verified: true,
    reviewImages: [],
  },
  {
    id: 5,
    customer: "Priya Patel",
    customerAvatar: "PP",
    product: "Signature Hoodie",
    productId: "P002",
    orderId: "ORD-1002",
    rating: 5,
    comment:
      "Best hoodie ever! Super cozy and warm. Perfect for winter evenings. The quality is premium.",
    date: "2025-03-24",
    helpful: 24,
    replied: true,
    replyText:
      "Thank you Priya! The Signature Hoodie is our bestseller for a reason. Stay warm! ",
    replyDate: "2025-03-25",
    verified: true,
    reviewImages: [],
  },
  {
    id: 6,
    customer: "Rahul Sharma",
    customerAvatar: "RS",
    product: "Leather Belt",
    productId: "P006",
    orderId: "ORD-1006",
    rating: 4,
    comment:
      "Good quality leather, sturdy buckle. Would have preferred a slightly softer material but overall good value.",
    date: "2025-03-23",
    helpful: 6,
    replied: false,
    replyText: "",
    replyDate: "",
    verified: false,
    reviewImages: [],
  },
  {
    id: 7,
    customer: "Neha Gupta",
    customerAvatar: "NG",
    product: "Classic Tee",
    productId: "P001",
    orderId: "ORD-1007",
    rating: 5,
    comment:
      "Love this tee! Perfect for everyday wear. The fabric doesn't shrink after washing which is a huge plus.",
    date: "2025-03-22",
    helpful: 18,
    replied: false,
    replyText: "",
    replyDate: "",
    verified: true,
    reviewImages: [],
  },
  {
    id: 8,
    customer: "Vikram Singh",
    customerAvatar: "VS",
    product: "Canvas Sneakers",
    productId: "P005",
    orderId: "ORD-1003",
    rating: 4,
    comment:
      "Good shoes, very comfortable. Only issue is they run slightly small. Would recommend going half size up.",
    date: "2025-03-21",
    helpful: 9,
    replied: true,
    replyText:
      "Thanks for the feedback Vikram! We'll note that for future sizing guides. Glad you like them overall! 👟",
    replyDate: "2025-03-22",
    verified: false,
    reviewImages: [],
  },
];
const weeklySales = [3400, 4200, 5100, 4800, 6200, 7800, 9100];
// Yearly revenue data (6 months each)
const yearlyRevenueFirstHalf = [5800, 7200, 9100, 11200, 8900, 12400];
const yearlyRevenueSecondHalf = [13500, 14800, 16200, 17100, 18500, 19800];
const monthLabelsFirstHalf = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const monthLabelsSecondHalf = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className="rv-star"
        style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#e2e8f0" }}
      >
        ★
      </span>
    ))}
  </div>
);

const OBadge = ({ status }) => {
  const m = {
    Delivered: "badge-delivered",
    Shipped: "badge-shipped",
    Processing: "badge-processing",
    Pending: "badge-pending",
    Cancelled: "badge-cancelled",
    Paid: "badge-paid",
    COD: "badge-pending",
    Refunded: "badge-outstock",
  };
  return (
    <span className={`badge-status ${m[status] || "badge-gray"}`}>
      {status}
    </span>
  );
};

const avatarColors = [
  "#b3934e",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
];
const getAvatarColor = (name) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

// ─── PRODUCT MODAL (defined outside to fix input bug) ─────────────────────────
const ProductModal = ({
  editingProduct,
  productForm,
  setProductForm,
  onSave,
  onClose,
}) => (
  <div className="sd-modal-overlay" onClick={onClose}>
    <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
      <div className="sd-modal-header">
        <span className="sd-modal-title">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </span>
        <button className="drawer-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="sd-modal-body">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <div style={{ gridColumn: "1/-1" }}>
            <label className="sd-lbl">Product Name *</label>
            <input
              className="sd-inp"
              placeholder="e.g. Classic Cotton Tee"
              value={productForm.name}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="sd-lbl">Category</label>
            <select
              className="sd-sel"
              value={productForm.category}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              {[
                "Apparel",
                "Bottomwear",
                "Footwear",
                "Accessories",
                "Outerwear",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="sd-lbl">Status</label>
            <select
              className="sd-sel"
              value={productForm.status}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="sd-lbl">Selling Price ($) *</label>
            <input
              type="number"
              className="sd-inp"
              placeholder="49"
              value={productForm.price}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label className="sd-lbl">Stock Quantity *</label>
            <input
              type="number"
              className="sd-inp"
              placeholder="50"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, stock: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
      <div className="sd-modal-footer">
        <button className="btn-outline-gold" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-gold" onClick={onSave}>
          {editingProduct ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  </div>
);

// ─── DELETE MODAL (defined outside to fix potential same issue) ───────────────
const DeleteModal = ({ productToDelete, onConfirm, onClose }) => (
  <div className="sd-modal-overlay" onClick={onClose}>
    <div
      className="sd-modal"
      style={{ width: 380 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sd-modal-header">
        <span className="sd-modal-title" style={{ color: "#dc2626" }}>
          Confirm Delete
        </span>
        <button className="drawer-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="sd-modal-body">
        <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
          Are you sure you want to delete "
          <strong style={{ color: "#1e293b" }}>{productToDelete?.name}</strong>
          "? This action cannot be undone.
        </p>
      </div>
      <div className="sd-modal-footer">
        <button className="btn-outline-gold" onClick={onClose}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            background: "#dc2626",
            border: "none",
            color: "white",
            padding: "10px 22px",
            borderRadius: 11,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount, wishlist } = useStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [returns, setReturns] = useState(mockReturns);
  const [reviews, setReviews] = useState(mockReviews);
  const [orderFilter, setOrderFilter] = useState("All");
  const [returnFilter, setReturnFilter] = useState("All");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState({
    title: "",
    columns: [],
    rows: [],
  });
  const [isClosing, setIsClosing] = useState(false);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  // Reviews state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [rvTab, setRvTab] = useState("reviews");
  const [rvSearch, setRvSearch] = useState("");
  const [rvSort, setRvSort] = useState("latest");
  const [rvFilterRating, setRvFilterRating] = useState("");
  const [rvFilterProduct, setRvFilterProduct] = useState("all");
  const [rvDateRange, setRvDateRange] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState([]);

  const userMenuRef = useRef(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Apparel",
    price: "",
    stock: "",
    status: "Active",
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const h = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalSales = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 10,
  ).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";
  const pendingCount = orders.filter((o) =>
    ["Pending", "Processing"].includes(o.status),
  ).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleProfile = () => {
    navigate("/profile");
    setShowUserMenu(false);
  };

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDrawer(false);
      setIsClosing(false);
    }, 280);
  };

  const handleTotalRevenueClick = () => {
    setDrawerData({
      title: "Total Revenue Details",
      columns: ["Order ID", "Customer", "Total", "Status"],
      rows: orders.map((o) => ({
        id: o.id,
        customer: o.customer,
        total: `$${o.total}`,
        status: o.status,
      })),
    });
    setShowDrawer(true);
  };
  const handleTotalOrdersClick = () => {
    setDrawerData({
      title: "All Orders",
      columns: ["Order ID", "Customer", "Total", "Status", "Date"],
      rows: orders.map((o) => ({
        id: o.id,
        customer: o.customer,
        total: `$${o.total}`,
        status: o.status,
        date: o.date,
      })),
    });
    setShowDrawer(true);
  };
  const handleTotalProductsClick = () => {
    setDrawerData({
      title: "All Products",
      columns: ["ID", "Product Name", "Price", "Stock", "Sales"],
      rows: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: `$${p.price}`,
        stock: p.stock,
        sales: p.sales,
      })),
    });
    setShowDrawer(true);
  };
  const handleLowStockClick = () => {
    const low = products.filter((p) => p.stock > 0 && p.stock <= 10);
    setDrawerData({
      title: "Low Stock Items",
      columns: ["ID", "Product Name", "Stock", "Price"],
      rows: low.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        price: `$${p.price}`,
      })),
    });
    setShowDrawer(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Apparel",
      price: "",
      stock: "",
      status: "Active",
    });
    setShowProductModal(true);
  };
  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category || "Apparel",
      price: p.price,
      stock: p.stock,
      status: p.status,
    });
    setShowProductModal(true);
  };
  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      notify("Please fill all required fields", "error");
      return;
    }
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productForm.name,
                category: productForm.category,
                price: parseFloat(productForm.price),
                stock: parseInt(productForm.stock),
                status: productForm.status,
              }
            : p,
        ),
      );
      notify("Product updated successfully!");
    } else {
      const newId = `P00${products.length + 1}`;
      setProducts([
        ...products,
        {
          id: newId,
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          status: productForm.status,
          sales: 0,
          
        },
      ]);
      notify("Product added successfully!");
    }
    setShowProductModal(false);
  };

  const confirmDelete = (p) => {
    setProductToDelete(p);
    setShowDeleteConfirm(true);
  };
  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      notify("Product removed.");
    }
  };

  const updateOrderStatus = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrder((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev,
    );
    notify(`Order ${id} → ${status}`);
  };

  const handleHelpful = (reviewId) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r,
      ),
    );
    notify("Marked as helpful!");
  };

  const handleReplyToggle = (reviewId) => {
    if (replyingTo === reviewId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(reviewId);
      setReplyText("");
    }
  };

  const submitReply = (reviewId) => {
    if (!replyText.trim()) {
      notify("Please enter a reply", "error");
      return;
    }
    setReviews(
      reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              replied: true,
              replyText: replyText.trim(),
              replyDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );
    setReplyingTo(null);
    setReplyText("");
    notify("Reply posted successfully!");
  };

  const handleSelectReview = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filteredOrders =
    orderFilter === "All"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  const filteredReturns =
    returnFilter === "All"
      ? returns
      : returns.filter((r) => r.status === returnFilter);

  const getStatusBadge = (s) => <OBadge status={s} />;
  const getProductStatusBadge = (s, stock) => {
    if (stock === 0)
      return <span className="badge-status badge-outstock">Out of Stock</span>;
    if (stock <= 10)
      return <span className="badge-status badge-lowstock">Low Stock</span>;
    return <span className="badge-status badge-active">Active</span>;
  };

  // Reviews filtering
  const filteredReviews = reviews
    .filter((r) => {
      if (rvFilterProduct !== "all" && r.productId !== rvFilterProduct)
        return false;
      if (rvFilterRating && r.rating !== parseInt(rvFilterRating)) return false;
      if (
        rvSearch &&
        !r.comment.toLowerCase().includes(rvSearch.toLowerCase()) &&
        !r.customer.toLowerCase().includes(rvSearch.toLowerCase())
      )
        return false;
      if (rvDateRange === "week") {
        const d = new Date(r.date),
          wk = new Date();
        wk.setDate(wk.getDate() - 7);
        if (d < wk) return false;
      }
      if (rvDateRange === "month") {
        const d = new Date(r.date),
          mo = new Date();
        mo.setMonth(mo.getMonth() - 1);
        if (d < mo) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (rvSort === "highest") return b.rating - a.rating;
      if (rvSort === "lowest") return a.rating - b.rating;
      return new Date(b.date) - new Date(a.date);
    });

  // ─── SIDEBAR ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="sd-sb-inner">
      <div className="sd-sb-brand">
        <div className="sd-sb-name">NIVEST Seller</div>
        <div className="sd-sb-user">{user?.name || "Seller"}</div>
      </div>
      <div className="sd-sb-sec">Main</div>
      <button
        className={`sidebar-link ${activeTab === "overview" ? "active" : ""}`}
        onClick={() => setActiveTab("overview")}
      >
        <FaTachometerAlt size={16} /> <span>Overview</span>
      </button>
      <button
        className={`sidebar-link ${activeTab === "products" ? "active" : ""}`}
        onClick={() => setActiveTab("products")}
      >
        <FaStore size={16} /> <span>Products</span>
      </button>
      <button
        className={`sidebar-link ${activeTab === "orders" ? "active" : ""}`}
        onClick={() => setActiveTab("orders")}
      >
        <FaShoppingCart size={16} /> <span>Orders</span>
        {pendingCount > 0 && <span className="sd-nb">{pendingCount}</span>}
      </button>
      <button
        className={`sidebar-link ${activeTab === "shipping" ? "active" : ""}`}
        onClick={() => setActiveTab("shipping")}
      >
        <FaTruck size={16} /> <span>Shipping & Delivery</span>
      </button>
      <button
        className={`sidebar-link ${activeTab === "returns" ? "active" : ""}`}
        onClick={() => setActiveTab("returns")}
      >
        <FaUndo size={16} /> <span>Returns</span>
        {returns.filter((r) => r.status === "Pending").length > 0 && (
          <span className="sd-nb danger">
            {returns.filter((r) => r.status === "Pending").length}
          </span>
        )}
      </button>
      <button
        className={`sidebar-link ${activeTab === "payments" ? "active" : ""}`}
        onClick={() => setActiveTab("payments")}
      >
        <FaMoneyBillWave size={16} /> <span>Payments</span>
      </button>
      <button
        className={`sidebar-link ${activeTab === "reviews" ? "active" : ""}`}
        onClick={() => setActiveTab("reviews")}
      >
        <FaStar size={16} /> <span>Customer Reviews</span>
      </button>
      <button
        className={`sidebar-link ${activeTab === "analytics" ? "active" : ""}`}
        onClick={() => setActiveTab("analytics")}
      >
        <FaChartLine size={16} /> <span>Analytics</span>
      </button>
      <Link
        to="/shop"
        className="sidebar-link"
        style={{ textDecoration: "none" }}
      >
        <FaTags size={16} /> <span>Home</span>
      </Link>
      <hr className="sd-divider" />
      <div className="sd-sb-sec">Account</div>
      <button className="sidebar-link" onClick={handleProfile}>
        <FaUserCircle size={16} /> <span>Profile Settings</span>
      </button>
      <button
        className="sidebar-link"
        onClick={handleLogout}
        style={{ color: "#dc2626" }}
      >
        <FaSignOutAlt size={16} /> <span>Logout</span>
      </button>
    </div>
  );

  // ─── STAT-DETAIL DRAWER ───────────────────────────────────────────────────
  const SlideDrawer = () => (
    <>
      <div className="drawer-overlay" onClick={closeDrawer} />
      <div className={`drawer-container ${isClosing ? "closing" : ""}`}>
        <div className="drawer-header">
          <h3 className="drawer-title">{drawerData.title}</h3>
          <button className="drawer-close" onClick={closeDrawer}>
            <FaTimes />
          </button>
        </div>
        <div className="drawer-body">
          {drawerData.rows.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
              No data
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {drawerData.columns.map((c, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "11px 10px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        borderBottom: "1px solid #e9ecef",
                        background: "#f8fafc",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drawerData.rows.map((row, ri) => (
                  <tr key={ri}>
                    {Object.values(row).map((v, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "12px 10px",
                          fontSize: 13,
                          color: "#1e293b",
                          borderBottom: "1px solid #f1f5f9",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );

  // ─── ORDER DETAIL DRAWER ─────────────────────────────────────────────────
  const OrderDetailDrawer = () => {
    const o = selectedOrder;
    if (!o) return null;
    const steps = [
      { label: "Order Placed", done: true },
      {
        label: "Accepted & Processing",
        done: ["Processing", "Shipped", "Delivered"].includes(o.status),
      },
      {
        label: "Dispatched",
        done: ["Shipped", "Delivered"].includes(o.status),
      },
      { label: "Out for Delivery", done: o.status === "Delivered" },
      { label: "Delivered", done: o.status === "Delivered" },
    ];
    return (
      <>
        <div
          className="drawer-overlay"
          onClick={() => setShowOrderDrawer(false)}
        />
        <div className="drawer-container">
          <div className="drawer-header">
            <div>
              <h3 className="drawer-title">Order Details</h3>
              <div style={{ fontSize: 13, color: "#b3934e", fontWeight: 700 }}>
                {o.id}
              </div>
            </div>
            <button
              className="drawer-close"
              onClick={() => setShowOrderDrawer(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="drawer-body">
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                border: "1px solid #e9ecef",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  ["Customer", o.customer],
                  ["Phone", o.phone || "—"],
                  ["City", o.city || "—"],
                  ["Date", o.date],
                  ["Items", `${o.items} items`],
                  ["Total", `$${o.total}`],
                ].map(([l, v], i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        marginTop: 3,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 8,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Products
              </div>
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: 13,
                  fontSize: 13,
                  color: "#475569",
                  border: "1px solid #e9ecef",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {o.product}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {[
                ["PAYMENT", o.payment],
                ["STATUS", o.status],
              ].map(([l, v], i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: "#f8fafc",
                    borderRadius: 10,
                    padding: 13,
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: 6,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {l}
                  </div>
                  <OBadge status={v} />
                </div>
              ))}
            </div>
            {o.status === "Pending" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button
                  className="btn-gold"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => updateOrderStatus(o.id, "Processing")}
                >
                  <FaCheckCircle size={12} /> Accept
                </button>
                <button
                  className="btn-outline-gold"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => updateOrderStatus(o.id, "Cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}
            {o.status === "Processing" && (
              <button
                className="btn-gold"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
                onClick={() => updateOrderStatus(o.id, "Shipped")}
              >
                <FaTruck size={12} /> Dispatch Order
              </button>
            )}
            {o.status === "Shipped" && (
              <button
                className="btn-gold"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
                onClick={() => updateOrderStatus(o.id, "Delivered")}
              >
                <FaCheckCircle size={12} /> Mark as Delivered
              </button>
            )}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 12,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Order Timeline
            </div>
            {steps.map((t, i) => (
              <div key={i} className="sd-tl-item">
                <div className={`sd-tl-dot ${t.done ? "done" : "todo"}`}>
                  {t.done ? "✓" : ""}
                </div>
                <div
                  className="sd-tl-text"
                  style={{
                    color: t.done ? "#1e293b" : "#94a3b8",
                    fontWeight: t.done ? 600 : 400,
                  }}
                >
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // ─── OVERVIEW ────────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <>
      <div className="sd-ph">
        <div>
          <p className="sd-pt">
            Welcome back, {user?.name?.split(" ")[0] || "Seller"}! 
          </p>
          <p className="sd-ps">
            Here's what's happening with your store today.
          </p>
        </div>
        <button className="btn-gold" onClick={handleAddProduct}>
          <FaPlus size={12} /> Add Product
        </button>
      </div>
      {lowStockCount > 0 && (
        <div className="sd-alert sd-alert-warn">
          ⚠️{" "}
          <strong>
            {lowStockCount} product{lowStockCount > 1 ? "s" : ""} running low
          </strong>{" "}
          — restock to avoid lost sales.
          <button
            className="btn-outline-gold"
            style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 12 }}
            onClick={() => setActiveTab("products")}
          >
            View →
          </button>
        </div>
      )}
      <div className="row g-3 mb-4">
        {[
          {
            icon: <FaDollarSign size={22} style={{ color: "#b3934e" }} />,
            value: `$${totalRevenue}`,
            label: "Total Revenue",
            trend: "+12.5%",
            up: true,
            onClick: handleTotalRevenueClick,
          },
          {
            icon: <FaShoppingCart size={22} style={{ color: "#b3934e" }} />,
            value: totalSales,
            label: "Total Orders",
            trend: "+8.2%",
            up: true,
            onClick: handleTotalOrdersClick,
          },
          {
            icon: <FaBoxOpen size={22} style={{ color: "#b3934e" }} />,
            value: totalProducts,
            label: "Active Products",
            trend: "+3",
            up: true,
            onClick: handleTotalProductsClick,
          },
          {
            icon: <FaTags size={22} style={{ color: "#b3934e" }} />,
            value: lowStockCount,
            label: "Low Stock Items",
            trend: "-2",
            up: false,
            onClick: handleLowStockClick,
          },
        ].map((s, i) => (
          <div className="col-md-3" key={i}>
            <div
              className="stat-card"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={s.onClick}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div className="stat-icon-box">{s.icon}</div>
                <div style={{ textAlign: "right" }}>
                  <div className="stat-value">{s.value}</div>
                  <div
                    className={`stat-trend ${s.up ? "trend-up" : "trend-down"}`}
                  >
                    {s.up ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}{" "}
                    {s.trend}
                  </div>
                </div>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-card mb-4">
        <div className="sd-ch">
          <div className="sd-ct"> Top Selling Products</div>
          <button
            className="btn-outline-gold"
            onClick={() => setActiveTab("products")}
          >
            View All
          </button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {[...products]
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 4)
            .map((p, i) => (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {i + 1}. {p.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 800,
                      color: "#b3934e",
                      fontSize: 15,
                    }}
                  >
                    {p.sales} sold
                  </span>
                </div>
                <div className="sd-prog">
                  <div
                    className="sd-prog-bar"
                    style={{ width: `${(p.sales / 130) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="dashboard-card">
            <div className="sd-ch">
              <div className="sd-ct"> Recent Orders</div>
              <FaBell size={15} style={{ color: "#b3934e" }} />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 4).map((o) => (
                    <tr key={o.id}>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#b3934e",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedOrder(o);
                            setShowOrderDrawer(true);
                          }}
                        >
                          {o.id}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{o.customer}</td>
                      <td style={{ color: "#64748b", fontSize: 12 }}>
                        {o.date}
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 800,
                            fontSize: 16,
                          }}
                        >
                          ${o.total}
                        </span>
                      </td>
                      <td>{getStatusBadge(o.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "14px 20px" }}>
              <button
                className="btn-outline-gold"
                onClick={() => setActiveTab("orders")}
              >
                View all orders →
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="dashboard-card h-100">
            <div className="sd-ch">
              <div className="sd-ct"> Weekly Sales</div>
              <span className="badge-status badge-active">↑ 18%</span>
            </div>
            <div style={{ padding: "20px 20px 14px" }}>
              <div className="chart-bars">
                {weeklySales.map((v, i) => (
                  <div className="chart-col" key={i}>
                    <div
                      className={`chart-bar ${i === 6 ? "today" : ""}`}
                      style={{ height: `${Math.max(20, (v / 10000) * 130)}px` }}
                    />
                    <div className="chart-lbl">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </div>
                  </div>
                ))}
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: 12,
                  marginTop: 12,
                  marginBottom: 0,
                }}
              >
                Weekly performance trend
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ─── PRODUCTS ────────────────────────────────────────────────────────────
  const ProductsTab = () => (
    <>
      <div className="sd-ph">
        <div>
          <p className="sd-pt">Product Inventory</p>
          <p className="sd-ps">
            {products.length} products ·{" "}
            {products.filter((p) => p.status === "Active").length} active
          </p>
        </div>
        <button className="btn-gold" onClick={handleAddProduct}>
          <FaPlus size={12} /> Add Product
        </button>
      </div>
      <div className="dashboard-card">
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Sales</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                      }}
                    >
                      
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {p.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-status badge-gray">
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      ${p.price}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge-status ${p.stock === 0 ? "badge-outstock" : p.stock <= 10 ? "badge-lowstock" : "badge-active"}`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td>{getProductStatusBadge(p.status, p.stock)}</td>
                  <td>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      {p.sales}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleEditProduct(p)}
                      >
                        <FaEdit size={14} style={{ color: "#b3934e" }} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => confirmDelete(p)}
                      >
                        <FaTrash size={14} style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ─── ORDERS ──────────────────────────────────────────────────────────────
  const OrdersTab = () => (
    <>
      <div className="sd-ph">
        <div>
          <p className="sd-pt">Order Management</p>
          <p className="sd-ps">Accept, process and dispatch orders</p>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}
      >
        {[
          "All",
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((f) => (
          <button
            key={f}
            onClick={() => setOrderFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: `1.5px solid ${orderFilter === f ? "#b3934e" : "#e2e8f0"}`,
              background: orderFilter === f ? "#fff7ed" : "#ffffff",
              color: orderFilter === f ? "#b3934e" : "#64748b",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.18s",
            }}
          >
            {f}{" "}
            <span
              style={{
                background: orderFilter === f ? "#b3934e" : "#e2e8f0",
                color: orderFilter === f ? "white" : "#64748b",
                borderRadius: 10,
                padding: "1px 6px",
                fontSize: 10,
                marginLeft: 4,
              }}
            >
              {orders.filter((o) => f === "All" || o.status === f).length}
            </span>
          </button>
        ))}
      </div>
      <div className="dashboard-card">
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Product</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#b3934e",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedOrder(o);
                        setShowOrderDrawer(true);
                      }}
                    >
                      {o.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {o.customer}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {o.city}
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{o.date}</td>
                  <td style={{ fontSize: 12, color: "#64748b", maxWidth: 150 }}>
                    {o.product}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="badge-status badge-gray">{o.items}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      ${o.total}
                    </span>
                  </td>
                  <td>
                    <OBadge status={o.payment} />
                  </td>
                  <td>
                    <OBadge status={o.status} />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {o.status === "Pending" && (
                        <button
                          className="btn-gold"
                          style={{ padding: "6px 12px", fontSize: 11 }}
                          onClick={() => updateOrderStatus(o.id, "Processing")}
                        >
                          <FaCheckCircle size={10} /> Accept
                        </button>
                      )}
                      {o.status === "Processing" && (
                        <button
                          className="btn-gold"
                          style={{ padding: "6px 12px", fontSize: 11 }}
                          onClick={() => updateOrderStatus(o.id, "Shipped")}
                        >
                          <FaTruck size={10} /> Dispatch
                        </button>
                      )}
                      {o.status === "Shipped" && (
                        <button
                          className="btn-outline-gold"
                          style={{ padding: "6px 12px", fontSize: 11 }}
                          onClick={() => updateOrderStatus(o.id, "Delivered")}
                        >
                          <FaCheckCircle size={10} /> Delivered
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setSelectedOrder(o);
                          setShowOrderDrawer(true);
                        }}
                      >
                        <FaEye size={14} style={{ color: "#64748b" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ─── SHIPPING ────────────────────────────────────────────────────────────
  const ShippingTab = () => (
    <>
      <div className="sd-ph">
        <div>
          <p className="sd-pt">Shipping & Delivery</p>
          <p className="sd-ps">Manage dispatches and track deliveries</p>
        </div>
      </div>
      <div className="row g-3 mb-4">
        {[
          {
            icon: <FaClock size={20} style={{ color: "#b3934e" }} />,
            v: orders.filter((o) => o.status === "Processing").length,
            l: "Ready to Dispatch",
          },
          {
            icon: <FaTruck size={20} style={{ color: "#b3934e" }} />,
            v: orders.filter((o) => o.status === "Shipped").length,
            l: "In Transit",
          },
          {
            icon: <FaCheckCircle size={20} style={{ color: "#b3934e" }} />,
            v: orders.filter((o) => o.status === "Delivered").length,
            l: "Delivered",
          },
          {
            icon: <FaTimes size={20} style={{ color: "#b3934e" }} />,
            v: orders.filter((o) => o.status === "Cancelled").length,
            l: "Cancelled",
          },
        ].map((s, i) => (
          <div className="col-md-3" key={i}>
            <div
              className="stat-card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div className="stat-icon-box">{s.icon}</div>
                <div className="stat-value">{s.v}</div>
              </div>
              <div className="stat-label">{s.l}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-card">
        <div className="sd-ch">
          <div className="sd-ct"> Dispatch Queue</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Product</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) => !["Delivered", "Cancelled"].includes(o.status))
                .map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: "#b3934e" }}>
                      {o.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{o.customer}</td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>{o.city}</td>
                    <td
                      style={{ fontSize: 12, color: "#64748b", maxWidth: 140 }}
                    >
                      {o.product}
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 800,
                          fontSize: 16,
                        }}
                      >
                        ${o.total}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>{o.date}</td>
                    <td>
                      <OBadge status={o.status} />
                    </td>
                    <td>
                      {o.status === "Pending" && (
                        <button
                          className="btn-gold"
                          style={{ padding: "6px 14px", fontSize: 11 }}
                          onClick={() => updateOrderStatus(o.id, "Processing")}
                        >
                          <FaCheckCircle size={10} /> Accept
                        </button>
                      )}
                      {o.status === "Processing" && (
                        <button
                          className="btn-gold"
                          style={{ padding: "6px 14px", fontSize: 11 }}
                          onClick={() => updateOrderStatus(o.id, "Shipped")}
                        >
                          <FaTruck size={10} /> Dispatch
                        </button>
                      )}
                      {o.status === "Shipped" && (
                        <button
                          className="btn-outline-gold"
                          style={{ padding: "6px 14px", fontSize: 11 }}
                          onClick={() => updateOrderStatus(o.id, "Delivered")}
                        >
                          <FaCheckCircle size={10} /> Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ─── RETURNS ─────────────────────────────────────────────────────────────
  const ReturnsTab = () => (
    <>
      <div className="sd-ph">
        <div>
          <p className="sd-pt">Returns Management</p>
          <p className="sd-ps">Handle return and refund requests</p>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div
            className="stat-card"
            onClick={() => setReturnFilter("All")}
            style={{ cursor: "pointer" }}
          >
            <div className="stat-value" style={{ fontSize: 34 }}>
              {returns.length}
            </div>
            <div className="stat-label">Total Returns</div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="stat-card"
            onClick={() => setReturnFilter("Pending")}
            style={{ cursor: "pointer" }}
          >
            <div className="stat-value" style={{ fontSize: 34 }}>
              {returns.filter((r) => r.status === "Pending").length}
            </div>
            <div className="stat-label">Pending Returns</div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="stat-card"
            onClick={() => setReturnFilter("Approved")}
            style={{ cursor: "pointer" }}
          >
            <div className="stat-value" style={{ fontSize: 34 }}>
              {returns.filter((r) => r.status === "Approved").length}
            </div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: 34 }}>
              ${returns.reduce((s, r) => s + r.amount, 0)}
            </div>
            <div className="stat-label">Total Refund Amount</div>
          </div>
        </div>
      </div>
      <div className="dashboard-card">
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, color: "#b3934e" }}>{r.id}</td>
                  <td>{r.orderId}</td>
                  <td style={{ fontWeight: 600 }}>{r.customer}</td>
                  <td>{r.product}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{r.reason}</td>
                  <td>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: 16,
                      }}
                    >
                      ${r.amount}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{r.date}</td>
                  <td>
                    <span
                      className={`badge-status ${r.status === "Approved" ? "badge-active" : "badge-pending"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === "Pending" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn-gold"
                          style={{ padding: "5px 12px", fontSize: 11 }}
                          onClick={() => {
                            setReturns(
                              returns.map((x) =>
                                x.id === r.id
                                  ? { ...x, status: "Approved" }
                                  : x,
                              ),
                            );
                            notify("Return approved");
                          }}
                        >
                          <FaCheckCircle size={10} /> Approve
                        </button>
                        <button
                          className="btn-outline-gold"
                          style={{
                            padding: "5px 12px",
                            fontSize: 11,
                            borderColor: "#ef4444",
                            color: "#ef4444",
                          }}
                          onClick={() => {
                            setReturns(
                              returns.map((x) =>
                                x.id === r.id
                                  ? { ...x, status: "Rejected" }
                                  : x,
                              ),
                            );
                            notify("Return rejected");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#10b981",
                          fontWeight: 700,
                        }}
                      >
                        ✓ Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ─── PAYMENTS ────────────────────────────────────────────────────────────
  const PaymentsTab = () => {
    const paid = orders
      .filter((o) => o.payment === "Paid")
      .reduce((s, o) => s + o.total, 0);
    const cod = orders
      .filter((o) => o.payment === "COD")
      .reduce((s, o) => s + o.total, 0);
    return (
      <>
        <div className="sd-ph">
          <div>
            <p className="sd-pt">Payment Settlement</p>
            <p className="sd-ps">Track earnings and payment history</p>
          </div>
          <button className="btn-gold">
            <FaBoxOpen size={12} /> Download Statement
          </button>
        </div>
        <div className="row g-3 mb-4">
          {[
            {
              v: `$${totalRevenue}`,
              l: "Total Earnings",
              up: true,
              t: "+12.5%",
            },
            { v: `$${paid}`, l: "Settled (Online)", up: true, t: "Received" },
            { v: `$${cod}`, l: "COD Pending", up: false, t: "Awaiting" },
            {
              v: `$${returns.reduce((s, r) => s + r.amount, 0)}`,
              l: "Refunded",
              up: false,
              t: "Processed",
            },
          ].map((s, i) => (
            <div className="col-md-3" key={i}>
              <div
                className="stat-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="stat-icon-box">
                    <FaDollarSign size={22} style={{ color: "#b3934e" }} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="stat-value" style={{ fontSize: 22 }}>
                      {s.v}
                    </div>
                    <div
                      className={`stat-trend ${s.up ? "trend-up" : "trend-down"}`}
                    >
                      {s.up ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}{" "}
                      {s.t}
                    </div>
                  </div>
                </div>
                <div className="stat-label">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="dashboard-card">
              <div className="sd-ch">
                <div className="sd-ct">Monthly Revenue</div>
              </div>
              <div style={{ padding: "20px" }}>
                <div className="chart-bars">
                  {yearlyRevenueFirstHalf.map((v, i) => (
                    <div className="chart-col" key={i}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#b3934e",
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        ${Math.floor(v / 1000)}k
                      </div>
                      <div
                        className="chart-bar"
                        style={{ height: `${(v / 20000) * 130}px` }}
                      />
                      <div className="chart-lbl">{monthLabelsFirstHalf[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="dashboard-card">
              <div className="sd-ch">
                <div className="sd-ct">Payment Breakdown</div>
              </div>
              <div style={{ padding: "20px" }}>
                {[
                  {
                    label: "Online Payments",
                    value: orders.filter((o) => o.payment === "Paid").length,
                    total: orders.length,
                    color: "#10b981",
                  },
                  {
                    label: "Cash on Delivery",
                    value: orders.filter((o) => o.payment === "COD").length,
                    total: orders.length,
                    color: "#f59e0b",
                  },
                  {
                    label: "Refunded",
                    value: returns.length,
                    total: orders.length,
                    color: "#ef4444",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      <span>{item.label}</span>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 800,
                          color: item.color,
                          fontSize: 15,
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                    <div className="sd-prog">
                      <div
                        className="sd-prog-bar"
                        style={{
                          width: `${(item.value / item.total) * 100}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ─── REVIEWS (New Design) ─────────────────────────────────────────────────
  const ReviewsTab = () => (
    <>
      {/* Header */}
      <div className="rv-header">
        <div>
          <p className="sd-pt">Customer Reviews</p>
          <p className="sd-ps">
            {reviews.length} reviews · Avg rating {avgRating} ⭐
          </p>
        </div>
        <button className="btn-gold">
          <FaPlus size={12} /> Create Request
        </button>
      </div>

      {/* Tabs */}
      <div className="rv-tabs">
        {[
          { key: "reviews", label: `My Reviews (${reviews.length})` },
          { key: "widget", label: "Review Widget" },
          { key: "questions", label: "Question & Answer" },
        ].map((t) => (
          <button
            key={t.key}
            className={`rv-tab ${rvTab === t.key ? "active" : ""}`}
            onClick={() => setRvTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <button className="rv-tab-add">+ Add View</button>
      </div>

      {/* AI Insight Banner */}
      <div className="rv-ai-banner">
        <div className="rv-ai-row">
          
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
            AI Insight: Customers mention sizing and quality frequently
          </span>
        </div>
        <div className="rv-ai-issues">
          {[
            { label: "Quality Issues", pct: 40, color: "#ef4444" },
            { label: "Sizing Feedback", pct: 35, color: "#f59e0b" },
            { label: "Delivery Speed", pct: 25, color: "#3b82f6" },
          ].map((issue) => (
            <div key={issue.label} className="rv-ai-issue">
              <div className="rv-ai-bar">
                <div
                  style={{
                    width: `${issue.pct}%`,
                    height: "100%",
                    background: issue.color,
                    borderRadius: 2,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {issue.pct}% {issue.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="rv-filters">
        <div className="rv-search-wrap">
          <FaSearch className="rv-search-icon" />
          <input
            className="rv-inp"
            placeholder="Search reviews or customers..."
            value={rvSearch}
            onChange={(e) => setRvSearch(e.target.value)}
          />
        </div>
        <select
          className="rv-sel"
          value={rvDateRange}
          onChange={(e) => setRvDateRange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
        <select
          className="rv-sel"
          value={rvFilterProduct}
          onChange={(e) => setRvFilterProduct(e.target.value)}
        >
          <option value="all">All Products</option>
          {mockProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="rv-sel"
          value={rvFilterRating}
          onChange={(e) => setRvFilterRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s} Star{s > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <select
          className="rv-sel"
          value={rvSort}
          onChange={(e) => setRvSort(e.target.value)}
        >
          <option value="latest">Latest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Select All + Count */}
      {filteredReviews.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: "#475569",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <input
              type="checkbox"
              checked={
                selectedReviews.length === filteredReviews.length &&
                filteredReviews.length > 0
              }
              onChange={() => {
                if (selectedReviews.length === filteredReviews.length)
                  setSelectedReviews([]);
                else setSelectedReviews(filteredReviews.map((r) => r.id));
              }}
              style={{ width: 16, height: 16 }}
            />
            Select All
          </label>
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {filteredReviews.length} review
            {filteredReviews.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="dashboard-card">
          <div className="rv-empty">
           
            <div className="rv-empty-text">No reviews found</div>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
              Try adjusting your filters
            </p>
          </div>
        </div>
      ) : (
        <div className="rv-grid">
          {filteredReviews.map((r, idx) => {
            const isSelected = selectedReviews.includes(r.id);
            const avatarColor = getAvatarColor(r.customer);
            const isReplying = replyingTo === r.id;

            return (
              <div
                key={r.id}
                className={`rv-card ${isSelected ? "rv-card-selected" : ""}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="rv-checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectReview(r.id)}
                />

                {/* Card Top */}
                <div className="rv-card-top">
                  <div className="rv-card-meta">
                    <span className="rv-order-id">Order-{r.orderId}</span>
                    <div className="rv-card-rating-date">
                      <Stars rating={r.rating} />
                      <span className="rv-card-date">{r.date}</span>
                    </div>
                  </div>
                  <div className="rv-product-label">Product</div>
                  <div className="rv-product-name">{r.product}</div>
                </div>

                {/* Card Body */}
                <div className="rv-card-body">
                  <p className="rv-comment">
                    {r.comment.length > 120
                      ? `${r.comment.substring(0, 120)}...`
                      : r.comment}
                  </p>
                  <div className="rv-card-customer">
                    <div
                      className="rv-avatar"
                      style={{ background: avatarColor }}
                    >
                      {r.customerAvatar ||
                        r.customer
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                    </div>
                    <div>
                      <div className="rv-customer-name">{r.customer}</div>
                      {r.verified && (
                        <div className="rv-verified">✅ Verified Purchase</div>
                      )}
                    </div>
                    {r.reviewImages && r.reviewImages.length > 0 && (
                      <div className="rv-images">
                        {r.reviewImages.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="rv-img-thumb"
                          />
                        ))}
                        {r.reviewImages.length > 3 && (
                          <div className="rv-img-more">
                            +{r.reviewImages.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Seller Reply (if replied) */}
                {r.replied && r.replyText && !isReplying && (
                  <div className="rv-reply-box">
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#b3934e",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: 6,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Seller Response
                    </div>
                    <div className="rv-reply-text">{r.replyText}</div>
                    {r.replyDate && (
                      <div className="rv-reply-date">
                        Replied on {r.replyDate}
                      </div>
                    )}
                  </div>
                )}

                {/* Reply Input (if replying) */}
                {isReplying && (
                  <div className="rv-reply-box">
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#b3934e",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: 8,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Write Reply
                    </div>
                    <div className="rv-reply-input-row">
                      <input
                        className="rv-reply-field"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === "Enter" && submitReply(r.id)
                        }
                      />
                      <button
                        className="btn-gold"
                        style={{ padding: "8px 16px", fontSize: 12 }}
                        onClick={() => submitReply(r.id)}
                      >
                        Send
                      </button>
                      <button
                        className="btn-outline-gold"
                        style={{ padding: "8px 14px", fontSize: 12 }}
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="rv-card-actions">
                  <button
                    className="rv-action-btn"
                    onClick={() => notify("Review published!")}
                  >
                    Publish
                  </button>
                  <button
                    className="rv-action-btn"
                    onClick={() => notify("Review archived.")}
                  >
                    Archive
                  </button>
                  <button
                    className="rv-helpful-btn"
                    onClick={() => handleHelpful(r.id)}
                  >
                    <FaThumbsUp size={11} /> Helpful ({r.helpful})
                  </button>
                  <button
                    className="rv-reply-btn-sm"
                    onClick={() => handleReplyToggle(r.id)}
                  >
                    <FaReply size={11} /> {r.replied ? "Edit Reply" : "Reply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedReviews.length > 0 && (
        <div className="rv-bulk-bar">
          <span className="rv-bulk-count">
            {selectedReviews.length} selected
          </span>
          <button
            className="rv-bulk-btn primary"
            onClick={() => {
              setSelectedReviews([]);
              notify("Reviews published!");
            }}
          >
            Publish
          </button>
          <button
            className="rv-bulk-btn"
            onClick={() => {
              setSelectedReviews([]);
              notify("Reviews archived.");
            }}
          >
            Archive
          </button>
          <button
            className="rv-bulk-btn"
            onClick={() => {
              setSelectedReviews([]);
              notify("Reviews liked!");
            }}
          >
             Like
          </button>
          <button
            className="rv-bulk-btn"
            onClick={() => {
              setSelectedReviews([]);
              notify("Link copied!");
            }}
          >
            ↗ Share
          </button>
          <button
            className="rv-bulk-btn"
            onClick={() => setSelectedReviews([])}
          >
            ✕ Clear
          </button>
        </div>
      )}
    </>
  );
const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [yearlyHalf, setYearlyHalf] = useState("firstHalf");

  // Weekly Data
  const getWeeklyData = () => {
    const weeks = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      weeks.push({
        label: `W${8 - i}`,
        fullLabel: `Week ${8 - i}`,
        revenue: Math.floor(3500 + Math.random() * 6500),
        orders: Math.floor(25 + Math.random() * 45),
      });
    }
    return weeks;
  };

  // Monthly Data
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(now.getMonth() - i);

      months.push({
        label: monthDate.toLocaleString("default", { month: "short" }),
        fullLabel: monthDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        revenue: Math.floor(12000 + Math.random() * 18000),
        orders: Math.floor(80 + Math.random() * 120),
      });
    }
    return months;
  };

  // Yearly Data (12 months split into 2 halves)
  const getYearlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((month, index) => ({
      label: month,
      fullLabel: month,
      revenue: Math.floor(15000 + Math.random() * 25000),
      orders: Math.floor(80 + Math.random() * 120),
      monthIndex: index,
    }));
  };

  const weeklyData = useRef(getWeeklyData()).current;
  const monthlyData = useRef(getMonthlyData()).current;
  const yearlyData = useRef(getYearlyData()).current;

  const getCurrentData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyHalf === "firstHalf"
          ? yearlyData.slice(0, 6)
          : yearlyData.slice(6, 12);
      default:
        return weeklyData;
    }
  };

  const currentData = getCurrentData();
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = Math.floor(totalRevenue / currentData.length);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);

  const maxRevenue = Math.max(...currentData.map((d) => d.revenue));

  const getChartHeight = (revenue) => {
    return Math.max(35, (revenue / maxRevenue) * 140);
  };

  return (
    <>
      <div className="sd-ph">
        <div>
          <p className="sd-pt">Performance Analytics</p>
          <p className="sd-ps">
            Deep insights into your store's revenue trends
          </p>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "weekly", label: "Weekly" },
              { key: "monthly", label: "Monthly" },
              { key: "yearly", label: "Yearly" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setTimeRange(p.key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 40,
                  border: timeRange === p.key ? "none" : "1.5px solid #e2e8f0",
                  background:
                    timeRange === p.key
                      ? "linear-gradient(135deg, #b3934e, #d4af6a)"
                      : "#fff",
                  color: timeRange === p.key ? "white" : "#64748b",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {timeRange === "yearly" && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={() => setYearlyHalf("firstHalf")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 30,
                  border:
                    yearlyHalf === "firstHalf" ? "none" : "1px solid #ddd",
                  background:
                    yearlyHalf === "firstHalf"
                      ? "linear-gradient(135deg, #b3934e, #d4af6a)"
                      : "#fff",
                  color: yearlyHalf === "firstHalf" ? "#fff" : "#64748b",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Jan - Jun
              </button>

              <button
                onClick={() => setYearlyHalf("secondHalf")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 30,
                  border:
                    yearlyHalf === "secondHalf" ? "none" : "1px solid #ddd",
                  background:
                    yearlyHalf === "secondHalf"
                      ? "linear-gradient(135deg, #b3934e, #d4af6a)"
                      : "#fff",
                  color: yearlyHalf === "secondHalf" ? "#fff" : "#64748b",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Jul - Dec
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-value">${totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-value">${avgRevenue.toLocaleString()}</div>
            <div className="stat-label">Average Revenue</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="dashboard-card">
        <div className="sd-ch">
          <div className="sd-ct">
            {timeRange === "weekly" && "Weekly Revenue Trend (Last 8 Weeks)"}
            {timeRange === "monthly" &&
              "Monthly Revenue Trend (Last 12 Months)"}
            {timeRange === "yearly" &&
              `Yearly Revenue Trend (${
                yearlyHalf === "firstHalf" ? "Jan - Jun" : "Jul - Dec"
              })`}
          </div>
        </div>

        <div style={{ padding: "24px 20px" }}>
          <div
            className="chart-bars"
            style={{ height: 220, alignItems: "flex-end" }}
          >
            {currentData.map((item, i) => (
              <div className="chart-col" key={i}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#b3934e",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  ${Math.floor(item.revenue / 1000)}k
                </div>

                <div
                  className="chart-bar"
                  style={{
                    height: `${getChartHeight(item.revenue)}px`,
                    background: "linear-gradient(180deg, #d4af6a, #b3934e)",
                    cursor: "pointer",
                  }}
                />

                <div className="chart-lbl" style={{ marginTop: 8 }}>
                  {item.label}
                </div>

                <div
                  style={{
                    fontSize: 9,
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  {item.orders} orders
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container sd-wrap">
      {toast && (
        <div
          className={`sd-toast ${toast.type === "error" ? "sd-toast-err" : "sd-toast-ok"}`}
        >
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}

      {/* TOP NAV */}
      <div className="sd-topnav">
        <Link to="/" className="sd-logo">
          NIVEST
        </Link>
        <div className="sd-topnav-right">
          <Link to="/shop" className="sd-nav-link">
            Shop
          </Link>
          <div ref={userMenuRef} style={{ position: "relative" }}>
            <button
              className="sd-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUserCircle size={20} style={{ color: "#e6b760" }} />
              <span>{user?.name?.split(" ")[0] || "Seller"}</span>
              <FaChevronDown
                size={10}
                style={{
                  color: "#6c757d",
                  transform: showUserMenu ? "rotate(180deg)" : "none",
                  transition: "transform 0.3s",
                }}
              />
            </button>
            {showUserMenu && (
              <div className="sd-dropdown">
                <div className="sd-dropdown-head">
                  <FaUserCircle size={38} color="#e6b856" />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: 14,
                      }}
                    >
                      {user?.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6c757d" }}>
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button className="sd-dropdown-btn" onClick={handleProfile}>
                  <FaUserCircle size={14} style={{ color: "#b3934e" }} /> My
                  Profile
                </button>
                <button
                  className="sd-dropdown-btn"
                  onClick={handleLogout}
                  style={{ color: "#dc2626", borderTop: "1px solid #e9ecef" }}
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="container-fluid px-0">
        <div className="row g-0">
          <div className="col-md-3 col-lg-2 dashboard-sidebar">
            <Sidebar />
          </div>
          <div className="col-md-9 col-lg-10">
            <div className="sd-main">
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "products" && <ProductsTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "shipping" && <ShippingTab />}
              {activeTab === "returns" && <ReturnsTab />}
              {activeTab === "payments" && <PaymentsTab />}
              {activeTab === "reviews" && <ReviewsTab />}
              {activeTab === "analytics" && <AnalyticsTab />}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      {showDrawer && <SlideDrawer />}
      {showOrderDrawer && <OrderDetailDrawer />}
      {showProductModal && (
        <ProductModal
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          onSave={handleSaveProduct}
          onClose={() => setShowProductModal(false)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteModal
          productToDelete={productToDelete}
          onConfirm={handleDeleteProduct}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};
export default SellerDashboard;

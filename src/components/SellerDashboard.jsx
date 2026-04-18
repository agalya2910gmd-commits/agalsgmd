// src/components/SellerDashboard.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
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
  FaUpload,
  FaArrowLeft,
  FaImage,
  FaTag,
  FaLayerGroup,
  FaRuler,
  FaWeight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useProducts } from "../context/ProductContext";

// ─── INJECT STYLES ONCE ───────────────────────────────────────────────────────
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

  /* ── PRODUCT MANAGEMENT STYLES ── */
  .products-management-section {
    background: white;
    border-radius: 18px;
    overflow: hidden;
  }
  .category-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    border-bottom: 1px solid #e5e7eb;
    padding: 0 0 12px 0;
  }
  .category-tab {
    background: none;
    border: none;
    padding: 8px 18px;
    cursor: pointer;
    font-weight: 600;
    color: #6b7280;
    transition: all 0.3s ease;
    border-radius: 30px;
    font-size: 13px;
  }
  .category-tab:hover { color: #1f2937; background: #f3f4f6; }
  .category-tab.active { color: #b3934e; background: #fff7ed; font-weight: 700; }
  .products-table-container { overflow-x: auto; }
  .products-table { width: 100%; border-collapse: collapse; }
  .products-table th,
  .products-table td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
  }
  .products-table th {
    background: #fafbfc;
    font-weight: 700;
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .products-table tr:hover { background: #fafbfc; }
  .product-image {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 10px;
    background: #f1f5f9;
  }
  .static-badge {
    display: inline-block;
    background: #e5e7eb;
    color: #6b7280;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 500;
    margin-left: 8px;
  }
  .category-badge {
    display: inline-block;
    background: #f1f5f9;
    color: #475569;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  .stock-badge {
    display: inline-block;
    background: #dcfce7;
    color: #166534;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .stock-badge.low-stock { background: #fee2e2; color: #991b1b; }
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 16px 20px;
    background: white;
    border-radius: 18px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .items-per-page { display: flex; align-items: center; gap: 8px; }
  .items-per-page label { color: #6b7280; font-size: 13px; }
  .items-per-page select {
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    background: white;
  }
  .pagination { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .page-btn {
    padding: 7px 12px;
    border: 1px solid #e2e8f0;
    background: white;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-size: 13px;
    font-weight: 500;
  }
  .page-btn:hover:not(:disabled) { background: #f8f9fa; border-color: #b3934e; color: #b3934e; }
  .page-btn.active { background: #b3934e; color: white; border-color: #b3934e; }
  .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .page-info { color: #6b7280; font-size: 13px; }

  /* ══════════════════════════════════════════════════════════
     ADD PRODUCT PAGE — Full redesign matching screenshot
  ══════════════════════════════════════════════════════════ */

  /* Full-screen overlay */
  .ap-overlay {
    position: fixed;
    inset: 0;
    background: #f0f2f5;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    animation: fadeInUp 0.3s ease;
    overflow: hidden;
  }

  /* Top header bar */
  .ap-header {
    background: #1a1d23;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 28px;
    gap: 16px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ap-back-btn {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: #cbd5e1;
    border-radius: 10px;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  .ap-back-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
  .ap-header-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 800;
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.3px;
  }
  .ap-header-sub {
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
    margin-left: 4px;
  }
  .ap-header-actions {
    margin-left: auto;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .ap-btn-cancel {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: #94a3b8;
    border-radius: 10px;
    padding: 9px 18px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }
  .ap-btn-cancel:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; }
  .ap-btn-save {
    background: linear-gradient(135deg, #e07820, #f59e0b);
    border: none;
    color: #fff;
    border-radius: 10px;
    padding: 9px 22px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 16px rgba(224,120,32,0.35);
    transition: all 0.25s;
  }
  .ap-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(224,120,32,0.45); }

  /* Body layout */
  .ap-body {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: start;
  }
  .ap-body::-webkit-scrollbar { width: 6px; }
  .ap-body::-webkit-scrollbar-track { background: transparent; }
  .ap-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

  /* Section cards */
  .ap-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .ap-card-header {
    padding: 16px 22px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fafbfc;
  }
  .ap-card-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1a1d23, #2d3140);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e07820;
    flex-shrink: 0;
  }
  .ap-card-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  .ap-card-subtitle {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    margin: 0;
  }
  .ap-card-body {
    padding: 22px;
  }

  /* Form fields */
  .ap-field-group {
    margin-bottom: 18px;
  }
  .ap-field-group:last-child { margin-bottom: 0; }
  .ap-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #374151;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-family: 'Inter', sans-serif;
  }
  .ap-label span.req { color: #e07820; margin-left: 2px; }
  .ap-input,
  .ap-select,
  .ap-textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13.5px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #fff;
    transition: all 0.2s;
    outline: none;
    appearance: none;
  }
  .ap-input::placeholder,
  .ap-textarea::placeholder { color: #94a3b8; }
  .ap-input:focus,
  .ap-select:focus,
  .ap-textarea:focus {
    border-color: #e07820;
    box-shadow: 0 0 0 3px rgba(224,120,32,0.1);
    background: #fffdf9;
  }
  .ap-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
  .ap-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
    cursor: pointer;
  }
  .ap-row {
    display: grid;
    gap: 14px;
  }
  .ap-row-2 { grid-template-columns: 1fr 1fr; }
  .ap-row-3 { grid-template-columns: 1fr 1fr 1fr; }

  /* Image upload area */
  .ap-media-zone {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafbfc;
    position: relative;
    overflow: hidden;
  }
  .ap-media-zone:hover, .ap-media-zone.drag-over {
    border-color: #e07820;
    background: #fffbf5;
  }
  .ap-media-zone input[type=file] { display: none; }
  .ap-media-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    color: #94a3b8;
  }
  .ap-media-label { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px; }
  .ap-media-hint { font-size: 11.5px; color: #94a3b8; }
  .ap-media-preview {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
  }
  .ap-media-preview img {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    display: block;
  }

  /* URL tab input for image */
  .ap-img-tabs { display: flex; gap: 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 14px; }
  .ap-img-tab {
    padding: 7px 16px; font-size: 12px; font-weight: 600;
    font-family: 'Inter', sans-serif;
    background: none; border: none; border-bottom: 2px solid transparent;
    cursor: pointer; color: #94a3b8; transition: all 0.2s; margin-bottom: -1px;
  }
  .ap-img-tab.active { color: #e07820; border-bottom-color: #e07820; }

  /* Status card toggles */
  .ap-visibility-select {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #fff;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }
  .ap-visibility-select:focus { border-color: #e07820; box-shadow: 0 0 0 3px rgba(224,120,32,0.1); }

  .ap-checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 10px;
  }
  .ap-checkbox-row:last-child { margin-bottom: 0; }
  .ap-checkbox-row:hover { border-color: #e07820; background: #fffbf5; }
  .ap-checkbox-row input[type=checkbox] {
    width: 17px; height: 17px; cursor: pointer; flex-shrink: 0; margin-top: 1px;
    accent-color: #e07820;
  }
  .ap-checkbox-label { font-size: 13px; font-weight: 600; color: #1e293b; font-family: 'Inter', sans-serif; }
  .ap-checkbox-desc { font-size: 11px; color: #94a3b8; margin-top: 2px; }

  /* Dimension inputs row */
  .ap-dim-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }
  .ap-dim-input {
    padding: 10px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
    width: 100%;
  }
  .ap-dim-input:focus { border-color: #e07820; box-shadow: 0 0 0 3px rgba(224,120,32,0.08); }
  .ap-dim-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-align: center; margin-top: 4px; }

  /* Color inputs */
  .ap-color-hint { font-size: 11px; color: #94a3b8; margin-top: 5px; }

  /* Section divider */
  .ap-section-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 18px 0;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .ap-body { grid-template-columns: 1fr; padding: 16px; gap: 16px; }
    .ap-row-2 { grid-template-columns: 1fr; }
    .ap-row-3 { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .ap-row-3 { grid-template-columns: 1fr; }
    .ap-header { padding: 0 16px; }
    .ap-header-sub { display: none; }
  }

  /* ── REVIEWS ── */
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
  .rv-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(420px, 1fr)); gap:16px; }
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
  .rv-empty-text { font-size:15px; font-weight:600; color:#64748b; margin-bottom:16px; }

  .sd-alert { padding:13px 18px; border-radius:12px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:10px; margin-bottom:18px; font-family:'Inter', sans-serif; }
  .sd-alert-warn { background:#fef3c7; color:#92400e; border:1px solid #fde68a; }

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

  .sd-toast { position:fixed; top:20px; right:20px; z-index:9999; padding:13px 20px; border-radius:12px; font-size:13px; font-weight:700; font-family:'Inter', sans-serif; box-shadow:0 6px 24px rgba(0,0,0,0.12); display:flex; align-items:center; gap:9px; animation:toastIn 0.22s ease; }
  .sd-toast-ok  { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
  .sd-toast-err { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }

  .sd-tl-item { display:flex; gap:12px; align-items:flex-start; margin-bottom:12px; }
  .sd-tl-dot { width:22px; height:22px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; margin-top:1px; }
  .sd-tl-dot.done { background:#10b981; color:white; }
  .sd-tl-dot.todo { background:#e2e8f0; color:#94a3b8; }
  .sd-tl-text { font-size:13px; padding-top:2px; font-family:'Inter', sans-serif; }
  .sd-mrow { display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid #f1f5f9; }
  .sd-mrow:last-child { border-bottom:none; }

  .edit-btn, .delete-btn {
    padding: 6px 12px; margin: 0 4px; border: none;
    border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;
    transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 5px;
  }
  .edit-btn { background: #e0e7ff; color: #3730a3; }
  .edit-btn:hover { background: #c7d2fe; transform: translateY(-1px); }
  .delete-btn { background: #fee2e2; color: #991b1b; }
  .delete-btn:hover { background: #fecaca; transform: translateY(-1px); }

  /* Old modal kept for delete confirm */
  .product-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 1200; animation: fadeInUp 0.3s ease;
  }
  .product-modal {
    background: white;
    border-radius: 18px;
    width: 90%;
    max-width: 420px;
    overflow: hidden;
    animation: fadeInUp 0.3s ease;
  }
  .product-modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid #e9ecef;
  }
  .product-modal-header h3 { margin: 0; font-size: 17px; font-weight: 800; color: #0f172a; }
  .product-modal-close {
    background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8;
  }
  .product-modal-body { padding: 22px 24px; }
  .product-modal-footer {
    display: flex; justify-content: flex-end; gap: 10px;
    padding: 16px 24px; border-top: 1px solid #e9ecef;
  }

  @media (max-width: 768px) {
    .sidebar-link span:not(.sd-nb) { display:none; }
    .sidebar-link { justify-content:center; padding:11px; }
    .sd-main { padding:16px 14px; }
    .drawer-container { width:100%; }
    .sd-topnav { padding:0 16px; }
    .rv-grid { grid-template-columns:1fr; }
  }
`;

// Inject CSS only once at module level
if (!document.getElementById("sd-css-v2")) {
  const s = document.createElement("style");
  s.id = "sd-css-v2";
  s.textContent = dashboardCSS;
  document.head.appendChild(s);
}

// ─── STATIC DATA (module-level, never re-created) ─────────────────────────────
const STATIC_PRODUCTS = [
  {
    id: 1,
    name: "Oxford Button-Down Shirt",
    category: "Men",
    subCategory: "Shirts",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.7,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=75&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#FFFFFF", "#4A6FA5", "#2E8B57"],
    description: "Classic Oxford weave, button-down collar, slim fit",
    stock: 45,
    isStatic: true,
  },
  {
    id: 2,
    name: "Linen Summer Shirt",
    category: "Men",
    subCategory: "Shirts",
    price: "₹2,299",
    originalPrice: "₹3,499",
    discount: "34% OFF",
    rating: 4.6,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=75&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#E8D4B8", "#A5B4CB", "#8B9A6E"],
    description: "Breathable linen-cotton blend, perfect for summer",
    stock: 32,
    isStatic: true,
  },
  {
    id: 3,
    name: "Formal White Dress Shirt",
    category: "Men",
    subCategory: "Shirts",
    price: "₹1,599",
    originalPrice: "₹2,699",
    discount: "41% OFF",
    rating: 4.8,
    reviews: 456,
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&q=75&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#FFFFFF", "#F5F5F5"],
    description: "Crisp cotton poplin, spread collar, regular fit",
    stock: 28,
    isStatic: true,
  },
  {
    id: 4,
    name: "Premium Polo T-Shirt",
    category: "Men",
    subCategory: "T-Shirts",
    price: "₹1,299",
    originalPrice: "₹2,199",
    discount: "41% OFF",
    rating: 4.5,
    reviews: 211,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=75&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#FFFFFF", "#1A3A5C", "#2E8B57"],
    description: "Premium cotton pique, classic fit with ribbed collar",
    stock: 56,
    isStatic: true,
  },
  {
    id: 5,
    name: "Graphic Crew Neck Tee",
    category: "Men",
    subCategory: "T-Shirts",
    price: "₹899",
    originalPrice: "₹1,499",
    discount: "40% OFF",
    rating: 4.4,
    reviews: 334,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#1C1C1C", "#4A6FA5", "#E64B2E"],
    description: "Soft 100% cotton, relaxed fit, bold graphic print",
    stock: 89,
    isStatic: true,
  },
  {
    id: 6,
    name: "Banarasi Silk Saree",
    category: "Women",
    subCategory: "Saree",
    price: "₹5,999",
    originalPrice: "₹9,999",
    discount: "40% OFF",
    rating: 4.9,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=75&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#D4AF37", "#8B0000", "#2C1810"],
    description: "Pure Banarasi silk with intricate zari border",
    stock: 15,
    isStatic: true,
  },
  {
    id: 7,
    name: "Flowy Maxi Dress",
    category: "Women",
    subCategory: "Western Dress",
    price: "₹2,899",
    originalPrice: "₹4,499",
    discount: "36% OFF",
    rating: 4.8,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=75&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#E6D5B8", "#D4AF37", "#8B4513"],
    description:
      "Elegant flowy maxi dress with floral print, perfect for summer",
    stock: 52,
    isStatic: true,
  },
  {
    id: 8,
    name: "Silver Pendant Necklace",
    category: "Accessories",
    subCategory: "Jewelry",
    price: "₹2,999",
    originalPrice: "₹4,999",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 289,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=75&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#C0C0C0", "#E8C97E"],
    description: "925 Sterling silver necklace with pendant",
    stock: 27,
    isStatic: true,
  },
  {
    id: 9,
    name: "Leather Strappy Sandals",
    category: "Accessories",
    subCategory: "Sandals",
    price: "₹1,999",
    originalPrice: "₹3,499",
    discount: "43% OFF",
    rating: 4.6,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=400&q=75&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#D4A96A", "#8B5A2B", "#1C1C1C"],
    description: "Genuine leather straps, cushioned footbed",
    stock: 34,
    isStatic: true,
  },
  {
    id: 10,
    name: "Premium Leather Wallet",
    category: "Accessories",
    subCategory: "Accessories",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 423,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=75&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#8B5A2B", "#2C1810", "#4A2512"],
    description: "Premium leather wallet with multiple card slots",
    stock: 53,
    isStatic: true,
  },
];

const INITIAL_ORDERS = [
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

const INITIAL_RETURNS = [
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

const INITIAL_REVIEWS = [
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
      "Thank you Priya! The Signature Hoodie is our bestseller for a reason. Stay warm!",
    replyDate: "2025-03-25",
    verified: true,
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
  },
];

const WEEKLY_SALES = [3400, 4200, 5100, 4800, 6200, 7800, 9100];
const YEARLY_REVENUE_FIRST = [5800, 7200, 9100, 11200, 8900, 12400];
const CATEGORIES = [
  {
    id: "Men",
    name: "Men",
    subcategories: ["Shirts", "Men Fashion", "T-Shirts", "Pants"],
  },
  {
    id: "Women",
    name: "Women",
    subcategories: ["Saree", "Women Fashion", "Western Dress"],
  },
  {
    id: "Accessories",
    name: "Accessories",
    subcategories: ["Sandals", "Accessories", "Jewelry"],
  },
];
const AVAILABLE_TAGS = ["NEW IN", "TRENDING", "BESTSELLER", "HOT"];
const AVATAR_COLORS = [
  "#b3934e",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
];
const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23f1f5f9' rx='10'/%3E%3Ctext x='24' y='28' text-anchor='middle' font-size='18' fill='%23cbd5e1'%3E📷%3C/text%3E%3C/svg%3E";

// ─── HELPERS (stable, module-level) ──────────────────────────────────────────
const getAvatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const parsePriceToNumber = (v) =>
  parseInt(String(v).replace(/[^0-9]/g, "")) || 0;
const formatToINR = (n) => `₹${n.toLocaleString("en-IN")}`;

const getDeletedStatic = () => {
  try {
    return JSON.parse(localStorage.getItem("deletedStaticProducts") || "[]");
  } catch {
    return [];
  }
};

// ─── PURE SUB-COMPONENTS ───────────────────────────────────────────────────────
const Stars = memo(({ rating }) => (
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
));

const STATUS_BADGE_MAP = {
  Delivered: "badge-delivered",
  Shipped: "badge-shipped",
  Processing: "badge-processing",
  Pending: "badge-pending",
  Cancelled: "badge-cancelled",
  Paid: "badge-paid",
  COD: "badge-pending",
  Refunded: "badge-outstock",
};
const OBadge = memo(({ status }) => (
  <span className={`badge-status ${STATUS_BADGE_MAP[status] || "badge-gray"}`}>
    {status}
  </span>
));

const ProductImg = memo(({ src, alt }) => (
  <img
    src={src || PLACEHOLDER_IMG}
    alt={alt}
    className="product-image"
    loading="lazy"
    decoding="async"
    onError={(e) => {
      if (e.target.src !== PLACEHOLDER_IMG) e.target.src = PLACEHOLDER_IMG;
    }}
  />
));

// ─── REDESIGNED IMAGE UPLOAD (for new product page) ─────────────────────────
const APImageUpload = memo(({ imagePreview, onUrlChange, onFileUpload }) => {
  const [tab, setTab] = useState("file");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) onFileUpload(file);
    },
    [onFileUpload],
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) onFileUpload(file);
    },
    [onFileUpload],
  );

  return (
    <div>
      <div className="ap-img-tabs">
        <button
          type="button"
          className={`ap-img-tab ${tab === "file" ? "active" : ""}`}
          onClick={() => setTab("file")}
        >
          Upload File
        </button>
        <button
          type="button"
          className={`ap-img-tab ${tab === "url" ? "active" : ""}`}
          onClick={() => setTab("url")}
        >
          Image URL
        </button>
      </div>

      {tab === "file" ? (
        imagePreview && imagePreview.startsWith("data:") ? (
          <div className="ap-media-preview">
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              onClick={() => onUrlChange("")}
              style={{
                marginTop: 10,
                background: "none",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                color: "#64748b",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}
            >
              × Remove image
            </button>
          </div>
        ) : (
          <div
            className={`ap-media-zone ${dragOver ? "drag-over" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="ap-media-icon">
              <FaImage size={22} />
            </div>
            <div className="ap-media-label">Click to upload images</div>
            <div className="ap-media-hint">PNG, JPG up to 5MB</div>
          </div>
        )
      ) : (
        <div>
          <input
            type="text"
            className="ap-input"
            placeholder="https://example.com/product-image.jpg"
            value={
              imagePreview && !imagePreview.startsWith("data:")
                ? imagePreview
                : ""
            }
            onChange={(e) => onUrlChange(e.target.value)}
          />
          {imagePreview && !imagePreview.startsWith("data:") && (
            <div className="ap-media-preview" style={{ marginTop: 12 }}>
              <img
                src={imagePreview}
                alt="Preview"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ─── ANALYTICS TAB ─────────────────────────────────────────────────────────────
const AnalyticsTabComponent = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [yearlyHalf, setYearlyHalf] = useState("firstHalf");
  const weeklyData = [3400, 4200, 5100, 4800, 6200, 7800, 9100, 8500];
  const monthlyData = [
    5800, 7200, 9100, 11200, 8900, 12400, 13500, 14800, 16200, 17100, 18500,
    19800,
  ];
  const yearlyData = [
    15000, 22000, 28000, 35000, 42000, 48000, 52000, 58000, 63000, 69000, 74000,
    78000,
  ];
  const MONTH_LABELS = [
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

  const currentData = useMemo(() => {
    if (timeRange === "weekly")
      return weeklyData.map((v, i) => ({
        label: `W${i + 1}`,
        revenue: v,
        orders: Math.floor(v / 50),
      }));
    if (timeRange === "monthly")
      return monthlyData.map((v, i) => ({
        label: MONTH_LABELS[i],
        revenue: v,
        orders: Math.floor(v / 60),
      }));
    const half =
      yearlyHalf === "firstHalf"
        ? yearlyData.slice(0, 6)
        : yearlyData.slice(6, 12);
    const offset = yearlyHalf === "firstHalf" ? 0 : 6;
    return half.map((v, i) => ({
      label: MONTH_LABELS[i + offset],
      revenue: v,
      orders: Math.floor(v / 70),
    }));
  }, [timeRange, yearlyHalf]);

  const maxRevenue = useMemo(
    () => Math.max(...currentData.map((d) => d.revenue)),
    [currentData],
  );
  const totalRev = currentData.reduce((s, d) => s + d.revenue, 0);
  const avgRev = Math.floor(totalRev / currentData.length);

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
            {["weekly", "monthly", "yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setTimeRange(p)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 40,
                  border: timeRange === p ? "none" : "1.5px solid #e2e8f0",
                  background:
                    timeRange === p
                      ? "linear-gradient(135deg, #b3934e, #d4af6a)"
                      : "#fff",
                  color: timeRange === p ? "white" : "#64748b",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          {timeRange === "yearly" && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {[
                ["firstHalf", "Jan - Jun"],
                ["secondHalf", "Jul - Dec"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setYearlyHalf(key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 30,
                    border: yearlyHalf === key ? "none" : "1px solid #ddd",
                    background:
                      yearlyHalf === key
                        ? "linear-gradient(135deg, #b3934e, #d4af6a)"
                        : "#fff",
                    color: yearlyHalf === key ? "#fff" : "#64748b",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="row g-3 mb-4">
        {[
          { v: `₹${totalRev.toLocaleString()}`, l: "Total Revenue" },
          { v: `₹${avgRev.toLocaleString()}`, l: "Average Revenue" },
          {
            v: currentData.reduce((s, d) => s + d.orders, 0),
            l: "Total Orders",
          },
        ].map((s, i) => (
          <div className="col-md-4" key={i}>
            <div className="stat-card">
              <div className="stat-value">{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-card">
        <div className="sd-ch">
          <div className="sd-ct">
            {timeRange === "weekly"
              ? "Weekly Revenue Trend (Last 8 Weeks)"
              : timeRange === "monthly"
                ? "Monthly Revenue Trend (Last 12 Months)"
                : `Yearly Revenue Trend (${yearlyHalf === "firstHalf" ? "Jan - Jun" : "Jul - Dec"})`}
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
                  ₹{Math.floor(item.revenue / 1000)}k
                </div>
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(35, (item.revenue / maxRevenue) * 140)}px`,
                  }}
                />
                <div className="chart-lbl" style={{ marginTop: 8 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    products: sellerProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [activeTab, setActiveTab] = useState("overview");

  // Products
  const [allProducts, setAllProducts] = useState(() => {
    const deleted = getDeletedStatic();
    const available = (STATIC_PRODUCTS || []).filter(
      (p) => !deleted.includes(p.id),
    );
    return available.map((p) => ({ ...p, isStatic: true }));
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const EMPTY_FORM = useMemo(
    () => ({
      name: "",
      price: "",
      originalPrice: "",
      discount: "",
      category: "",
      subCategory: "",
      rating: 4.0,
      reviews: 0,
      image: "",
      imageFile: null,
      description: "",
      tag: "NEW IN",
      colors: "",
      stock: 0,
      sku: "",
      mrp: "",
      brand: "",
      weight: "",
      length: "",
      breadth: "",
      height: "",
      variant_name: "",
      variant_value: "",
      is_variant: false,
      is_active: true,
      parent_product_id: "",
      category_id: "",
    }),
    [],
  );

  const [productForm, setProductForm] = useState(EMPTY_FORM);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [orderFilter, setOrderFilter] = useState("All");
  const [returnFilter, setReturnFilter] = useState("All");
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

  // Reviews
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
  const toastTimerRef = useRef(null);

  // Sync seller products into allProducts without re-adding statics
  useEffect(() => {
    const deleted = getDeletedStatic();
    const availableStatic = (STATIC_PRODUCTS || [])
      .filter((p) => !deleted.includes(p.id))
      .map((p) => ({ ...p, isStatic: true }));

    const sellerWithFlag = sellerProducts.map((p) => ({
      ...p,
      isStatic: false,
    }));
    setAllProducts([...availableStatic, ...sellerWithFlag]);
  }, [sellerProducts]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const notify = useCallback((msg, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setToast({ msg, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalSales = orders.length;
    const totalProducts = allProducts.length;
    const lowStockCount = allProducts.filter(
      (p) => p.stock > 0 && p.stock <= 10,
    ).length;
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(
            1,
          )
        : "0.0";
    const pendingCount = orders.filter((o) =>
      ["Pending", "Processing"].includes(o.status),
    ).length;
    return {
      totalRevenue,
      totalSales,
      totalProducts,
      lowStockCount,
      avgRating,
      pendingCount,
    };
  }, [orders, allProducts, reviews]);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.category === selectedCategory),
    [allProducts, selectedCategory],
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredProducts.length / itemsPerPage),
    [filteredProducts.length, itemsPerPage],
  );

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const filteredOrders = useMemo(
    () =>
      orderFilter === "All"
        ? orders
        : orders.filter((o) => o.status === orderFilter),
    [orders, orderFilter],
  );

  const filteredReturns = useMemo(
    () =>
      returnFilter === "All"
        ? returns
        : returns.filter((r) => r.status === returnFilter),
    [returns, returnFilter],
  );

  const filteredReviews = useMemo(
    () =>
      reviews
        .filter((r) => {
          if (rvFilterProduct !== "all" && r.productId !== rvFilterProduct)
            return false;
          if (rvFilterRating && r.rating !== parseInt(rvFilterRating))
            return false;
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
        }),
    [reviews, rvFilterProduct, rvFilterRating, rvSearch, rvDateRange, rvSort],
  );

  // ── Callbacks ────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);
  const handleProfile = useCallback(() => {
    navigate("/profile");
    setShowUserMenu(false);
  }, [navigate]);

  const closeDrawer = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDrawer(false);
      setIsClosing(false);
    }, 280);
  }, []);

  const handleTotalRevenueClick = useCallback(() => {
    setDrawerData({
      title: "Total Revenue Details",
      columns: ["Order ID", "Customer", "Total", "Status"],
      rows: orders.map((o) => ({
        id: o.id,
        customer: o.customer,
        total: `₹${o.total}`,
        status: o.status,
      })),
    });
    setShowDrawer(true);
  }, [orders]);

  const handleTotalOrdersClick = useCallback(() => {
    setDrawerData({
      title: "All Orders",
      columns: ["Order ID", "Customer", "Total", "Status", "Date"],
      rows: orders.map((o) => ({
        id: o.id,
        customer: o.customer,
        total: `₹${o.total}`,
        status: o.status,
        date: o.date,
      })),
    });
    setShowDrawer(true);
  }, [orders]);

  const handleTotalProductsClick = useCallback(() => {
    setDrawerData({
      title: "All Products",
      columns: ["ID", "Product Name", "Price", "Stock", "Category"],
      rows: allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.category,
      })),
    });
    setShowDrawer(true);
  }, [allProducts]);

  const handleLowStockClick = useCallback(() => {
    const low = allProducts.filter((p) => p.stock > 0 && p.stock <= 10);
    setDrawerData({
      title: "Low Stock Items",
      columns: ["ID", "Product Name", "Stock", "Price"],
      rows: low.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        price: p.price,
      })),
    });
    setShowDrawer(true);
  }, [allProducts]);

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setProductForm(EMPTY_FORM);
    setImagePreview("");
    setShowProductModal(true);
  }, [EMPTY_FORM]);

  const handleEditProduct = useCallback((product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: parsePriceToNumber(product.price).toString(),
      originalPrice: parsePriceToNumber(product.originalPrice).toString(),
      discount: product.discount || "",
      category: product.category,
      subCategory: product.subCategory,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      description: product.description,
      tag: product.tag,
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : product.colors || "",
      stock: product.stock,
      sku: product.sku || "",
      mrp: product.mrp || "",
      brand: product.brand || "",
      weight: product.weight || "",
      length: product.length || "",
      breadth: product.breadth || "",
      height: product.height || "",
      variant_name: product.variant_name || "",
      variant_value: product.variant_value || "",
      is_variant: product.is_variant || false,
      is_active: product.is_active !== undefined ? product.is_active : true,
      parent_product_id: product.parent_product_id || "",
      category_id: product.category_id || "",
    });
    setImagePreview(product.image || "");
    setShowProductModal(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "category") {
        updatedForm.subCategory = "";
      }
      return updatedForm;
    });
  }, []);

  const handleImageUrlChange = useCallback((url) => {
    setProductForm((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  }, []);

  const handleImageFileUpload = useCallback(
    (file) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        notify("Image must be under 5 MB", "error");
        return;
      }
      setProductForm((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX = 800;
          let { width, height } = img;
          if (width > MAX) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          setImagePreview(dataUrl);
          setProductForm((prev) => ({ ...prev, image: dataUrl }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    [notify],
  );

  const handleSaveProduct = useCallback(async () => {
    const {
      name,
      category,
      subCategory,
      price,
      description,
      stock,
      colors,
      tag,
    } = productForm;

    if (!name) return notify("Please enter a product name", "error");
    if (!category) return notify("Please select a category", "error");
    if (!subCategory) return notify("Please select a subcategory", "error");
    if (!price) return notify("Please enter a price", "error");

    const sellingPriceNum = parsePriceToNumber(price);
    if (sellingPriceNum <= 0)
      return notify("Price must be greater than 0", "error");

    try {
      const productData = {
        name,
        price: sellingPriceNum,
        originalPrice: parsePriceToNumber(productForm.originalPrice || price),
        discount: productForm.discount,
        category,
        subCategory,
        rating: productForm.rating || 4.5,
        reviews: productForm.reviews || 0,
        image: productForm.image,
        imageFile: productForm.imageFile,
        description: description || "",
        tag: tag || "NEW IN",
        colors:
          typeof colors === "string"
            ? colors
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
            : [],
        stock: parseInt(stock) || 0,
        seller_id: user?.id || 1,
        sku: productForm.sku || null,
        mrp: parseFloat(productForm.mrp) || null,
        brand: productForm.brand || null,
        weight: parseFloat(productForm.weight) || null,
        length: parseFloat(productForm.length) || null,
        breadth: parseFloat(productForm.breadth) || null,
        height: parseFloat(productForm.height) || null,
        variant_name: productForm.variant_name || null,
        variant_value: productForm.variant_value || null,
        is_variant: productForm.is_variant,
        is_active: productForm.is_active,
        parent_product_id: parseInt(productForm.parent_product_id) || null,
        category_id: parseInt(productForm.category_id) || null,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        notify("Product updated successfully!");
      } else {
        await addProduct(productData, user?.id);
        notify("Product added successfully!");
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setImagePreview("");
      setProductForm(EMPTY_FORM);
    } catch (error) {
      console.error("Save product error:", error);
      notify("Failed to save product: " + error.message, "error");
    }
  }, [
    productForm,
    editingProduct,
    addProduct,
    updateProduct,
    notify,
    user,
    EMPTY_FORM,
  ]);

  const confirmDelete = useCallback((product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;
    try {
      if (productToDelete.isStatic) {
        const deleted = getDeletedStatic();
        if (!deleted.includes(productToDelete.id)) {
          localStorage.setItem(
            "deletedStaticProducts",
            JSON.stringify([...deleted, productToDelete.id]),
          );
        }
        setAllProducts((prev) =>
          prev.filter((p) => p.id !== productToDelete.id),
        );
        notify("Static product deleted successfully!");
      } else {
        await deleteProduct(productToDelete.id);
        notify("Product deleted successfully!");
      }
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      notify("Failed to delete product: " + error.message, "error");
    }
  }, [productToDelete, deleteProduct, notify]);

  const updateOrderStatus = useCallback(
    (id, status) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      setSelectedOrder((prev) =>
        prev && prev.id === id ? { ...prev, status } : prev,
      );
      notify(`Order ${id} → ${status}`);
    },
    [notify],
  );

  const handleHelpful = useCallback(
    (reviewId) => {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r,
        ),
      );
      notify("Marked as helpful!");
    },
    [notify],
  );

  const handleReplyToggle = useCallback((reviewId) => {
    setReplyingTo((prev) => {
      if (prev === reviewId) {
        setReplyText("");
        return null;
      }
      setReplyText("");
      return reviewId;
    });
  }, []);

  const submitReply = useCallback(
    (reviewId) => {
      if (!replyText.trim()) {
        notify("Please enter a reply", "error");
        return;
      }
      setReviews((prev) =>
        prev.map((r) =>
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
    },
    [replyText, notify],
  );

  const handleSelectReview = useCallback((id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const getCategoryCount = useCallback(
    (categoryId) =>
      categoryId === "all"
        ? allProducts.length
        : allProducts.filter((p) => p.category === categoryId).length,
    [allProducts],
  );

  const handlePageChange = useCallback((p) => setCurrentPage(p), []);
  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  // ── SIDEBAR ───────────────────────────────────────────────────────────────
  const Sidebar = useMemo(
    () => (
      <div className="sd-sb-inner">
        <div className="sd-sb-brand">
          <div className="sd-sb-name">NIVEST Seller</div>
          <div className="sd-sb-user">{user?.name || "Seller"}</div>
        </div>
        <div className="sd-sb-sec">Main</div>
        {[
          {
            key: "overview",
            icon: <FaTachometerAlt size={16} />,
            label: "Overview",
          },
          { key: "products", icon: <FaStore size={16} />, label: "Products" },
          {
            key: "orders",
            icon: <FaShoppingCart size={16} />,
            label: "Orders",
            badge: stats.pendingCount,
          },
          {
            key: "shipping",
            icon: <FaTruck size={16} />,
            label: "Shipping & Delivery",
          },
          {
            key: "returns",
            icon: <FaUndo size={16} />,
            label: "Returns",
            badgeDanger: returns.filter((r) => r.status === "Pending").length,
          },
          {
            key: "payments",
            icon: <FaMoneyBillWave size={16} />,
            label: "Payments",
          },
          {
            key: "reviews",
            icon: <FaStar size={16} />,
            label: "Customer Reviews",
          },
          {
            key: "analytics",
            icon: <FaChartLine size={16} />,
            label: "Analytics",
          },
        ].map(({ key, icon, label, badge, badgeDanger }) => (
          <button
            key={key}
            className={`sidebar-link ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {icon} <span>{label}</span>
            {badge > 0 && <span className="sd-nb">{badge}</span>}
            {badgeDanger > 0 && (
              <span className="sd-nb danger">{badgeDanger}</span>
            )}
          </button>
        ))}
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
    ),
    [
      activeTab,
      user?.name,
      stats.pendingCount,
      returns,
      handleProfile,
      handleLogout,
    ],
  );

  // ── OVERVIEW TAB ──────────────────────────────────────────────────────────
  const OverviewTab = useMemo(() => {
    const statCards = [
      {
        icon: <FaDollarSign size={22} style={{ color: "#b3934e" }} />,
        value: `₹${stats.totalRevenue}`,
        label: "Total Revenue",
        trend: "+12.5%",
        up: true,
        onClick: handleTotalRevenueClick,
      },
      {
        icon: <FaShoppingCart size={22} style={{ color: "#b3934e" }} />,
        value: stats.totalSales,
        label: "Total Orders",
        trend: "+8.2%",
        up: true,
        onClick: handleTotalOrdersClick,
      },
      {
        icon: <FaBoxOpen size={22} style={{ color: "#b3934e" }} />,
        value: stats.totalProducts,
        label: "Active Products",
        trend: "+3",
        up: true,
        onClick: handleTotalProductsClick,
      },
      {
        icon: <FaTags size={22} style={{ color: "#b3934e" }} />,
        value: stats.lowStockCount,
        label: "Low Stock Items",
        trend: "-2",
        up: false,
        onClick: handleLowStockClick,
      },
    ];
    return (
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
        {stats.lowStockCount > 0 && (
          <div className="sd-alert sd-alert-warn">
            ⚠️{" "}
            <strong>
              {stats.lowStockCount} product{stats.lowStockCount > 1 ? "s" : ""}{" "}
              running low
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
          {statCards.map((s, i) => (
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
                      {s.up ? (
                        <FaArrowUp size={10} />
                      ) : (
                        <FaArrowDown size={10} />
                      )}{" "}
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
            <div className="sd-ct">Top Selling Products</div>
            <button
              className="btn-outline-gold"
              onClick={() => setActiveTab("products")}
            >
              View All
            </button>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {allProducts.slice(0, 4).map((p, i) => (
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
                    {p.reviews || 0} sold
                  </span>
                </div>
                <div className="sd-prog">
                  <div
                    className="sd-prog-bar"
                    style={{
                      width: `${Math.min(100, ((p.reviews || 0) / 130) * 100)}%`,
                    }}
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
                <div className="sd-ct">Recent Orders</div>
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
                            ₹{o.total}
                          </span>
                        </td>
                        <td>
                          <OBadge status={o.status} />
                        </td>
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
                <div className="sd-ct">Weekly Sales</div>
                <span className="badge-status badge-active">↑ 18%</span>
              </div>
              <div style={{ padding: "20px 20px 14px" }}>
                <div className="chart-bars">
                  {WEEKLY_SALES.map((v, i) => (
                    <div className="chart-col" key={i}>
                      <div
                        className={`chart-bar ${i === 6 ? "today" : ""}`}
                        style={{
                          height: `${Math.max(20, (v / 10000) * 130)}px`,
                        }}
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
  }, [
    stats,
    allProducts,
    orders,
    user?.name,
    handleAddProduct,
    handleTotalRevenueClick,
    handleTotalOrdersClick,
    handleTotalProductsClick,
    handleLowStockClick,
  ]);

  // ── PRODUCTS TAB ──────────────────────────────────────────────────────────
  const ProductsTab = useMemo(() => {
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = indexOfFirstItem + itemsPerPage;
    return (
      <div className="products-management-section">
        <div className="sd-ph">
          <div>
            <p className="sd-pt">Product Inventory</p>
            <p className="sd-ps">
              {allProducts.length} products ·{" "}
              {allProducts.filter((p) => !p.isStatic).length} custom /{" "}
              {allProducts.filter((p) => p.isStatic).length} static
            </p>
          </div>
          <button className="btn-gold" onClick={handleAddProduct}>
            <FaPlus size={12} /> Add New Product
          </button>
        </div>
        <div className="category-tabs">
          <button
            className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            All Products ({getCategoryCount("all")})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name} ({getCategoryCount(cat.id)})
            </button>
          ))}
        </div>
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <ProductImg src={product.image} alt={product.name} />
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.isStatic && (
                        <span className="static-badge">Static</span>
                      )}
                    </td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td>{product.subCategory || "-"}</td>
                    <td>{product.price}</td>
                    <td>
                      <span
                        className={`stock-badge ${product.stock < 10 ? "low-stock" : ""}`}
                      >
                        {product.stock || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#f59e0b" }}>★</span>{" "}
                      {product.rating || "N/A"}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditProduct(product)}
                      >
                        <FaEdit size={12} /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => confirmDelete(product)}
                      >
                        <FaTrash size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    No products found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredProducts.length > 0 && (
          <div className="pagination-container">
            <div className="items-per-page">
              <label>Show:</label>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {(() => {
                const max = 5,
                  start = Math.max(
                    1,
                    Math.min(currentPage - 2, totalPages - max + 1),
                  ),
                  end = Math.min(totalPages, start + max - 1);
                return Array.from(
                  { length: end - start + 1 },
                  (_, i) => start + i,
                ).map((n) => (
                  <button
                    key={n}
                    className={`page-btn ${currentPage === n ? "active" : ""}`}
                    onClick={() => handlePageChange(n)}
                  >
                    {n}
                  </button>
                ));
              })()}
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
            <div className="page-info">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
              {filteredProducts.length} entries
            </div>
          </div>
        )}
      </div>
    );
  }, [
    allProducts,
    currentProducts,
    filteredProducts,
    selectedCategory,
    currentPage,
    itemsPerPage,
    totalPages,
    handleAddProduct,
    handleEditProduct,
    confirmDelete,
    getCategoryCount,
    handlePageChange,
    handleItemsPerPageChange,
  ]);

  // ─── ORDERS TAB ────────────────────────────────────────────────────────────
  const OrdersTab = useMemo(
    () => (
      <>
        <div className="sd-ph">
          <div>
            <p className="sd-pt">Order Management</p>
            <p className="sd-ps">Accept, process and dispatch orders</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
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
                    <td
                      style={{ fontSize: 12, color: "#64748b", maxWidth: 150 }}
                    >
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
                        ₹{o.total}
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
                            onClick={() =>
                              updateOrderStatus(o.id, "Processing")
                            }
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
    ),
    [filteredOrders, orderFilter, orders, updateOrderStatus],
  );

  // ── SHIPPING TAB ──────────────────────────────────────────────────────────
  const ShippingTab = useMemo(() => {
    const shippingStats = [
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
    ];
    const queueOrders = orders.filter(
      (o) => !["Delivered", "Cancelled"].includes(o.status),
    );
    return (
      <>
        <div className="sd-ph">
          <div>
            <p className="sd-pt">Shipping & Delivery</p>
            <p className="sd-ps">Manage dispatches and track deliveries</p>
          </div>
        </div>
        <div className="row g-3 mb-4">
          {shippingStats.map((s, i) => (
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
            <div className="sd-ct">Dispatch Queue</div>
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
                {queueOrders.map((o) => (
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
                        ₹{o.total}
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
  }, [orders, updateOrderStatus]);

  // ── RETURNS TAB ───────────────────────────────────────────────────────────
  const ReturnsTab = useMemo(
    () => (
      <>
        <div className="sd-ph">
          <div>
            <p className="sd-pt">Returns Management</p>
            <p className="sd-ps">Handle return and refund requests</p>
          </div>
        </div>
        <div className="row g-3 mb-4">
          {[
            {
              v: returns.length,
              l: "Total Returns",
              onClick: () => setReturnFilter("All"),
            },
            {
              v: returns.filter((r) => r.status === "Pending").length,
              l: "Pending Returns",
              onClick: () => setReturnFilter("Pending"),
            },
            {
              v: returns.filter((r) => r.status === "Approved").length,
              l: "Approved",
              onClick: () => setReturnFilter("Approved"),
            },
            {
              v: `₹${returns.reduce((s, r) => s + r.amount, 0)}`,
              l: "Total Refund Amount",
            },
          ].map((s, i) => (
            <div className="col-md-3" key={i}>
              <div
                className="stat-card"
                onClick={s.onClick}
                style={{ cursor: s.onClick ? "pointer" : "default" }}
              >
                <div className="stat-value" style={{ fontSize: 34 }}>
                  {s.v}
                </div>
                <div className="stat-label">{s.l}</div>
              </div>
            </div>
          ))}
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
                    <td style={{ fontWeight: 700, color: "#b3934e" }}>
                      {r.id}
                    </td>
                    <td>{r.orderId}</td>
                    <td style={{ fontWeight: 600 }}>{r.customer}</td>
                    <td>{r.product}</td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>
                      {r.reason}
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 800,
                          fontSize: 16,
                        }}
                      >
                        ₹{r.amount}
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
                              setReturns((prev) =>
                                prev.map((x) =>
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
                              setReturns((prev) =>
                                prev.map((x) =>
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
    ),
    [filteredReturns, returns, notify],
  );

  // ── PAYMENTS TAB ──────────────────────────────────────────────────────────
  const PaymentsTab = useMemo(() => {
    const paid = orders
      .filter((o) => o.payment === "Paid")
      .reduce((s, o) => s + o.total, 0);
    const cod = orders
      .filter((o) => o.payment === "COD")
      .reduce((s, o) => s + o.total, 0);
    const refundTotal = returns.reduce((s, r) => s + r.amount, 0);
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
              v: `₹${stats.totalRevenue}`,
              l: "Total Earnings",
              up: true,
              t: "+12.5%",
            },
            { v: `₹${paid}`, l: "Settled (Online)", up: true, t: "Received" },
            { v: `₹${cod}`, l: "COD Pending", up: false, t: "Awaiting" },
            { v: `₹${refundTotal}`, l: "Refunded", up: false, t: "Processed" },
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
                  {YEARLY_REVENUE_FIRST.map((v, i) => (
                    <div className="chart-col" key={i}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#b3934e",
                          fontWeight: 700,
                        }}
                      >
                        ₹{Math.floor(v / 1000)}k
                      </div>
                      <div
                        className="chart-bar"
                        style={{ height: `${(v / 20000) * 130}px` }}
                      />
                      <div className="chart-lbl">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                      </div>
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
                    color: "#10b981",
                  },
                  {
                    label: "Cash on Delivery",
                    value: orders.filter((o) => o.payment === "COD").length,
                    color: "#f59e0b",
                  },
                  {
                    label: "Refunded",
                    value: returns.length,
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
                          width: `${(item.value / orders.length) * 100}%`,
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
  }, [orders, returns, stats.totalRevenue]);

  // ── REVIEWS TAB ───────────────────────────────────────────────────────────
  const ReviewsTab = useMemo(
    () => (
      <>
        <div className="rv-header">
          <div>
            <p className="sd-pt">Customer Reviews</p>
            <p className="sd-ps">
              {reviews.length} reviews · Avg rating {stats.avgRating} ⭐
            </p>
          </div>
          <button className="btn-gold">
            <FaPlus size={12} /> Create Request
          </button>
        </div>
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
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {issue.pct}% {issue.label}
                </span>
              </div>
            ))}
          </div>
        </div>
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
            {STATIC_PRODUCTS.map((p) => (
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
              />{" "}
              Select All
            </label>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              {filteredReviews.length} review
              {filteredReviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
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
                  <input
                    type="checkbox"
                    className="rv-checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectReview(r.id)}
                  />
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
                          <div className="rv-verified">
                            ✅ Verified Purchase
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
    ),
    [
      reviews,
      stats.avgRating,
      rvTab,
      rvSearch,
      rvDateRange,
      rvFilterProduct,
      rvFilterRating,
      rvSort,
      filteredReviews,
      selectedReviews,
      replyingTo,
      replyText,
      notify,
      handleHelpful,
      handleReplyToggle,
      handleSelectReview,
      submitReply,
    ],
  );

  // ── DRAWERS ────────────────────────────────────────────────────────────────
  const SlideDrawer = useMemo(
    () =>
      !showDrawer ? null : (
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
                <div
                  style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}
                >
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
      ),
    [showDrawer, isClosing, drawerData, closeDrawer],
  );

  const OrderDetailDrawer = useMemo(() => {
    const o = selectedOrder;
    if (!showOrderDrawer || !o) return null;
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
                  ["Total", `₹${o.total}`],
                ].map(([l, v], i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}
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
  }, [selectedOrder, showOrderDrawer, updateOrderStatus]);

  // ─── REDESIGNED ADD/EDIT PRODUCT PAGE ─────────────────────────────────────
  const ProductModal = useMemo(
    () =>
      !showProductModal ? null : (
        <div className="ap-overlay">
          {/* Header */}
          <div className="ap-header">
            <button
              className="ap-back-btn"
              onClick={() => setShowProductModal(false)}
            >
              <FaArrowLeft size={12} />
              Back
            </button>
            <div>
              <span className="ap-header-title">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </span>
              <span className="ap-header-sub">
                {editingProduct
                  ? "Update your product listing"
                  : "Fill in the details to list a new item."}
              </span>
            </div>
            <div className="ap-header-actions">
              <button
                className="ap-btn-cancel"
                onClick={() => setShowProductModal(false)}
              >
                Discard
              </button>
              <button className="ap-btn-save" onClick={handleSaveProduct}>
                <FaCheckCircle size={13} />
                {editingProduct ? "Update Product" : "Save Product"}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="ap-body">
            {/* LEFT COLUMN */}
            <div>
              {/* Basic Information */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaStore size={14} />
                  </div>
                  <div>
                    <p className="ap-card-title">Basic Information</p>
                    <p className="ap-card-subtitle">Core product details</p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <div className="ap-field-group">
                    <label className="ap-label">
                      Product Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="ap-input"
                      value={productForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sony Alpha A7 IV"
                    />
                  </div>

                  <div className="ap-field-group">
                    <label className="ap-label">
                      Description <span className="req">*</span>
                    </label>
                    <textarea
                      name="description"
                      className="ap-textarea"
                      value={productForm.description}
                      onChange={handleInputChange}
                      placeholder="Detailed product description..."
                      rows={4}
                    />
                  </div>

                  <div className="ap-row ap-row-2">
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">
                        Category <span className="req">*</span>
                      </label>
                      <select
                        name="category"
                        className="ap-select"
                        value={productForm.category}
                        onChange={handleInputChange}
                      >
                        <option value="">e.g. Camera, Laptop, Accessory</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">SKU / Product ID</label>
                      <input
                        type="text"
                        name="sku"
                        className="ap-input"
                        value={productForm.sku}
                        onChange={handleInputChange}
                        placeholder="e.g. SNY-A7IV-001"
                      />
                    </div>
                  </div>

                  <div className="ap-field-group">
                    <label className="ap-label">
                      Subcategory <span className="req">*</span>
                    </label>
                    <select
                      name="subCategory"
                      className="ap-select"
                      value={productForm.subCategory}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Subcategory</option>
                      {productForm.category
                        ? CATEGORIES.find(
                            (c) => c.id === productForm.category,
                          )?.subcategories.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>

                  <div className="ap-field-group">
                    <label className="ap-label">Brand Name</label>
                    <input
                      type="text"
                      name="brand"
                      className="ap-input"
                      value={productForm.brand}
                      onChange={handleInputChange}
                      placeholder="e.g. Nivest Premium"
                    />
                  </div>

                  <div className="ap-field-group">
                    <label className="ap-label">
                      Colors (hex codes, comma separated)
                    </label>
                    <input
                      type="text"
                      name="colors"
                      className="ap-input"
                      value={
                        typeof productForm.colors === "string"
                          ? productForm.colors
                          : productForm.colors.join(", ")
                      }
                      onChange={handleInputChange}
                      placeholder="#FFFFFF, #000000, #4A6FA5"
                    />
                    <div className="ap-color-hint">
                      Enter color hex codes separated by commas
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaDollarSign size={14} />
                  </div>
                  <div>
                    <p className="ap-card-title">Pricing & Inventory</p>
                    <p className="ap-card-subtitle">
                      Set your price and stock levels
                    </p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <div className="ap-row ap-row-3">
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">
                        Regular Price (₹) <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        className="ap-input"
                        value={productForm.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Discount Price (₹)</label>
                      <input
                        type="number"
                        name="mrp"
                        className="ap-input"
                        value={productForm.mrp}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">
                        Stock Quantity <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        className="ap-input"
                        value={productForm.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="ap-section-divider" />

                  <div className="ap-row ap-row-2">
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Original Price (₹)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        className="ap-input"
                        value={productForm.originalPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Discount Label</label>
                      <input
                        type="text"
                        name="discount"
                        className="ap-input"
                        value={productForm.discount}
                        onChange={handleInputChange}
                        placeholder="e.g. 40% OFF"
                      />
                    </div>
                  </div>

                  <div className="ap-row ap-row-2" style={{ marginTop: 14 }}>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Rating (0–5)</label>
                      <input
                        type="number"
                        name="rating"
                        className="ap-input"
                        value={productForm.rating}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="4.5"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Number of Reviews</label>
                      <input
                        type="number"
                        name="reviews"
                        className="ap-input"
                        value={productForm.reviews}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Dimensions */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaTruck size={14} />
                  </div>
                  <div>
                    <p className="ap-card-title">Shipping & Dimensions</p>
                    <p className="ap-card-subtitle">
                      Package size for accurate shipping rates
                    </p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <div className="ap-row ap-row-2">
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        className="ap-input"
                        value={productForm.weight}
                        onChange={handleInputChange}
                        placeholder="0.5"
                        step="0.01"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">
                        Dimensions L × B × H (cm)
                      </label>
                      <div className="ap-dim-row">
                        <div>
                          <input
                            type="number"
                            name="length"
                            className="ap-dim-input"
                            value={productForm.length}
                            onChange={handleInputChange}
                            placeholder="L"
                          />
                          <div className="ap-dim-label">Length</div>
                        </div>
                        <div>
                          <input
                            type="number"
                            name="breadth"
                            className="ap-dim-input"
                            value={productForm.breadth}
                            onChange={handleInputChange}
                            placeholder="B"
                          />
                          <div className="ap-dim-label">Breadth</div>
                        </div>
                        <div>
                          <input
                            type="number"
                            name="height"
                            className="ap-dim-input"
                            value={productForm.height}
                            onChange={handleInputChange}
                            placeholder="H"
                          />
                          <div className="ap-dim-label">Height</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaLayerGroup size={14} />
                  </div>
                  <div>
                    <p className="ap-card-title">Variants & IDs</p>
                    <p className="ap-card-subtitle">
                      For product variations like size or color
                    </p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <div className="ap-row ap-row-2">
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Variant Name</label>
                      <input
                        type="text"
                        name="variant_name"
                        className="ap-input"
                        value={productForm.variant_name}
                        onChange={handleInputChange}
                        placeholder="e.g. Size"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Variant Value</label>
                      <input
                        type="text"
                        name="variant_value"
                        className="ap-input"
                        value={productForm.variant_value}
                        onChange={handleInputChange}
                        placeholder="e.g. XL"
                      />
                    </div>
                  </div>
                  <div className="ap-row ap-row-2" style={{ marginTop: 14 }}>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Parent Product ID</label>
                      <input
                        type="number"
                        name="parent_product_id"
                        className="ap-input"
                        value={productForm.parent_product_id}
                        onChange={handleInputChange}
                        placeholder="e.g. 101"
                      />
                    </div>
                    <div className="ap-field-group" style={{ margin: 0 }}>
                      <label className="ap-label">Category ID</label>
                      <input
                        type="number"
                        name="category_id"
                        className="ap-input"
                        value={productForm.category_id}
                        onChange={handleInputChange}
                        placeholder="e.g. 5001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Product Media */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaImage size={14} />
                  </div>
                  <div>
                    <p className="ap-card-title">Product Media</p>
                    <p className="ap-card-subtitle">
                      Upload or link your image
                    </p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <APImageUpload
                    imagePreview={imagePreview}
                    onUrlChange={handleImageUrlChange}
                    onFileUpload={handleImageFileUpload}
                  />
                </div>
              </div>

              {/* Product Status */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaCheckCircle size={14} />
                  </div>
                  <div>
                    <p className="ap-card-title">Product Status</p>
                    <p className="ap-card-subtitle">
                      Control visibility and features
                    </p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <div className="ap-field-group">
                    <label className="ap-label">Visibility</label>
                    <select
                      name="is_active"
                      className="ap-visibility-select"
                      value={productForm.is_active ? "true" : "false"}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          is_active: e.target.value === "true",
                        }))
                      }
                    >
                      <option value="true">Active (Public)</option>
                      <option value="false">Draft (Hidden)</option>
                    </select>
                  </div>

                  <label className="ap-checkbox-row" htmlFor="is_variant_chk">
                    <input
                      type="checkbox"
                      id="is_variant_chk"
                      name="is_variant"
                      checked={productForm.is_variant}
                      onChange={handleInputChange}
                    />
                    <div>
                      <div className="ap-checkbox-label">Variant Product</div>
                      <div className="ap-checkbox-desc">
                        This is a variation of a parent product
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tag */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div className="ap-card-icon">
                    <FaTag size={13} />
                  </div>
                  <div>
                    <p className="ap-card-title">Product Tag</p>
                    <p className="ap-card-subtitle">Highlight this product</p>
                  </div>
                </div>
                <div className="ap-card-body">
                  <div className="ap-field-group" style={{ margin: 0 }}>
                    <label className="ap-label">Tag</label>
                    <select
                      name="tag"
                      className="ap-select"
                      value={productForm.tag}
                      onChange={handleInputChange}
                    >
                      {AVAILABLE_TAGS.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Save button bottom */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="ap-btn-cancel"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: "#fff",
                    border: "1.5px solid #e2e8f0",
                    color: "#64748b",
                    borderRadius: 10,
                    padding: "12px",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowProductModal(false)}
                >
                  Discard
                </button>
                <button
                  className="ap-btn-save"
                  style={{ flex: 2, justifyContent: "center" }}
                  onClick={handleSaveProduct}
                >
                  <FaCheckCircle size={13} />
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    [
      showProductModal,
      editingProduct,
      productForm,
      imagePreview,
      handleInputChange,
      handleImageUrlChange,
      handleImageFileUpload,
      handleSaveProduct,
    ],
  );

  const DeleteModal = useMemo(
    () =>
      !showDeleteConfirm ? null : (
        <div
          className="product-modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <h3 style={{ color: "#dc2626" }}>Confirm Delete</h3>
              <button
                className="product-modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="product-modal-body">
              <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
                Are you sure you want to delete "
                <strong style={{ color: "#1e293b" }}>
                  {productToDelete?.name}
                </strong>
                "? This action cannot be undone.
              </p>
            </div>
            <div className="product-modal-footer">
              <button
                className="btn-outline-gold"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                style={{
                  background: "#dc2626",
                  border: "none",
                  color: "white",
                  padding: "10px 22px",
                  borderRadius: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ),
    [showDeleteConfirm, productToDelete, handleDeleteProduct],
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container sd-wrap">
      {toast && (
        <div
          className={`sd-toast ${toast.type === "error" ? "sd-toast-err" : "sd-toast-ok"}`}
        >
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
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
      <div className="container-fluid px-0">
        <div className="row g-0">
          <div className="col-md-3 col-lg-2 dashboard-sidebar">{Sidebar}</div>
          <div className="col-md-9 col-lg-10">
            <div className="sd-main">
              {activeTab === "overview" && OverviewTab}
              {activeTab === "products" && ProductsTab}
              {activeTab === "orders" && OrdersTab}
              {activeTab === "shipping" && ShippingTab}
              {activeTab === "returns" && ReturnsTab}
              {activeTab === "payments" && PaymentsTab}
              {activeTab === "reviews" && ReviewsTab}
              {activeTab === "analytics" && <AnalyticsTabComponent />}
            </div>
          </div>
        </div>
      </div>
      {SlideDrawer}
      {OrderDetailDrawer}
      {ProductModal}
      {DeleteModal}
    </div>
  );
};

export default SellerDashboard;

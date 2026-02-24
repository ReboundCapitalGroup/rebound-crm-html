// ===== REBOUND CAPITAL GROUP CRM — SHARED SUPABASE CLIENT =====
const SUPABASE_URL = 'https://fzievaswtkuguwyscngt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWV2YXN3dGt1Z3V3eXNjbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMDQ4MzcsImV4cCI6MjA1MTg4MDgzN30.zzIp7sgABKRTMB-ZWfMpPB4HbJoVF_bjZ-7u2TU4bFw';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Current user state
let CURRENT_USER = null;
let IS_ADMIN = false;

// Auth guard — call on every protected page
async function requireAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  CURRENT_USER = session.user;
  // Check users table for role
  const { data: userData } = await sb.from('users').select('role').eq('id', session.user.id).single();
  IS_ADMIN = userData?.role === 'admin';
  return session.user;
}

// Logout
async function logout() {
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

// Status badge helper
function statusBadge(status) {
  const map = {
    'New': 'bg-blue-500/20 text-blue-400',
    'Contacted': 'bg-amber-500/20 text-amber-400',
    'Interested': 'bg-emerald-500/20 text-emerald-400',
    'Not Interested': 'bg-slate-500/20 text-slate-400',
    'Dead': 'bg-red-500/20 text-red-400'
  };
  return `<span class="px-2 py-1 rounded text-xs font-semibold ${map[status]||''}">${status||'—'}</span>`;
}

// Toast helper
function showToast(type, title, msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: '💼' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]||'💼'}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove && toast.remove(), 4000);
}

// Format date/time
function fmtDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Escape HTML
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// User display name from email
function displayName(email) {
  if (!email) return 'Unknown';
  const prefix = email.split('@')[0];
  return prefix.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// User role label  
function userRole(email) {
  return IS_ADMIN ? 'Administrator' : 'Agent';
}

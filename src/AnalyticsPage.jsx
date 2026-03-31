import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function formatMs(ms) {
  if (!ms) return "—";
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = (mins / 60).toFixed(1);
  return `${hrs}h`;
}

/* ───────── Login ───────── */
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) { setLocked(false); return; }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/testusers/test-users/analytics-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setLocked(true);
        setCountdown(Math.ceil((data.retryInMs || 1800000) / 1000));
        setError(data.message);
        return;
      }
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
      onLogin(data.token, data.showUsers);
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={styles.loginWrapper}>
      <div style={styles.loginCard}>
        <img src="https://i.imgur.com/QJIoscZ.png" alt="The Inner Code" style={{ width: 140, marginBottom: 24 }} />
        <h2 style={styles.loginTitle}>Analytics</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} disabled={locked} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} disabled={locked} />
          {error && <p style={styles.error}>{error}</p>}
          {locked && countdown > 0 && (
            <p style={{ color: "#f90", fontSize: 13, margin: 0, textAlign: "center" }}>
              Retry in {formatCountdown(countdown)}
            </p>
          )}
          <button type="submit" disabled={loading || locked} style={{ ...styles.btn, opacity: locked ? 0.4 : 1 }}>
            {loading ? "..." : locked ? "Locked" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ───────── Stat Card ───────── */
function StatCard({ label, value, sub, highlight }) {
  return (
    <div style={styles.card}>
      <span style={{ ...styles.cardValue, color: highlight || "#fff" }}>{value}</span>
      <span style={styles.cardLabel}>{label}</span>
      {sub && <span style={styles.cardSub}>{sub}</span>}
    </div>
  );
}

/* ───────── Bar (horizontal) ───────── */
function HBar({ label, count, max, color = "#fff" }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color: "#888" }}>{count} ({pct}%)</span>
      </div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ───────── Users Table ───────── */
function UsersTable({ token, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDepth, setFilterDepth] = useState("all");
  const [filterLocale, setFilterLocale] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortCol, setSortCol] = useState("dateCreation");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/testusers/test-users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) { onLogout(); return; }
        const json = await res.json();
        setUsers(json.users || []);
      } catch { /* noop */ }
      setLoading(false);
    })();
  }, [token, onLogout]);

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const sortIcon = (col) => sortCol === col ? (sortAsc ? " ▲" : " ▼") : "";

  const filtered = users
    .filter(u => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [u.email, u.name, u.lastName, u.stopReason, u.unclear, u.ip, u.referrer]
          .some(v => (v || "").toLowerCase().includes(q));
        if (!hay) return false;
      }
      if (filterDepth !== "all" && u.depth !== filterDepth) return false;
      if (filterLocale !== "all" && u.locale !== filterLocale) return false;
      if (dateFrom && u.dateCreation && u.dateCreation.slice(0, 10) < dateFrom) return false;
      if (dateTo && u.dateCreation && u.dateCreation.slice(0, 10) > dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      let va = a[sortCol] ?? "", vb = b[sortCol] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

  const depthColors = { curiosity: "#60a5fa", commitment: "#f59e0b", transformation: "#10b981" };

  const parseDevice = (ua) => {
    if (!ua) return "—";
    const l = ua.toLowerCase();
    if (/iphone/.test(l)) return "iPhone";
    if (/ipad/.test(l)) return "iPad";
    if (/android/.test(l)) return "Android";
    if (/macintosh/.test(l)) return "Mac";
    if (/windows/.test(l)) return "Windows";
    if (/linux/.test(l)) return "Linux";
    return "Other";
  };

  if (loading) return <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Loading users...</p>;

  return (
    <div style={{ ...styles.section, marginTop: 16 }}>
      <h3 style={styles.sectionTitle}>All users ({filtered.length})</h3>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <input
          type="text" placeholder="Search email, name, IP..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.input, maxWidth: 260, padding: "8px 12px", fontSize: 13, background: "#0a0a0a" }}
        />
        <select value={filterDepth} onChange={(e) => setFilterDepth(e.target.value)} style={styles.select}>
          <option value="all">All depths</option>
          <option value="curiosity">Curiosity</option>
          <option value="commitment">Commitment</option>
          <option value="transformation">Transformation</option>
        </select>
        <select value={filterLocale} onChange={(e) => setFilterLocale(e.target.value)} style={styles.select}>
          <option value="all">All languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#666" }}>From</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={styles.dateInput} />
          <span style={{ fontSize: 12, color: "#666" }}>To</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={styles.dateInput} />
        </div>
        {(search || filterDepth !== "all" || filterLocale !== "all" || dateFrom || dateTo) && (
          <button
            onClick={() => { setSearch(""); setFilterDepth("all"); setFilterLocale("all"); setDateFrom(""); setDateTo(""); }}
            style={{ ...styles.btnSmall, fontSize: 11, padding: "6px 12px" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={styles.thClick} onClick={() => handleSort("email")}>Email{sortIcon("email")}</th>
              <th style={styles.thClick} onClick={() => handleSort("locale")}>Lang{sortIcon("locale")}</th>
              <th style={styles.thClick} onClick={() => handleSort("depth")}>Depth{sortIcon("depth")}</th>
              <th style={styles.th}>Device</th>
              <th style={styles.thClick} onClick={() => handleSort("dateCreation")}>Registered{sortIcon("dateCreation")}</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ ...styles.td, textAlign: "center", color: "#555", padding: 24 }}>No users match filters</td></tr>
            )}
            {filtered.map((u) => (
              <>
                <tr key={u.id} style={{ borderBottom: "1px solid #1a1a1a", cursor: "pointer" }} onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}>
                  <td style={styles.td}>{u.email}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 11, background: u.locale === "en" ? "#1e3a5f" : "#5f3a1e", color: "#fff" }}>
                      {(u.locale || "en").toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11,
                      background: depthColors[u.depth] || "#333", color: "#000", fontWeight: 600,
                    }}>
                      {u.depth}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: "#888" }}>{parseDevice(u.userAgent)}</td>
                  <td style={{ ...styles.td, color: "#888" }}>{u.dateCreation ? new Date(u.dateCreation).toLocaleDateString() : "—"}</td>
                  <td style={{ ...styles.td, color: "#555", fontSize: 11 }}>{expandedId === u.id ? "▲" : "▼"}</td>
                </tr>
                {expandedId === u.id && (
                  <tr key={`${u.id}-detail`} style={{ background: "#0a0a0a" }}>
                    <td colSpan={6} style={{ padding: "12px 16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontSize: 13 }}>
                        <div>
                          <span style={styles.detailLabel}>Full name</span>
                          <span style={styles.detailValue}>{[u.name, u.lastName].filter(Boolean).join(" ") || "—"}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>Email</span>
                          <span style={styles.detailValue}>{u.email}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>IP</span>
                          <span style={styles.detailValue}>{u.ip || "—"}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>Referrer</span>
                          <span style={styles.detailValue}>{u.referrer || "Direct"}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>User Agent</span>
                          <span style={{ ...styles.detailValue, fontSize: 11, wordBreak: "break-all" }}>{u.userAgent || "—"}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>Confirmed at</span>
                          <span style={styles.detailValue}>{u.confirmedAt ? new Date(u.confirmedAt).toLocaleString() : "—"}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>What made you stop scrolling?</span>
                          <span style={styles.detailValue}>{u.stopReason || "—"}</span>
                        </div>
                        <div>
                          <span style={styles.detailLabel}>What feels unclear?</span>
                          <span style={styles.detailValue}>{u.unclear || "—"}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Newsletter Log ───────── */
function NewsletterLog({ token, onLogout }) {
  const [campaigns, setCampaigns] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/testusers/test-users/newsletter-log`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) { onLogout(); return; }
        const json = await res.json();
        setCampaigns(json.campaigns || []);
      } catch { setCampaigns([]); }
    })();
  }, [token, onLogout]);

  if (!campaigns) return <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Loading...</p>;
  if (campaigns.length === 0) return <p style={{ color: "#555", textAlign: "center", padding: 40 }}>No campaigns sent yet.</p>;

  const editionColors = ["#E8973A", "#D4472B", "#2AADA8", "#7B52D4", "#3DB86A", "#E8973A", "#D4472B", "#2AADA8"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {campaigns.map((c, i) => {
        const color = editionColors[i % editionColors.length];
        const isOpen = expanded === c.name;
        return (
          <div key={c.name} style={{ background: "#111", borderRadius: 12, overflow: "hidden" }}>
            <div
              onClick={() => setExpanded(isOpen ? null : c.name)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{c.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: color, fontWeight: 700 }}>{c.sent} sent</span>
                <span style={{ fontSize: 11, color: "#555" }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>
            {isOpen && (
              <div style={{ borderTop: "1px solid #1a1a1a", padding: "12px 20px 16px" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
                  Recipients — {c.sent} emails
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.emails.map(email => (
                    <span key={email} style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 12,
                      background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a"
                    }}>
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────── Dashboard ───────── */
function Dashboard({ token, onLogout, showUsers }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [tab, setTab] = useState("overview");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/testusers/test-users/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { onLogout(); return; }
      const json = await res.json();
      if (!res.ok) { setError(json.message || "Error loading analytics"); return; }
      setData(json);
      setLastUpdated(new Date());
      setError("");
    } catch {
      setError("Connection error");
    }
  }, [token, onLogout]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>
        <button onClick={onLogout} style={styles.btnSmall}>Back to login</button>
      </div>
    );
  }

  if (!data) {
    return <div style={styles.center}><p style={{ color: "#888" }}>Loading...</p></div>;
  }

  const maxDepth = Math.max(...Object.values(data.depthCount || {}), 1);
  const maxDaily = Math.max(...(data.registrationsPerDay || []).map((d) => d.count), 1);
  const maxRef = data.topReferrers?.length ? data.topReferrers[0].count : 1;
  const depthColors = { curiosity: "#60a5fa", commitment: "#f59e0b", transformation: "#10b981" };
  const spotsPercent = ((300 - data.spotsRemaining) / 300 * 100).toFixed(0);

  return (
    <div style={styles.dashWrapper}>
      <header style={styles.header}>
        <img src="https://i.imgur.com/QJIoscZ.png" alt="Logo" style={{ width: 120 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: "#555" }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={load} style={styles.btnSmall}>Refresh</button>
          <button onClick={onLogout} style={{ ...styles.btnSmall, background: "transparent", border: "1px solid #333" }}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {(showUsers ? ["overview", "users", "newsletter"] : ["overview", "newsletter"]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            ...styles.btnSmall,
            background: tab === t ? "#fff" : "#222",
            color: tab === t ? "#000" : "#fff",
            fontWeight: tab === t ? 700 : 400,
            padding: "8px 20px",
          }}>
            {t === "overview" ? "Overview" : t === "users" ? "Users" : "Newsletter"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          {/* KPI cards */}
          <div style={styles.grid}>
            <StatCard label="Confirmed" value={data.totalConfirmed} highlight="#10b981" />
            <StatCard label="Pending" value={data.totalPending} highlight="#f59e0b" />
            <StatCard label="Expired" value={data.expiredPending || 0} highlight="#ef4444" />
            <StatCard label="Spots left" value={data.spotsRemaining} sub={`${spotsPercent}% filled`} />
            <StatCard label="Conversion" value={`${data.conversionRate}%`} />
            <StatCard label="Avg confirm" value={formatMs(data.avgConfirmTimeMs)} />
            <StatCard label="Today confirmed" value={data.registeredToday || 0} highlight="#60a5fa" />
            <StatCard label="Today pending" value={data.pendingToday || 0} highlight="#a78bfa" />
          </div>

          {/* Spots progress bar */}
          <div style={{ ...styles.section, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span>Capacity</span>
              <span style={{ color: "#888" }}>{300 - data.spotsRemaining} / 300</span>
            </div>
            <div style={{ ...styles.barTrack, height: 12 }}>
              <div style={{
                height: "100%", borderRadius: 4, transition: "width .3s",
                width: `${spotsPercent}%`,
                background: Number(spotsPercent) > 90 ? "#ef4444" : Number(spotsPercent) > 70 ? "#f59e0b" : "#10b981",
              }} />
            </div>
          </div>

          <div style={styles.grid2}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>By language</h3>
              <HBar label="English (EN)" count={data.localeCount?.en || 0} max={data.totalConfirmed || 1} color="#60a5fa" />
              <HBar label="Spanish (ES)" count={data.localeCount?.es || 0} max={data.totalConfirmed || 1} color="#f59e0b" />
            </div>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>By depth</h3>
              {Object.entries(data.depthCount || {}).map(([d, count]) => (
                <HBar key={d} label={d.charAt(0).toUpperCase() + d.slice(1)} count={count} max={maxDepth} color={depthColors[d] || "#fff"} />
              ))}
            </div>
          </div>

          <div style={styles.grid2}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Devices</h3>
              <HBar label="Mobile" count={data.deviceCount?.mobile || 0} max={data.totalConfirmed || 1} color="#a78bfa" />
              <HBar label="Desktop" count={data.deviceCount?.desktop || 0} max={data.totalConfirmed || 1} color="#60a5fa" />
              <HBar label="Other" count={data.deviceCount?.other || 0} max={data.totalConfirmed || 1} color="#666" />
            </div>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Top referrers</h3>
              {(data.topReferrers || []).length === 0 && <p style={{ color: "#555", fontSize: 13 }}>No data yet</p>}
              {(data.topReferrers || []).map((r) => (
                <HBar key={r.source} label={r.source} count={r.count} max={maxRef} color="#10b981" />
              ))}
            </div>
          </div>

          {data.registrationsPerDay?.length > 0 && (
            <div style={{ ...styles.section, marginBottom: 16 }}>
              <h3 style={styles.sectionTitle}>Registrations (last 30 days)</h3>
              <div style={styles.chartWrap}>
                {data.registrationsPerDay.map((d) => (
                  <div key={d.date} style={styles.chartCol}>
                    <span style={{ fontSize: 10, color: "#888" }}>{d.count}</span>
                    <div style={{
                      width: 24, background: "#10b981", borderRadius: 4,
                      height: `${Math.max((d.count / maxDaily) * 140, 4)}px`,
                    }} />
                    <span style={{ fontSize: 9, color: "#666", marginTop: 4 }}>{d.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "users" && showUsers && (
        <UsersTable token={token} onLogout={onLogout} />
      )}

      {tab === "newsletter" && (
        <NewsletterLog token={token} onLogout={onLogout} />
      )}
    </div>
  );
}

/* ───────── Main ───────── */
export default function AnalyticsPage() {
  const [token, setToken] = useState(() => {
    try { return sessionStorage.getItem("innera_token") || ""; } catch { return ""; }
  });
  const [showUsers, setShowUsers] = useState(() => {
    try { return sessionStorage.getItem("innera_su") === "1"; } catch { return false; }
  });

  const handleLogin = (t, canShowUsers) => {
    setToken(t);
    setShowUsers(!!canShowUsers);
    try {
      sessionStorage.setItem("innera_token", t);
      sessionStorage.setItem("innera_su", canShowUsers ? "1" : "0");
    } catch { /* noop */ }
  };

  const handleLogout = () => {
    setToken("");
    setShowUsers(false);
    try { sessionStorage.removeItem("innera_token"); sessionStorage.removeItem("innera_su"); } catch { /* noop */ }
  };

  if (!token) return <LoginForm onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} showUsers={showUsers} />;
}

/* ───────── Styles ───────── */
const styles = {
  loginWrapper: {
    minHeight: "100vh", background: "#000",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  },
  loginCard: {
    background: "#111", borderRadius: 16, padding: "40px 32px",
    width: "100%", maxWidth: 380,
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  loginTitle: {
    color: "#fff", fontSize: 20, fontWeight: 600, margin: "0 0 20px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  form: { width: "100%", display: "flex", flexDirection: "column", gap: 12 },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1px solid #333", background: "#0a0a0a", color: "#fff",
    fontSize: 15, fontFamily: "Arial, Helvetica, sans-serif",
    outline: "none", boxSizing: "border-box",
  },
  btn: {
    padding: "12px 0", borderRadius: 10, border: "none",
    background: "#fff", color: "#000", fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "Arial, Helvetica, sans-serif",
  },
  btnSmall: {
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: "#222", color: "#fff", fontSize: 13, cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  error: { color: "#f44", fontSize: 13, margin: 0, textAlign: "center" },
  center: {
    minHeight: "100vh", background: "#000",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
  },
  dashWrapper: {
    minHeight: "100vh", background: "#000", color: "#fff",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "24px 20px", maxWidth: 960, margin: "0 auto",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32,
    flexWrap: "wrap", gap: 12,
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12, marginBottom: 16,
  },
  grid2: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16, marginBottom: 16,
  },
  card: {
    background: "#111", borderRadius: 12, padding: "20px 16px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
  },
  cardValue: { fontSize: 28, fontWeight: 700 },
  cardLabel: { fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 },
  cardSub: { fontSize: 11, color: "#555" },
  section: { background: "#111", borderRadius: 12, padding: "20px 20px", marginBottom: 0 },
  sectionTitle: { margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#aaa" },
  barTrack: { height: 8, background: "#222", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4, transition: "width .3s" },
  chartWrap: { display: "flex", alignItems: "flex-end", gap: 6, overflowX: "auto", paddingBottom: 4 },
  chartCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  th: { textAlign: "left", padding: "8px 8px", color: "#666", fontWeight: 500 },
  thClick: { textAlign: "left", padding: "8px 8px", color: "#666", fontWeight: 500, cursor: "pointer", userSelect: "none" },
  td: { padding: "8px 8px", color: "#ccc" },
  select: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #333",
    background: "#0a0a0a", color: "#fff", fontSize: 13,
    fontFamily: "Arial, Helvetica, sans-serif", outline: "none",
  },
  dateInput: {
    padding: "6px 10px", borderRadius: 8, border: "1px solid #333",
    background: "#0a0a0a", color: "#fff", fontSize: 12,
    fontFamily: "Arial, Helvetica, sans-serif", outline: "none",
    colorScheme: "dark",
  },
  detailLabel: { display: "block", fontSize: 11, color: "#666", marginBottom: 2 },
  detailValue: { display: "block", color: "#ccc" },
};

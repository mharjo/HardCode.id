import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div style={{ padding: "4rem 0", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ color: "var(--ink-dim)", marginBottom: "1.5rem" }}>Halaman tidak ditemukan.</p>
      <Link to="/">← Kembali ke beranda</Link>
    </div>
  );
}

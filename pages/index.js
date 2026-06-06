// pages/index.js
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import prisma from "../lib/prisma";
import NoticeCard from "../components/NoticeCard";
import styles from "../styles/Home.module.css";

const CATEGORIES = ["All", "Exam", "Event", "General"];

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`skeleton ${styles.skRow}`} style={{ width: "40%" }} />
      <div className={`skeleton ${styles.skTitle}`} />
      <div className={`skeleton ${styles.skBody1}`} />
      <div className={`skeleton ${styles.skBody2}`} />
      <div className={`skeleton ${styles.skBody3}`} />
    </div>
  );
}

export default function Home({ initialNotices }) {
  const [notices, setNotices]     = useState(initialNotices);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [loading, setLoading]     = useState(true);
  const [dark, setDark]           = useState(false);

  // Simulate brief loading skeleton on mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleDeleted = (id) => setNotices((prev) => prev.filter((n) => n.id !== id));

  // Category counts
  const counts = useMemo(() => {
    const c = { All: notices.length, Exam: 0, Event: 0, General: 0 };
    notices.forEach((n) => { if (c[n.category] !== undefined) c[n.category]++; });
    return c;
  }, [notices]);

  // Filtered notices
  const filtered = useMemo(() => {
    return notices.filter((n) => {
      const matchCat = category === "All" || n.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [notices, search, category]);

  const urgentCount = filtered.filter((n) => n.priority === "Urgent").length;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logo}>📌</div>
            <div className={styles.brandText}>
              <h1 className={styles.title}>Amity Notice Board</h1>
              <p className={styles.subtitle}>Amity University Lucknow · Official Notices</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.darkToggle} onClick={() => setDark(!dark)}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <Link href="/notices/new" className={styles.addBtn}>
              + Add Notice
            </Link>
          </div>
        </div>
      </header>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarInner}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search notices…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterBtns}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${category === cat ? styles.active : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
                <span className={styles.badge}>{counts[cat] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        <span>Showing {filtered.length} of {notices.length} notices</span>
        {urgentCount > 0 && (
          <span className={styles.urgentCount}>· {urgentCount} urgent</span>
        )}
      </div>

      {/* ── Main ── */}
      <main className={styles.main}>
        {loading ? (
          <div className={styles.grid}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>{search || category !== "All" ? "🔍" : "📭"}</div>
            <h2 className={styles.emptyTitle}>
              {search || category !== "All" ? "No matching notices" : "No notices yet"}
            </h2>
            <p className={styles.emptyText}>
              {search || category !== "All"
                ? "Try adjusting your search or filter."
                : "Get started by adding the first notice."}
            </p>
            {!search && category === "All" && (
              <Link href="/notices/new" className={styles.emptyBtn}>Add First Notice</Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const allNotices = await prisma.notice.findMany({
    orderBy: [
      { priority: "asc" },
      { publishDate: "desc" },
    ],
  });

  const notices = allNotices.map((n) => ({
    ...n,
    publishDate: n.publishDate.toISOString(),
    createdAt:   n.createdAt.toISOString(),
    updatedAt:   n.updatedAt.toISOString(),
  }));

  return { props: { initialNotices: notices } };
}

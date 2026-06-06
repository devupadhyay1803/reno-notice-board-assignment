// pages/notices/[id]/index.js  — Notice detail page
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import prisma from "../../../lib/prisma";
import styles from "../../../styles/NoticeDetail.module.css";
import { useToast } from "../../../components/Toast";

const CATEGORY_COLORS = {
  Exam:    { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  Event:   { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" },
  General: { bg: "#F0FDF4", text: "#166534", border: "#22C55E" },
};

export default function NoticeDetailPage({ notice }) {
  const router = useRouter();
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const catStyle = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS.General;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Notice deleted", "success");
        router.push("/");
      } else {
        toast("Delete failed", "error");
        setDeleting(false);
        setShowConfirm(false);
      }
    } catch {
      toast("Network error", "error");
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const postedAt = new Date(notice.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back */}
        <Link href="/" className={styles.back}>← Back to Notice Board</Link>

        <article className={`${styles.card} ${notice.priority === "Urgent" ? styles.urgent : ""}`}>
          {notice.priority === "Urgent" && (
            <div className={styles.urgentBanner}>🔴 URGENT NOTICE</div>
          )}

          {notice.imageUrl && (
            <div className={styles.imageWrapper}>
              <img src={notice.imageUrl} alt={notice.title} className={styles.image} />
            </div>
          )}

          <div className={styles.meta}>
            <span
              className={styles.catBadge}
              style={{ background: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
            >
              {notice.category}
            </span>
            <span className={styles.date}>📅 {formattedDate}</span>
          </div>

          <h1 className={styles.title}>{notice.title}</h1>

          <div className={styles.divider} />

          <p className={styles.body}>{notice.body}</p>

          <div className={styles.footer}>
            <span className={styles.posted}>Posted on {postedAt}</span>
            <div className={styles.actions}>
              <Link href={`/notices/${notice.id}/edit`} className={styles.editBtn}>
                ✏️ Edit
              </Link>
              <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        </article>
      </div>

      {showConfirm && (
        <div className={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <p className={styles.confirmTitle}>Delete Notice?</p>
            <p className={styles.confirmText}>
              Delete <strong>"{notice.title}"</strong>? This cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)} disabled={deleting}>Cancel</button>
              <button className={styles.confirmDeleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt:   notice.createdAt.toISOString(),
        updatedAt:   notice.updatedAt.toISOString(),
      },
    },
  };
}

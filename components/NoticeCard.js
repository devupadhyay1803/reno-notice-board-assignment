// components/NoticeCard.js
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/NoticeCard.module.css";
import { useToast } from "./Toast";

const CATEGORY_COLORS = {
  Exam:    { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  Event:   { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" },
  General: { bg: "#F0FDF4", text: "#166534", border: "#22C55E" },
};

export default function NoticeCard({ notice, onDeleted }) {
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
        toast("Notice deleted successfully", "success");
        onDeleted(notice.id);
      } else {
        toast("Failed to delete. Please try again.", "error");
      }
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`${styles.card} ${notice.priority === "Urgent" ? styles.urgent : ""}`}>
      {notice.priority === "Urgent" && (
        <span className={styles.urgentBadge}>🔴 Urgent</span>
      )}

      {notice.imageUrl && (
        <div className={styles.imageWrapper}>
          <img src={notice.imageUrl} alt={notice.title} className={styles.image} />
        </div>
      )}

      <div className={styles.header}>
        <span
          className={styles.categoryBadge}
          style={{ background: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
        >
          {notice.category}
        </span>
        <span className={styles.date}>📅 {formattedDate}</span>
      </div>

      <h2 className={styles.title}>{notice.title}</h2>
      <p className={styles.body}>{notice.body}</p>

      <Link href={`/notices/${notice.id}`} className={styles.readMore}>
        Read more →
      </Link>

      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={(e) => { e.stopPropagation(); router.push(`/notices/${notice.id}/edit`); }}
        >
          ✏️ Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
        >
          🗑️ Delete
        </button>
      </div>

      {showConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <p className={styles.confirmTitle}>Delete Notice?</p>
            <p className={styles.confirmText}>
              Are you sure you want to delete <strong>"{notice.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)} disabled={deleting}>
                Cancel
              </button>
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

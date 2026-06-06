// components/NoticeForm.js
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/NoticeForm.module.css";
import { useToast } from "./Toast";

const toInputDate = (dateStr) => {
  if (!dateStr) return "";
  try { return new Date(dateStr).toISOString().split("T")[0]; }
  catch { return ""; }
};

export default function NoticeForm({ notice }) {
  const router = useRouter();
  const toast  = useToast();
  const isEdit = Boolean(notice);

  const [form, setForm] = useState({
    title:       notice?.title       ?? "",
    body:        notice?.body        ?? "",
    category:    notice?.category    ?? "General",
    priority:    notice?.priority    ?? "Normal",
    publishDate: toInputDate(notice?.publishDate),
    imageUrl:    notice?.imageUrl    ?? "",
  });

  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const url    = isEdit ? `/api/notices/${notice.id}` : "/api/notices";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 422) {
        setErrors(data.errors || {});
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        toast(data.error || "Something went wrong. Please try again.", "error");
        setSubmitting(false);
        return;
      }

      toast(isEdit ? "Notice updated successfully!" : "Notice created successfully!", "success");
      router.push("/");
    } catch {
      toast("Network error. Please try again.", "error");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.headingRow}>
        <div className={styles.headingIcon}>{isEdit ? "✏️" : "📋"}</div>
        <h1 className={styles.heading}>{isEdit ? "Edit Notice" : "Add New Notice"}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Title */}
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            id="title" name="title" type="text"
            value={form.title} onChange={handleChange}
            className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            placeholder="e.g. Mid-semester Examination Schedule"
            maxLength={255}
          />
          {errors.title && <p className={styles.errorMsg}>{errors.title}</p>}
        </div>

        {/* Body */}
        <div className={styles.field}>
          <label htmlFor="body" className={styles.label}>
            Body <span className={styles.required}>*</span>
          </label>
          <textarea
            id="body" name="body"
            value={form.body} onChange={handleChange}
            className={`${styles.textarea} ${errors.body ? styles.inputError : ""}`}
            placeholder="Write the full notice content here…"
            rows={5}
          />
          {errors.body && <p className={styles.errorMsg}>{errors.body}</p>}
        </div>

        {/* Category & Priority */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}
              className={`${styles.select} ${errors.category ? styles.inputError : ""}`}>
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
            {errors.category && <p className={styles.errorMsg}>{errors.category}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="priority" className={styles.label}>Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange}
              className={`${styles.select} ${errors.priority ? styles.inputError : ""}`}>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            {errors.priority && <p className={styles.errorMsg}>{errors.priority}</p>}
          </div>
        </div>

        {/* Publish Date */}
        <div className={styles.field}>
          <label htmlFor="publishDate" className={styles.label}>
            Publish Date <span className={styles.required}>*</span>
          </label>
          <input
            id="publishDate" name="publishDate" type="date"
            value={form.publishDate} onChange={handleChange}
            className={`${styles.input} ${errors.publishDate ? styles.inputError : ""}`}
          />
          {errors.publishDate && <p className={styles.errorMsg}>{errors.publishDate}</p>}
        </div>

        {/* Image URL */}
        <div className={styles.field}>
          <label htmlFor="imageUrl" className={styles.label}>
            Image URL <span className={styles.optional}>(optional)</span>
          </label>
          <input
            id="imageUrl" name="imageUrl" type="url"
            value={form.imageUrl} onChange={handleChange}
            className={styles.input}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Actions */}
        <div className={styles.formActions}>
          <button type="button" className={styles.cancelBtn}
            onClick={() => router.push("/")} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting
              ? (isEdit ? "Saving…" : "Creating…")
              : (isEdit ? "Save Changes" : "Create Notice")}
          </button>
        </div>
      </form>
    </div>
  );
}

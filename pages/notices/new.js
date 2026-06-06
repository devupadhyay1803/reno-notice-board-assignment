// pages/notices/new.js
import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";
import styles from "../../styles/FormPage.module.css";

export default function NewNoticePage() {
  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <Link href="/" className={styles.back}>← Back to Notice Board</Link>
      </div>
      <NoticeForm />
    </div>
  );
}

// pages/notices/[id]/edit.js
import Link from "next/link";
import prisma from "../../../lib/prisma";
import NoticeForm from "../../../components/NoticeForm";
import styles from "../../../styles/FormPage.module.css";

export default function EditNoticePage({ notice }) {
  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <Link href="/" className={styles.back}>← Back to Notice Board</Link>
      </div>
      <NoticeForm notice={notice} />
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

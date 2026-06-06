// pages/api/notices/index.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Prisma enum string ordering: "Normal" > "Urgent" alphabetically,
      // so ascending order puts Urgent first — exactly what the spec requires.
      // This ordering is executed in the database query, not in the browser.
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "asc" },   // "Urgent" < "Normal" alphabetically → Urgent rows first
          { publishDate: "desc" }, // within each priority group, newest first
        ],
      });

      return res.status(200).json(notices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // Server-side validation
    const errors = {};
    if (!title || title.trim() === "") errors.title = "Title is required";
    if (!body || body.trim() === "") errors.body = "Body is required";
    if (!category || !["Exam", "Event", "General"].includes(category))
      errors.category = "Category must be Exam, Event, or General";
    if (!priority || !["Normal", "Urgent"].includes(priority))
      errors.priority = "Priority must be Normal or Urgent";
    if (!publishDate || isNaN(new Date(publishDate).getTime()))
      errors.publishDate = "A valid publish date is required";

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl.trim() : null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}

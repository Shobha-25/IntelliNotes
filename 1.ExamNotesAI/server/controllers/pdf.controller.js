import PDFDocument from "pdfkit"

const writeList = (doc, items) => {
  items.forEach((item) => {
    doc.fontSize(12).text(`- ${item}`)
  })
}

export const pdfDownload = async (req, res) => {
  const { result } = req.body

  if (!result) {
    return res.status(400).json({ error: "No content provided" })
  }

  const subTopics = result.subTopics || {}
  const revisionPoints = Array.isArray(result.revisionPoints) ? result.revisionPoints : []
  const questions = result.questions || {}
  const shortQuestions = Array.isArray(questions.short) ? questions.short : []
  const longQuestions = Array.isArray(questions.long) ? questions.long : []
  const notesText = String(result.notes || "").replace(/[#*`]/g, "")

  const doc = new PDFDocument({ margin: 50 })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", 'attachment; filename="ExamNotesAI.pdf"')

  doc.pipe(res)

  doc.fontSize(20).text("ExamNotes AI", { align: "center" })
  doc.moveDown()
  doc.fontSize(14).text(`Importance: ${result.importance || "Not specified"}`)
  doc.moveDown()

  doc.fontSize(16).text("Sub Topics")
  doc.moveDown(0.5)
  Object.entries(subTopics).forEach(([star, topics]) => {
    doc.moveDown(0.5)
    doc.fontSize(13).text(`${star} Topics:`)
    writeList(doc, Array.isArray(topics) ? topics : [])
  })

  doc.moveDown()
  doc.fontSize(16).text("Notes")
  doc.moveDown(0.5)
  doc.fontSize(12).text(notesText || "No notes available.")

  doc.moveDown()
  doc.fontSize(16).text("Revision Points")
  doc.moveDown(0.5)
  writeList(doc, revisionPoints)

  doc.moveDown()
  doc.fontSize(16).text("Important Questions")
  doc.moveDown(0.5)

  doc.fontSize(13).text("Short Questions:")
  writeList(doc, shortQuestions)

  doc.moveDown(0.5)
  doc.fontSize(13).text("Long Questions:")
  writeList(doc, longQuestions)

  doc.moveDown(0.5)
  doc.fontSize(13).text("Diagram Question:")
  doc.fontSize(12).text(questions.diagram || "No diagram question available.")

  doc.end()
}

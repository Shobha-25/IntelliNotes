import Notes from "../models/notes.model.js";
import UserModel from "../models/user.model.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import { buildPrompt } from "../utils/promptBuilder.js";

const cleanRevisionText = (value) =>
    String(value || "")
        .replace(/^#{1,6}\s*/, "")
        .replace(/^[-*]\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\*\*/g, "")
        .trim();

const buildRevisionPoints = (response) => {
    if (Array.isArray(response.revisionPoints) && response.revisionPoints.length > 0) {
        return response.revisionPoints.map(cleanRevisionText).filter(Boolean);
    }

    const fromNotes = String(response.notes || "")
        .split("\n")
        .map(cleanRevisionText)
        .filter((point) => point.length > 12)
        .slice(0, 10);

    if (fromNotes.length > 0) return fromNotes;

    const subTopics = response.subTopics || {};
    return Object.values(subTopics)
        .flat()
        .filter((topic) => typeof topic === "string" && topic.trim())
        .map((topic) => `Revise ${topic.trim()}`)
        .slice(0, 10);
};

const ensureDiagramQuestion = (response, topic) => {
    const questions = response.questions || {};
    const diagramQuestion = Array.isArray(questions.diagram)
        ? questions.diagram.filter(Boolean).join(" ").trim()
        : String(questions.diagram || "").trim();

    if (diagramQuestion) return diagramQuestion;

    return `Draw and explain a neat labelled diagram or flowchart for ${topic}.`;
};

const sanitizeLabel = (value) =>
    String(value || "")
        .replace(/["`]/g, "")
        .replace(/[{}()[\]|<>]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 36);

const getTopicLabels = (response, topic) => {
    const subTopics = response.subTopics || {};
    const labels = Object.values(subTopics)
        .flat()
        .filter((value) => typeof value === "string" && value.trim())
        .map(sanitizeLabel)
        .filter(Boolean)
        .slice(0, 4);

    if (labels.length > 0) return labels;

    const revisionLabels = (response.revisionPoints || [])
        .map(sanitizeLabel)
        .filter(Boolean)
        .slice(0, 4);

    if (revisionLabels.length > 0) return revisionLabels;

    return ["Definition", "Key points", "Examples", "Exam use"];
};

const buildFallbackDiagram = (response, topic) => {
    const root = sanitizeLabel(topic) || "Topic";
    const labels = getTopicLabels(response, topic);
    const lines = [`graph TD`, `A["${root}"]`];

    labels.forEach((label, index) => {
        lines.push(`A --> N${index + 1}["${label}"]`);
    });

    return lines.join("\n");
};

const buildFallbackChart = (response, topic) => {
    const labels = getTopicLabels(response, topic);

    return {
        type: "bar",
        title: `${sanitizeLabel(topic) || "Topic"} exam focus`,
        data: labels.map((label, index) => ({
            name: label,
            value: Math.max(20, 90 - index * 12)
        }))
    };
};

const normalizeVisuals = (response, { topic, includeDiagram, includeChart }) => {
    response.diagram = response.diagram && typeof response.diagram === "object"
        ? response.diagram
        : { type: "flowchart", data: "" };

    response.diagram.type = response.diagram.type || "flowchart";
    response.diagram.data = includeDiagram
        ? String(response.diagram.data || "").trim() || buildFallbackDiagram(response, topic)
        : "";

    response.charts = Array.isArray(response.charts) ? response.charts : [];
    response.charts = response.charts
        .filter((chart) => chart && typeof chart === "object")
        .map((chart) => ({
            type: ["bar", "line", "pie"].includes(chart.type) ? chart.type : "bar",
            title: String(chart.title || `${topic} chart`).trim(),
            data: Array.isArray(chart.data)
                ? chart.data
                    .map((item) => ({
                        name: sanitizeLabel(item?.name),
                        value: Number(item?.value)
                    }))
                    .filter((item) => item.name && Number.isFinite(item.value))
                : []
        }))
        .filter((chart) => chart.data.length > 0);

    if (includeChart && response.charts.length === 0) {
        response.charts = [buildFallbackChart(response, topic)];
    }

    if (!includeChart) {
        response.charts = [];
    }
};

export const generateNotes = async (req, res) => {
    try {
        const{
            topic,
            classLevel,
            examType,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required" })
        }
        const user = await UserModel.findById(req.userId)
         if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }

        if (user.credits < 10) {
            user.isCreditAvailable = false
            await user.save()
            return res.status(403).json({
                message: "Insufficient credits"
            });
        }

        const prompt = buildPrompt({
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        })


        const aiResponse = await generateGeminiResponse(prompt)
        let parsedResponse = aiResponse

        try {
            parsedResponse = JSON.parse(aiResponse)
        } catch {
            parsedResponse = {
                notes: aiResponse,
                subTopics: {
                    veryImportant: [],
                    important: [],
                    frequentlyAsked: []
                },
                revisionPoints: [],
                questions: {
                    short: [],
                    long: [],
                    diagram: ""
                },
                diagram: {
                    type: "flowchart",
                    data: ""
                },
                charts: []
            }
        }

        parsedResponse.revisionPoints = buildRevisionPoints(parsedResponse);
        parsedResponse.questions = parsedResponse.questions || {};
        parsedResponse.questions.diagram = ensureDiagramQuestion(parsedResponse, topic);
        normalizeVisuals(parsedResponse, { topic, includeDiagram, includeChart });


        const notes = await Notes.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: parsedResponse


        })


        user.credits -= 10;
        if (user.credits <= 0) user.isCreditAvailable = false;

        if (!Array.isArray(user.notes)) {
            user.notes = [];
        }

        user.notes.push(notes._id);

        await user.save();

        return res.status(200).json({
            data: parsedResponse,
      noteId: notes._id,
      creditsLeft: user.credits
        })




    } catch (error) {
        console.error(error);
    res.status(error.statusCode || 500).json({
          error: "AI generation failed",
          message: error.message
        })

    }
}

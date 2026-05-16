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

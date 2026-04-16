import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, NoObjectGeneratedError } from "ai";
import { NextResponse } from "next/server";

import { generatedQuizSchema, questionSchema } from "@/lib/quiz-schema";

const MIN_NOTES_LENGTH = 20;

function normalizeQuestions(rawQuestions: unknown[]) {
	const questions = rawQuestions.map((question, index) => {
		if (!question || typeof question !== "object") {
			throw new Error(`Question ${index + 1} is not a valid object`);
		}

		const parsed = questionSchema.parse({
			...question,
			id: index + 1,
		});

		if (
			parsed.type === "single" &&
			!parsed.options.includes(parsed.correctAnswer)
		) {
			throw new Error(`Question ${index + 1} has an invalid correct answer`);
		}

		if (
			parsed.type === "multiple" &&
			parsed.correctAnswer.some((answer) => !parsed.options.includes(answer))
		) {
			throw new Error(`Question ${index + 1} has invalid correct answers`);
		}

		return parsed;
	});

	if (questions.length === 0) {
		throw new Error("No questions were generated");
	}

	return questions;
}

export async function POST(request: Request) {
	const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

	if (!gatewayApiKey) {
		return NextResponse.json(
			{ error: "Missing AI_GATEWAY_API_KEY on the server." },
			{ status: 500 },
		);
	}

	let notes = "";

	try {
		const body = await request.json();
		notes = typeof body.notes === "string" ? body.notes.trim() : "";
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body." },
			{ status: 400 },
		);
	}

	if (notes.length < MIN_NOTES_LENGTH) {
		return NextResponse.json(
			{ error: `Notes must be at least ${MIN_NOTES_LENGTH} characters long.` },
			{ status: 400 },
		);
	}

	try {
		const openai = createOpenAI({
			apiKey: gatewayApiKey,
			baseURL: "https://ai-gateway.vercel.sh/v1",
		});

		const { object } = await generateObject({
			model: openai("openai/gpt-5.3-chat", { structuredOutputs: true }),
			schema: generatedQuizSchema,
			schemaName: "Quiz",
			schemaDescription: "A note-grounded quiz with answer keys.",
			prompt: [
				"Generate a quiz based only on the notes below.",
				"Prefer mostly multiple-choice questions.",
				"Return 5 questions total.",
				"Use a mix of single-select and multi-select questions, with at most one short text question if it is strongly grounded in the notes.",
				"Every question must include the correctAnswer value.",
				"For single questions, the correct answer must exactly match one item in options.",
				"For multiple questions, every correct answer must exactly match items in options.",
				"For text questions, keep the correct answer short and canonical.",
				"Do not use outside knowledge or infer facts that are not explicitly present in the notes.",
				"\nNotes:\n",
				notes,
			].join("\n"),
		});

		const questions = normalizeQuestions(object.questions);

		return NextResponse.json({ questions });
	} catch (error) {
		if (NoObjectGeneratedError.isInstance(error)) {
			return NextResponse.json(
				{ error: "The AI response could not be turned into a valid quiz." },
				{ status: 502 },
			);
		}

		const message =
			error instanceof Error ? error.message : "Quiz generation failed.";

		return NextResponse.json({ error: message }, { status: 502 });
	}
}

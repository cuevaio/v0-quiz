import { z } from "zod"

const singleQuestionSchema = z.object({
  id: z.number().int().positive(),
  type: z.literal("single"),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
})

const multipleQuestionSchema = z.object({
  id: z.number().int().positive(),
  type: z.literal("multiple"),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.array(z.string().min(1)).min(1),
})

const textQuestionSchema = z.object({
  id: z.number().int().positive(),
  type: z.literal("text"),
  question: z.string().min(1),
  correctAnswer: z.string().min(1),
})

export const questionSchema = z.discriminatedUnion("type", [
  singleQuestionSchema,
  multipleQuestionSchema,
  textQuestionSchema,
])

export const generatedQuestionSchema = z.discriminatedUnion("type", [
  singleQuestionSchema.omit({ id: true }),
  multipleQuestionSchema.omit({ id: true }),
  textQuestionSchema.omit({ id: true }),
])

export const generatedQuizSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1),
})

export type Question = z.infer<typeof questionSchema>
export type GeneratedQuiz = z.infer<typeof generatedQuizSchema>
export type QuizAnswers = Record<number, string | string[]>

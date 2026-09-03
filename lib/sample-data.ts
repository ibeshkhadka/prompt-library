import type { Category, Prompt } from "@/lib/types";

export const sampleCategories: Category[] = [
  { id: "writing", name: "Writing", slug: "writing", color: "#ff9e9e" },
  { id: "business", name: "Business", slug: "business", color: "#aeb7ff" },
  { id: "creative", name: "Creative", slug: "creative", color: "#ffd95a" },
  { id: "visual", name: "Image Studio", slug: "image-studio", color: "#6ee7c1" },
  { id: "code", name: "Code", slug: "code", color: "#b7e0ff" },
  { id: "growth", name: "Growth", slug: "growth", color: "#d7b5ff" },
  { id: "career", name: "Career", slug: "career", color: "#ffc4df" }
];
const date = "2026-08-28T10:00:00.000Z";
const prompt = (id: string, title: string, category: string, description: string, tools: string[], tags: string[], type: "text" | "image" = "text", content?: string): Prompt => ({
  id, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), short_description: description, category: sampleCategories.find((c) => c.id === category) ?? null, tags, prompt_type: type, tools, is_featured: ["1", "3", "8"].includes(id), is_new: Number(id) <= 5, is_public: true, is_archived: false, updated_at: date, created_at: date,
  content: content ?? `You are an expert collaborator. Help me create a clear, specific, useful result for the following brief.\n\nGoal: [DESCRIBE THE OUTCOME]\nAudience: [WHO THIS IS FOR]\nContext: [KEY BACKGROUND]\nConstraints: [TONE, LENGTH, REQUIREMENTS]\n\nFirst ask up to three questions only if essential. Then provide a structured response with practical next steps.`
});
export const samplePrompts: Prompt[] = [
  prompt("1", "The crisp first draft", "writing", "Turn a loose idea into a confident draft with a voice people want to finish.", ["ChatGPT", "Claude"], ["writing", "drafting", "voice"]),
  prompt("2", "Weekly signal scan", "business", "Turn scattered updates into a focused weekly leadership brief.", ["ChatGPT", "Gemini"], ["strategy", "leadership", "briefing"]),
  prompt("3", "Brand personality workshop", "growth", "Find a memorable verbal identity before you write the tagline.", ["ChatGPT", "Claude"], ["brand", "positioning", "voice"]),
  prompt("4", "Scene from a feeling", "visual", "Translate a mood into an art-directed image-generation brief.", ["Midjourney", "DALL·E"], ["cinematic", "art direction", "mood"], "image", "Create a [ASPECT RATIO] cinematic image inspired by [FEELING]. Subject: [SUBJECT]. Location: [SETTING]. Light: [LIGHTING]. Materials and detail: [TEXTURES]. Composition: [CAMERA + FRAMING]. Avoid text, logos, watermarks, and oversaturated colors."),
  prompt("5", "Debugging detective", "code", "Get from mysterious error to smallest safe fix without the guesswork.", ["ChatGPT", "Cursor"], ["debugging", "engineering", "typescript"]),
  prompt("6", "Lesson that sticks", "writing", "Build a lesson plan around recall, practice, and a satisfying aha moment.", ["ChatGPT", "Claude"], ["learning", "teaching", "curriculum"]),
  prompt("7", "Career story builder", "business", "Shape scattered accomplishments into a sharp, human interview narrative.", ["ChatGPT"], ["career", "interview", "storytelling"]),
  prompt("8", "Animated micro-world", "visual", "Design a looping animated moment with purposeful movement and charm.", ["Runway", "Pika"], ["animation", "motion", "loop"], "image"),
  prompt("9", "Social series architect", "growth", "Plan a month of posts that compound into a recognizable point of view.", ["ChatGPT", "Claude"], ["social", "content", "calendar"]),
  prompt("10", "Friendly explainer", "writing", "Explain a difficult idea without flattening the interesting parts.", ["ChatGPT", "Gemini"], ["explainer", "education", "clarity"]),
  prompt("11", "Customer interview guide", "business", "Write questions that reveal behavior rather than invite polite opinions.", ["ChatGPT"], ["research", "customers", "product"]),
  prompt("12", "Illustration recipe", "visual", "Art direct a distinct editorial illustration from a simple seed idea.", ["Midjourney", "Adobe Firefly"], ["illustration", "editorial", "style"], "image"),
  prompt("13", "Naming playground", "creative", "Generate names with a point of view, then pressure-test the best ones.", ["ChatGPT", "Claude"], ["naming", "creative", "brand"]),
  prompt("14", "Refactor map", "code", "Plan a safe refactor that improves the code and protects its behavior.", ["Cursor", "ChatGPT"], ["refactoring", "code review", "architecture"]),
  prompt("15", "Focus reset", "business", "Choose the next important move when every task feels equally urgent.", ["ChatGPT"], ["productivity", "planning", "priorities"]),
  prompt("16", "Short film treatment", "creative", "Develop a cinematic premise into a visually coherent short-film treatment.", ["ChatGPT", "Claude"], ["film", "cinematic", "story"]),
  prompt("17", "Launch message maker", "growth", "Write a launch message that earns attention without shouting.", ["ChatGPT", "Claude"], ["launch", "marketing", "copywriting"]),
  prompt("18", "Code review companion", "code", "Review a change for risk, clarity, accessibility, and maintainability.", ["ChatGPT", "Cursor"], ["review", "quality", "accessibility"]),
  prompt("19", "Creative constraint generator", "creative", "Find a constraint that makes a blank page feel wonderfully smaller.", ["ChatGPT"], ["creativity", "ideation", "practice"]),
  prompt("20", "Portfolio polish", "career", "Give a portfolio case study a clearer story, evidence, and ending.", ["ChatGPT", "Claude"], ["portfolio", "career", "design"])
];

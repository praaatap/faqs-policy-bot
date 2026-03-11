import { NextResponse } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API key missing on server" }, { status: 500 });
        }

        const { question, session_id, company_id, subject } = await req.json();

        if (!question || !company_id || !subject) {
            return NextResponse.json({ error: "Missing required fields: question, company_id, subject" }, { status: 400 });
        }

        const collectionName = `${company_id}-${subject}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();

        const vectorStore = new Chroma(new OpenAIEmbeddings(), {
            collectionName,
            url: process.env.CHROMA_URL || "http://localhost:8000",
        });

        const retriever = vectorStore.asRetriever({ k: 4 });

        // 1. Retrieve documents directly
        const docs = await retriever.invoke(question);

        // 2. Format context
        const context = docs.map((doc: Document) => doc.pageContent).join("\n\n");

        // 3. Prepare the LLM and Chain
        const llm = new ChatOpenAI({
            modelName: "gpt-4o-mini",
            temperature: 0,
        });

        const prompt = PromptTemplate.fromTemplate(`You are a helpful company assistant answering employee questions.
Answer the question based ONLY on the following context.
If you don't know the answer, say "I don't know based on the provided company documents."
Do not make up information.

Context: {context}

Question: {input}
Answer:`);

        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        // 4. Generate Answer
        const answer = await chain.invoke({
            context,
            input: question,
        });

        // 5. Extract unique sources
        const sources = docs.map((doc: Document) => doc.metadata?.source || "Unknown source");
        const uniqueSources = Array.from(new Set(sources));

        return NextResponse.json({
            answer,
            sources: uniqueSources
        });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

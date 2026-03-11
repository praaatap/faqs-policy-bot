import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

export async function GET() {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(documents);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API key missing on server" }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const companyId = formData.get("companyId") as string | null;
        const subject = formData.get("subject") as string | null;

        if (!file || !companyId || !subject) {
            return NextResponse.json({ error: "Missing required fields: file, companyId, subject" }, { status: 400 });
        }

        const filename = file.name;

        // 1. Create DB entry with status processing
        const docRecord = await prisma.document.create({
            data: {
                filename,
                companyId,
                subject,
                status: "processing",
            },
        });

        // 2. Load the file
        let docs: Document[] = [];
        if (filename.toLowerCase().endsWith(".pdf")) {
            // Blob is compatible with PDF loader
            const loader = new PDFLoader(file);
            docs = await loader.load();
        } else {
            // Assume text for other formats
            const text = await file.text();
            docs = [new Document({ pageContent: text, metadata: { source: filename } })];
        }

        // 3. Split the text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docs);

        // Map metadata
        const docsWithMetadata = splitDocs.map((doc: Document) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                companyId,
                subject,
                documentId: docRecord.id, // Store Postgres ID in Chroma for tracing
            }
        }));

        // 4. Store in ChromaDB
        // Collection name per company + subject
        // Chroma collection names have restrictions, so we'll sanitize it a bit:
        const collectionName = `${companyId}-${subject}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();

        await Chroma.fromDocuments(
            docsWithMetadata,
            new OpenAIEmbeddings(),
            {
                collectionName,
                url: process.env.CHROMA_URL || "http://localhost:8000",
            }
        );

        // 5. Update DB status to uploaded
        const updatedDoc = await prisma.document.update({
            where: { id: docRecord.id },
            data: { status: "uploaded" },
        });

        return NextResponse.json(updatedDoc);
    } catch (error) {
        console.error("Document upload error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

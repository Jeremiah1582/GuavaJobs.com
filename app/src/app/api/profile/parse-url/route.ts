import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

import { getSession } from "@/lib/auth/get-session"

export const runtime = "nodejs"
export const maxDuration = 60

const SYSTEM_PROMPT = `You are a profile data extractor. Given HTML content from a personal portfolio or professional profile page, extract relevant information to populate a job seeker's profile.

Extract the following fields if present:
- summary: A professional summary or bio (1-3 sentences)
- skills: An array of skills mentioned
- experience: An array of work experiences with { company, title, startDate?, endDate?, highlights? }
- education: An array of education entries with { institution, degree?, startDate?, endDate? }
- name: The person's full name
- location: City, country, or region

Return ONLY valid JSON in this exact format:
{
  "name": "string or null",
  "summary": "string or null", 
  "location": "string or null",
  "skills": ["skill1", "skill2"],
  "experience": [{ "company": "string", "title": "string", "startDate": "string or null", "endDate": "string or null", "highlights": ["string"] }],
  "education": [{ "institution": "string", "degree": "string or null", "startDate": "string or null", "endDate": "string or null" }]
}

If a field cannot be found, use null for strings or empty arrays for arrays.
Do not include any explanation, only the JSON object.`

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the page content
    const pageResponse = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GuavaJobs/1.0; +https://guavajobs.com)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!pageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch page: ${pageResponse.status}` },
        { status: 400 }
      )
    }

    const html = await pageResponse.text()

    // Extract text content (strip HTML tags but keep structure)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000) // Limit content size for AI processing

    if (textContent.length < 50) {
      return NextResponse.json(
        { error: "Page content too short to extract profile data" },
        { status: 400 }
      )
    }

    // Use AI to extract profile data
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt: `Extract profile information from this page content:\n\n${textContent}`,
      temperature: 0.1,
    })

    // Parse the AI response
    let profileData
    try {
      // Clean up the response (remove markdown code blocks if present)
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      profileData = JSON.parse(cleanedText)
    } catch {
      return NextResponse.json(
        { error: "Failed to parse profile data from page" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: profileData })
  } catch (error) {
    console.error("Profile parse error:", error)
    
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timed out - the page took too long to load" },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process profile URL" },
      { status: 500 }
    )
  }
}

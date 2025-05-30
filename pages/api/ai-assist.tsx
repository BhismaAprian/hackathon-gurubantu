// pages/api/ai-assist.ts
import { NextApiRequest, NextApiResponse } from "next"
import together from "@/lib/together"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { postContent } = req.body

  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        { role: "system", content: "Kamu adalah asisten AI pendidikan yang membantu menjawab pertanyaan diskusi." },
        { role: "user", content: postContent },
      ],
    })

    const aiMessage = response.choices?.[0]?.message?.content?.trim()

    if (!aiMessage) {
    return res.status(500).json({ error: "Respons dari AI tidak valid." })
    }

    return res.status(200).json({ aiResponse: aiMessage })
  } catch (error) {
    console.error("AI Error:", error)
    return res.status(500).json({ error: "Gagal menghasilkan jawaban AI" })
  }
}

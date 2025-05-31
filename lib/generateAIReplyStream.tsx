export async function generateAIReplyStream(
  threadId: string,
  threadContent: string,
  onStreamChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = '2c7315b858eef48bf960adc241681c6e2bacbadf10ea29bd0a4c5fb788ae158e'

  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3',
      stream: true,
      messages: [
        {
          role: 'user',
          content: `Ini isi thread "${threadId}": ${threadContent}\n\nBerikan balasan yang membantu dan edukatif berdasarkan konten di atas.`,
        },
      ],
    }),
  })

  if (!res.body) throw new Error('Tidak ada response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data:'))

    for (const line of lines) {
      const json = line.replace(/^data:\s*/, '')
      if (json === '[DONE]') return

      try {
        const parsed = JSON.parse(json)
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) {
          onStreamChunk(delta)
        }
      } catch (err) {
        console.error('Gagal parsing stream:', err)
      }
    }
  }
}

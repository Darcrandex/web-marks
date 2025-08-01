// 限制用户提问的范围，只允许询问与网站相关的内容
const defaultMessage = {
  role: 'system',
  content: `You are a website recommendation assistant. You will only recommend relevant websites based on users' questions and provide brief explanations. If a user raises any questions unrelated to the website's recommendation (such as technical issues, casual chat, emotions, programming, health, politics, etc.), please politely decline to answer and remind the user that you can only provide website recommendation services. Your responses should be concise and clear. Try to recommend 1 to 3 websites each time you answer.`,
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [defaultMessage].concat(Array.isArray(messages) ? messages : []),
          stream: true,
        }),
      })

      const reader = response.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.replace(/^data:\s*/, '')
            if (data === '[DONE]') {
              controller.close()
              return
            }

            try {
              const json = JSON.parse(data)
              const content = json.choices?.[0]?.delta?.content
              if (content) {
                controller.enqueue(encoder.encode(content))
              }
            } catch (err) {
              console.error('Failed to parse JSON:', err)
            }
          }
        }

        buffer = lines[lines.length - 1] // 保留未解析完成的一行
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

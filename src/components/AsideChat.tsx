'use client'

import { useState } from 'react'

export type MessageItem = {
  role: string // 'user' | 'assistant'
  content: string
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder('utf-8')
    let assistantMessage = ''

    while (true) {
      const { done, value } = (await reader?.read()) || {}
      if (done) break
      const chunk = decoder.decode(value)
      assistantMessage += chunk
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
    }

    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="mb-4 text-2xl font-bold">AI 客服助手</h1>

      <div className="h-[400px] space-y-2 overflow-y-auto rounded border bg-white p-4 shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <p className={msg.role === 'user' ? 'text-blue-600' : 'text-green-700'}>{msg.content}</p>
          </div>
        ))}
        {isLoading && <div className="text-green-700">AI 正在输入...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入问题..."
        />
        <button
          onClick={sendMessage}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={isLoading}
        >
          发送
        </button>
      </div>
    </div>
  )
}

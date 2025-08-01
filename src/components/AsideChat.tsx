'use client'

import { cls } from '@/utils/cls'
import { ArrowUp, LoaderCircle, MessagesSquare, X as XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export enum RoleType {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type MessageItem = {
  role: RoleType
  content: string
}

const tipsMessage: MessageItem = {
  role: RoleType.ASSISTANT,
  content:
    'Hi, I can recommend interesting websites for you. Please ask your questions related to website recommendations.',
}

export default function AsideChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([tipsMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const appended = [{ role: RoleType.USER, content: input }]
    const newMessages = [...messages, ...appended]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: appended }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder('utf-8')
    let assistantMessage = ''

    while (true) {
      const { done, value } = (await reader?.read()) || {}
      if (done) break
      const chunk = decoder.decode(value)
      assistantMessage += chunk
      setMessages([...newMessages, { role: RoleType.ASSISTANT, content: assistantMessage }])
    }

    setIsLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) {
        setInput(input + '\n')
      } else {
        sendMessage()
      }
    }
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="fixed top-24 right-8 bottom-16 z-20 flex w-96 origin-bottom-right flex-col overflow-auto rounded-2xl bg-white p-4 shadow-lg transform-3d"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            key="box"
          >
            <header className="flex items-center justify-between">
              <h2>Chat with Assistant</h2>
              <button
                className="flex h-6 w-6 cursor-pointer items-center justify-center text-gray-500 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="transition-colors" />
              </button>
            </header>

            <main className="scrollbar-hide my-4 flex-1 overflow-x-hidden overflow-y-auto">
              <ol className="space-y-8">
                {messages.map((v, i) => (
                  <li key={i} className={cls('flex', v.role === RoleType.USER && 'justify-end')}>
                    <div
                      className={cls('prose prose-sm rounded-xl p-4', v.role === RoleType.USER && 'w-5/6 bg-slate-100')}
                    >
                      {v.role === RoleType.USER ? <p>{v.content}</p> : <ReactMarkdown>{v.content}</ReactMarkdown>}
                    </div>
                  </li>
                ))}
              </ol>

              <p className={cls('my-4 flex w-full justify-center text-gray-300 opacity-0', isLoading && 'opacity-100')}>
                <i>
                  <LoaderCircle className="animate-spin" />
                </i>
              </p>
            </main>

            <footer className="relative">
              <textarea
                className="focus:border-parimary focus:ring-parimary block h-40 w-full flex-1 resize-none rounded-md border border-gray-200 px-2 pt-2 pb-8 text-gray-800 transition-all outline-none focus:ring-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                maxLength={200}
              />

              {input.length === 0 && (
                <article className="pointer-events-none absolute top-2 left-4 w-full space-y-0 opacity-50">
                  <p>Type a message here...</p>
                  <p>
                    <kbd>ENTER</kbd> to send
                  </p>
                  <p>
                    <kbd>SHIFT + ENTER</kbd> for new line
                  </p>
                </article>
              )}

              <button
                onClick={sendMessage}
                disabled={input.trim().length === 0 || isLoading}
                className={cls(
                  'absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full',
                  input.trim().length === 0 || isLoading
                    ? 'bg-gray-200 text-gray-50'
                    : 'bg-parimary cursor-pointer text-white',
                )}
              >
                <ArrowUp size={16} />
              </button>
            </footer>
          </motion.div>
        ) : (
          <button
            className="fixed right-8 bottom-16 z-10 flex cursor-pointer items-center justify-center rounded-full bg-white p-4 shadow-md transition-colors hover:bg-gray-100"
            onClick={() => setIsOpen(true)}
          >
            <MessagesSquare className="text-parimary" />
          </button>
        )}
      </AnimatePresence>
    </>
  )
}

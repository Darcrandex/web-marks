import GlobalAntdMessage from '@/components/GlobalAntdMessage'
import AntdProvider from '@/lib/AntdProvider'
import QueryProvider from '@/lib/QueryProvider'
import '@ant-design/v5-patch-for-react-19'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'web marks',
  description: 'A simple web bookmark manager',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AntdProvider>
            {children}
            <GlobalAntdMessage />
          </AntdProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

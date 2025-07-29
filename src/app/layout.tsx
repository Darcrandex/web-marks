import GlobalAntdMessage from '@/components/GlobalAntdMessage'
import NextProgressBar from '@/components/NextProgressBar'
import AntdProvider from '@/lib/AntdProvider'
import QueryProvider from '@/lib/QueryProvider'
import '@ant-design/v5-patch-for-react-19'
import type { Metadata } from 'next'
import { PropsWithChildren, Suspense } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'web marks',
  description: 'A simple web bookmark manager',
}

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <NextProgressBar>
          <QueryProvider>
            <AntdProvider>
              {props.children}
              <GlobalAntdMessage />

              <Suspense fallback={null}>
                <NextProgressBar />
              </Suspense>
            </AntdProvider>
          </QueryProvider>
        </NextProgressBar>
      </body>
    </html>
  )
}

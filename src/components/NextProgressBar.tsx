/**
 * @name NextProgressBar
 * @description
 * @author darcrand
 */

'use client'
import { ThemeConfig } from '@/constant/theme'
import { ProgressProvider } from '@bprogress/next/app'
import { PropsWithChildren } from 'react'

export default function NextProgressBar(props: PropsWithChildren) {
  return (
    <ProgressProvider height="4px" color={ThemeConfig.primaryColor} options={{ showSpinner: false }} shallowRouting>
      {props.children}
    </ProgressProvider>
  )
}

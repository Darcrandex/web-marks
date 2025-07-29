/**
 * @name NextProgressBar
 * @description
 * @author darcrand
 */

'use client'
import { ProgressProvider } from '@bprogress/next/app'
import { PropsWithChildren } from 'react'

export default function NextProgressBar(props: PropsWithChildren) {
  return (
    <ProgressProvider height="4px" color="#3b82f6" options={{ showSpinner: false }} shallowRouting>
      {props.children}
    </ProgressProvider>
  )
}

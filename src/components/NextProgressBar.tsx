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
    <ProgressProvider height="4px" color="#2dd4bf" options={{ showSpinner: false }} shallowRouting>
      {props.children}
    </ProgressProvider>
  )
}

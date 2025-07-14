/**
 * @name AntdProvider
 * @description
 * @author darcrand
 */

'use client'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { PropsWithChildren } from 'react'

export default function AntdProvider(props: PropsWithChildren) {
  return <AntdRegistry>{props.children}</AntdRegistry>
}

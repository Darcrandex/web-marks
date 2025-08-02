/**
 * @name AntdProvider
 * @description
 * @author darcrand
 */

'use client'
import { ThemeConfig } from '@/constant/theme'
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App as AntdApp, ConfigProvider } from 'antd'
import { PropsWithChildren } from 'react'

export default function AntdProvider(props: PropsWithChildren) {
  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: ThemeConfig.primaryColor,
            borderRadius: 2,
          },
        }}
      >
        <AntdApp>
          <AntdRegistry>{props.children}</AntdRegistry>
        </AntdApp>
      </ConfigProvider>
    </StyleProvider>
  )
}

/**
 * @name DataTable
 * @description
 * @author darcrand
 */

'use client'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import GroupTable from './GroupTable'
import ItemTable from './ItemTable'

const items: TabsProps['items'] = [
  { key: '1', label: 'Group Table', children: <GroupTable /> },
  { key: '2', label: 'Item Table', children: <ItemTable /> },
]

export default function DataTable() {
  return (
    <>
      <section className="m-4">
        <Tabs defaultActiveKey="1" items={items} />
      </section>
    </>
  )
}

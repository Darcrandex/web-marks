/**
 * @name UserData
 * @description
 * @author darcrand
 */

'use client'
import { Divider } from 'antd'
import GroupTable from './GroupTable'
import ItemTable from './ItemTable'

export default function UserData() {
  return (
    <>
      <GroupTable />

      <Divider />

      <ItemTable />
    </>
  )
}

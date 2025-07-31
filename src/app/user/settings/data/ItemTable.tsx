/**
 * @name ItemTable
 * @description 书签数据表
 * @author darcrand
 */

'use client'
import LogoView from '@/components/LogoView'
import { Item } from '@/db/schema/items'
import { useAllData } from '@/hooks/useAllData'
import { itemService } from '@/services/item'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TableProps } from 'antd'
import { App as AntdApp, Button, Drawer, Form, Input, InputNumber, Popconfirm, Select, Space, Table } from 'antd'
import { isNil } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { useState } from 'react'

export default function ItemTable() {
  const queryClient = useQueryClient()
  const { items, groups } = useAllData()
  const { message } = AntdApp.useApp()

  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const itemId = Form.useWatch('id', form)
  const isUpdate = !isEmpty(itemId)
  const itemUrl = Form.useWatch('url', form)

  const onEdit = (data?: Item) => {
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
    setOpen(true)
  }

  const submitMutation = useMutation({
    mutationFn: async (value: Partial<Item>) => {
      if (isUpdate) {
        await itemService.update(value.id!, value)
      } else {
        await itemService.create(value)
      }
    },

    onSuccess() {
      message.success('Item saved successfully')
      form.resetFields()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await itemService.remove(id)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  // 输入网址后进行格式化
  const formatUrl = useMutation({
    mutationFn: async () => {
      if (isNil(itemUrl) || isEmpty(itemUrl)) {
        throw new Error('url is empty')
      }

      const url = new URL(itemUrl)
      return url.origin
    },

    onSuccess(value) {
      form.setFieldValue('url', value)
    },
  })

  // 根据输入的网址获取图标
  const getIconUrl = useMutation({
    mutationFn: async () => {
      if (!isEmpty(itemUrl)) {
        const res = await itemService.getLogo(itemUrl)
        if (!isEmpty(res)) {
          return res
        }
      }
    },

    onSuccess(iconUrl: string | undefined) {
      form.setFieldValue('iconUrl', iconUrl)
    },
  })

  const columns: TableProps<Item>['columns'] = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Icon',
      dataIndex: 'iconUrl',
      render: (_, row) => <LogoView src={row.iconUrl} className="h-6 w-6" />,
    },
    { title: 'Desc', dataIndex: 'desc', ellipsis: true, width: 180 },
    {
      title: 'Group',
      dataIndex: 'groupId',
      render: (_, row) => groups?.find((g) => g.id === row.groupId)?.name || '-',
    },
    {
      title: 'Operations',
      render: (_, row) => (
        <Space>
          <Button onClick={() => onEdit(row)}>edit</Button>
          <Popconfirm
            title="warning"
            description="Are you sure to delete this item?"
            onConfirm={() => removeMutation.mutateAsync(row.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button>remove</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <p className="text-gray-500">Your web book marks</p>

      <Space className="mt-4">
        <Button type="primary" onClick={() => onEdit()}>
          Add Item
        </Button>

        <Button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['items'] })
          }}
        >
          Refresh
        </Button>
      </Space>

      <Table<Item>
        columns={columns}
        dataSource={items}
        rowKey={(v) => v.id}
        className="mt-4"
        pagination={{ hideOnSinglePage: true }}
      />

      <Drawer title={isUpdate ? 'Edit Item' : 'Add Item'} open={open} onClose={() => setOpen(false)} width={520}>
        <Form form={form} name="item-form" layout="vertical" onFinish={submitMutation.mutate}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input name' }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>

          <Form.Item label="Url" required>
            <Form.Item name="url" noStyle rules={[{ required: true, message: 'Please input the URL!' }]}>
              <Input maxLength={50} allowClear disabled={formatUrl.isPending} />
            </Form.Item>

            <Button
              className="mt-2"
              onClick={() => formatUrl.mutateAsync()}
              disabled={isEmpty(itemUrl)}
              loading={formatUrl.isPending}
            >
              format
            </Button>
          </Form.Item>

          <Form.Item name="groupId" label="Group" rules={[{ required: true, message: 'Please select a group!' }]}>
            <Select options={groups} fieldNames={{ label: 'name', value: 'id' }} />
          </Form.Item>

          <Form.Item name="desc" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="IconUrl">
            <Form.Item name="iconUrl" noStyle>
              <Input allowClear disabled={getIconUrl.isPending} />
            </Form.Item>

            <Button
              className="mt-2"
              onClick={() => getIconUrl.mutate()}
              disabled={isEmpty(itemUrl)}
              loading={getIconUrl.isPending}
            >
              get icon
            </Button>
          </Form.Item>

          <Form.Item hidden label="Sort" name="sort">
            <InputNumber maxLength={5} step={1} />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" loading={submitMutation.isPending}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

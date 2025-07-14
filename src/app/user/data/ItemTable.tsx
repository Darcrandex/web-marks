/**
 * @name ItemTable
 * @description
 * @author darcrand
 */

'use client'
import { Group } from '@/db/schema/groups'
import { Item } from '@/db/schema/items'
import { http } from '@/utils/http.client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useReactive, useToggle } from 'ahooks'
import { Button, Drawer, Form, Input, Select } from 'antd'

export default function ItemTable() {
  const queryClient = useQueryClient()

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await http.get('/api/group')
      return res.data
    },
  })

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await http.get('/api/item')
      return res.data
    },
  })

  // form
  const [form] = Form.useForm()
  const [openDrawer, { toggle: toggleDrawer }] = useToggle(false)

  const submitMutation = useMutation({
    mutationFn: async (values: Partial<Item>) => {
      if (values.id) {
        const res = await http.patch(`/api/item/${values.id}`, values)
        return res.data
      }

      const res = await http.post('/api/item', values)
      return res.data
    },
    onSuccess: () => {
      form.resetFields()
      toggleDrawer()
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/api/item/${id}`)
      return res.data
    },
    onSuccess: () => {
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const onAdd = () => {
    form.resetFields()
    toggleDrawer()
  }

  const onUpdate = (item: Item) => {
    form.setFieldsValue(item)
    toggleDrawer()
  }

  const onRemove = (id: string) => {
    removeMutation.mutate(id)
  }

  return (
    <>
      <div>ItemTable</div>

      <header>
        <Button onClick={onAdd}>Create</Button>
      </header>

      <ol>
        {items?.map((item: Item) => (
          <li key={item.id}>
            <p className="font-bold">{item.name}</p>
            <footer>
              <Button type="link" onClick={() => onUpdate(item)}>
                Update
              </Button>
              <Button type="link" onClick={() => onRemove(item.id)}>
                Remove
              </Button>
            </footer>
          </li>
        ))}
      </ol>

      <Drawer open={openDrawer} onClose={toggleDrawer}>
        <Form layout="vertical" form={form} onFinish={submitMutation.mutate}>
          <Form.Item name="id" hidden>
            <input />
          </Form.Item>

          <Form.Item name="groupId" label="Group" rules={[{ required: true, message: 'Please select a group!' }]}>
            <Select options={groups} fieldNames={{ label: 'name', value: 'id' }} />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="desc" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="url" label="Url" rules={[{ required: true, message: 'Please input the URL!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="iconUrl" label="IconUrl">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitMutation.isPending}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

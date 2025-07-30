/**
 * @name GroupTable
 * @description
 * @author darcrand
 */

'use client'
import { Group } from '@/db/schema/groups'
import { useAllData } from '@/hooks/useAllData'
import { groupService } from '@/services/group'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TableProps } from 'antd'
import { App as AntdApp, Button, Drawer, Form, Input, InputNumber, Popconfirm, Space, Table } from 'antd'
import { isEmpty } from 'es-toolkit/compat'
import { GripVertical } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  listeners?: SyntheticListenerMap
}

const RowContext = createContext<RowContextProps>({})

function DragHandle() {
  const { setActivatorNodeRef, listeners } = useContext(RowContext)
  return (
    <button
      type="button"
      className="cursor-move text-gray-500 transition-all hover:text-gray-800"
      ref={setActivatorNodeRef}
      {...listeners}
    >
      <GripVertical />
    </button>
  )
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

function Row(props: RowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  }

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}

export default function GroupTable() {
  const queryClient = useQueryClient()
  const { message } = AntdApp.useApp()

  const { groups } = useAllData()
  const [dataSource, setDataSource] = useState(groups || [])
  useEffect(() => {
    if (Array.isArray(groups)) {
      setDataSource(groups)
    }
  }, [groups])

  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const groupId = Form.useWatch('id', form)
  const isUpdate = !isEmpty(groupId)

  const onEdit = (data?: Group) => {
    if (data) {
      form.setFieldsValue(data)
    } else {
      form.resetFields()
    }
    setOpen(true)
  }

  const submitMutation = useMutation({
    mutationFn: async (value: Partial<Group>) => {
      console.log(value)
      if (isUpdate) {
        await groupService.update(value.id!, value)
      } else {
        await groupService.create(value)
      }
    },
    onSuccess() {
      message.success('Group saved successfully')
      form.resetFields()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await groupService.remove(id)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const columns: TableProps<Group>['columns'] = [
    { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Sort', dataIndex: 'sort' },
    {
      title: 'Operations',
      render: (_, row) => (
        <Space>
          <Button onClick={() => onEdit(row)}>edit</Button>
          <Popconfirm
            title="warning"
            description={
              <>
                <p>Are you sure to delete this group?</p>
                <p>
                  Items of this group will <strong>also be deleted</strong>!
                </p>
              </>
            }
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

  const sortMutation = useMutation({
    mutationFn: async (sorted: Group[]) => {
      const data = sorted.map((v) => ({ id: v.id, sort: v.sort || 0 }))
      await groupService.sort(data)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        const prevState = [...dataSource]
        const activeIndex = prevState.findIndex((v) => v.id === active?.id)
        const overIndex = prevState.findIndex((v) => v.id === over?.id)
        const sortedArr = arrayMove(prevState, activeIndex, overIndex).map((v, i) => ({ ...v, sort: i + 1 }))

        setDataSource(sortedArr)
        sortMutation.mutate(sortedArr)
      }
    },
    [dataSource, sortMutation],
  )

  const hasMutating = useIsMutating() > 0

  return (
    <>
      <p className="text-gray-500">book marks group</p>

      <Space className="mt-4">
        <Button type="primary" onClick={() => onEdit()}>
          Add Group
        </Button>

        <Button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['groups'] })
          }}
        >
          Refresh
        </Button>
      </Space>

      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={(dataSource || []).map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Table<Group>
            loading={hasMutating}
            components={{ body: { row: Row } }}
            columns={columns}
            dataSource={dataSource}
            rowKey={(group) => group.id}
            className="mt-4"
            pagination={{ hideOnSinglePage: true }}
          />
        </SortableContext>
      </DndContext>

      <Drawer title={isUpdate ? 'Edit Group' : 'Add Group'} open={open} onClose={() => setOpen(false)} width={400}>
        <Form form={form} name="group-form" layout="vertical" onFinish={submitMutation.mutate}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input name' }]}>
            <Input maxLength={20} allowClear />
          </Form.Item>

          <Form.Item label="Sort" name="sort">
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

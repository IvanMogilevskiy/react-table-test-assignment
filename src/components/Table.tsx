import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Button, Input, Row, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { User } from '../types';
import { UserModal } from './UserModal';

const initialUsers = [
  {
    id: 1,
    name: 'Петр',
    birthday: '1960-01-14',
    rating: 1,
  },
  {
    id: 2,
    name: 'Анна',
    birthday: '2001-11-23',
    rating: 4,
  },
  {
    id: 3,
    name: 'Степан',
    birthday: '2011-04-05',
    rating: 2,
  },
]

export const TestTable = () => {
  const [users, setUsers] = useState<User[]>([...initialUsers]);
  const [selectedItem, setSelectedItem] = useState<User>();
  const [filter, setFilter] = useState<string>('');

  const generateId = useCallback(() => {
    const numbers = users.length ? users.map((u) => u.id) : [0];
    return Math.max(...numbers) + 1;
  }, [users]);

  const isUserExists = useCallback(
    (id: number) => users.map((u) => u.id).includes(id),
    [users]
  );

  const columns: ColumnsType<User> = [
    {
      title: 'Имя',
      dataIndex: 'name',
      defaultSortOrder: 'descend',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      title: 'Дата рождения',
      dataIndex: 'birthday',
      sorter: (a, b) => (a.birthday || '').localeCompare(b.birthday || ''),
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      title: 'Рейтинг',
      dataIndex: 'rating',
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      width: 70,
      title: 'Действия',
      render: (_, item) => (
        <Space>
          <Button
            size="small"
            onClick={() => setSelectedItem(item)}
            icon={<EditOutlined />}
          />
          <Button
            danger
            onClick={() => setUsers(users.filter((u) => u.id !== item.id))}
            size="small"
            icon={<DeleteOutlined />}
          />
        </Space>
      )
    }
  ];

  return (
    <section className="app">
      <Typography.Title style={{textAlign: 'center'}} level={3}>
        Пользователи
      </Typography.Title>
      <Row justify={'end'}>
        <Space>
          <Input
            onChange={(e) => setFilter(e.currentTarget.value)}
            placeholder="Поиск..."
            suffix={<SearchOutlined />}
            value={filter}
          />
          <Button
            type="primary"
            onClick={() => setSelectedItem({id: generateId()})}
          >
            Добавить
          </Button>
        </Space>
      </Row>
      <Table
        size="small"
        rowKey={'id'}
        className="margin-top-lg"
        bordered
        columns={columns}
        dataSource={
          filter
            ? users.filter(
              (el) =>
                el.name?.toLowerCase().includes(filter.toLowerCase()) ||
                el.birthday?.includes(filter.toLowerCase()) ||
                el.rating?.toString().includes(filter.toLowerCase())
            )
            : users
        }
      />
      <UserModal
        onCancel={() => setSelectedItem(undefined)}
        visible={!!selectedItem}
        onOk={(user) => {
          if (isUserExists(user.id)) {
            setUsers(
              users.map((existing) =>
                user.id === existing.id ? user : existing
              )
            );
          } else {
            setUsers([...users, user]);
          }
          setSelectedItem(undefined);
        }}
        user={selectedItem}
      />
    </section>
  );
};

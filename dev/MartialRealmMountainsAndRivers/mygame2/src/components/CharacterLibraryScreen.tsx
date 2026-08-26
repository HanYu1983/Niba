import { Button, Card, Flex, Form, Input, List, Modal, Popconfirm, Space, Tabs, Typography, message } from 'antd'
import { useState } from 'react'
import {
  createCharacter,
  deleteCharacter,
  getCharacters,
  updateCharacter,
  type PersistentCharacter,
} from '../game/characterRoster'
import { ATTRIBUTE_NAMES, type UpgradeableAttribute } from '../game/types'
import CharacterTrainingPanel from './CharacterTrainingPanel'
import CharacterTalentPanel from './CharacterTalentPanel'

const ATTRIBUTE_KEYS: UpgradeableAttribute[] = ['armStrength', 'constitution', 'agility', 'innerEnergy', 'insight']

type CharacterLibraryScreenProps = {
  /** 選用某角色（本階段僅回傳角色，供後續對局流程使用）。 */
  onSelect?: (character: PersistentCharacter) => void
}

function CharacterLibraryScreen({ onSelect }: CharacterLibraryScreenProps) {
  const [characters, setCharacters] = useState<PersistentCharacter[]>(() => getCharacters())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PersistentCharacter | null>(null)
  const [form] = Form.useForm()

  const refresh = () => setCharacters(getCharacters())

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (character: PersistentCharacter) => {
    setEditing(character)
    form.setFieldsValue({
      name: character.name,
      portrait: character.portrait,
      title: character.title,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    if (editing) {
      // 五維加成僅由「培養」Tab 調整，儲存基本資料時不覆蓋。
      const ok = updateCharacter(editing.id, {
        name: values.name,
        portrait: values.portrait,
        title: values.title,
      })
      if (!ok) {
        message.error('更新失敗：名稱重複或空白。')
        return
      }
      message.success('角色已更新。')
    } else {
      const created = createCharacter({
        name: values.name,
        portrait: values.portrait,
        title: values.title,
      })
      if (!created) {
        message.error('建立失敗：名稱重複或空白。')
        return
      }
      message.success('角色已建立。')
    }

    setModalOpen(false)
    refresh()
  }

  const handleDelete = (id: string) => {
    deleteCharacter(id)
    message.success('角色已刪除。')
    refresh()
  }

  return (
    <Card className="character-library" bordered={false}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Typography.Text className="start-screen__eyebrow">武行山河 · CHARACTER ROSTER</Typography.Text>
          <Typography.Title level={3} style={{ marginTop: 4, marginBottom: 0 }}>俠客名冊</Typography.Title>
        </div>
        <Button type="primary" onClick={openCreate}>＋ 新建角色</Button>
      </Flex>

      <Typography.Paragraph type="secondary">
        管理你的跨對局角色。每個角色可設定基本參數與五維加成（開局疊加進基礎五維）。
      </Typography.Paragraph>

      <List
        dataSource={characters}
        locale={{ emptyText: '尚無角色，點擊「新建角色」開始。' }}
        renderItem={(character) => (
          <List.Item
            actions={[
              <Button key="select" type="link" onClick={() => onSelect?.(character)}>選用</Button>,
              <Button key="edit" type="link" onClick={() => openEdit(character)}>編輯／培養</Button>,
              <Popconfirm
                key="delete"
                title="確定刪除此角色？"
                onConfirm={() => handleDelete(character.id)}
              >
                <Button type="link" danger>刪除</Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span>{character.portrait ? `${character.portrait} ` : ''}{character.name}</span>
                  {character.title && <Typography.Text type="secondary">{character.title}</Typography.Text>}
                </Space>
              }
              description={
                <Space wrap>
                  {ATTRIBUTE_KEYS.map((key) => (
                    <Typography.Text key={key} type="secondary">
                      {ATTRIBUTE_NAMES[key]} {8 + character.attributeBonuses[key]}
                    </Typography.Text>
                  ))}
                  <Typography.Text type="secondary">📜 武學殘卷 {character.scrolls ?? 0}</Typography.Text>
                  <Typography.Text type="secondary">對局 {character.gamesPlayed} 次</Typography.Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={editing ? `編輯／培養「${editing.name}」` : '新建角色'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="儲存"
        cancelText="取消"
        destroyOnClose
        width={1000}
        style={{ maxWidth: 'calc(100vw - 32px)' }}
      >
        {editing ? (
          <Tabs
            items={[
              {
                key: 'basic',
                label: '基本資料',
                children: (
                  <Form form={form} layout="vertical" initialValues={{ portrait: '', title: '' }}>
                    <Form.Item
                      name="name"
                      label="角色名稱"
                      rules={[{ required: true, whitespace: true, message: '請輸入角色名稱' }]}
                    >
                      <Input placeholder="例如：張三" maxLength={20} />
                    </Form.Item>
                    <Form.Item name="portrait" label="外觀 icon（選填）">
                      <Input placeholder="例如：sword / shield / fan" maxLength={20} />
                    </Form.Item>
                    <Form.Item name="title" label="稱號（選填）">
                      <Input placeholder="例如：劍客" maxLength={20} />
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'train',
                label: '培養',
                children: (
                  <CharacterTrainingPanel character={editing} onChanged={refresh} />
                ),
              },
              {
                key: 'talent',
                label: '天賦',
                children: (
                  <CharacterTalentPanel character={editing} onChanged={refresh} />
                ),
              },
            ]}
          />
        ) : (
          <Form form={form} layout="vertical" initialValues={{ portrait: '', title: '' }}>
            <Form.Item
              name="name"
              label="角色名稱"
              rules={[{ required: true, whitespace: true, message: '請輸入角色名稱' }]}
            >
              <Input placeholder="例如：張三" maxLength={20} />
            </Form.Item>
            <Form.Item name="portrait" label="外觀 icon（選填）">
              <Input placeholder="例如：sword / shield / fan" maxLength={20} />
            </Form.Item>
            <Form.Item name="title" label="稱號（選填）">
              <Input placeholder="例如：劍客" maxLength={20} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  )
}

export default CharacterLibraryScreen

import { Button, Divider, Flex, InputNumber, Modal, Select, Space, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import type { AiConstructionPlan, AiConstructionPolicy, AiOrder, BaseState, PlayerState } from '../game/types'
import { buildingCatalog } from '../game/catalogs/buildingCatalog'

type StrategicCommandModalProps = {
  open: boolean
  aiPlayers: PlayerState[]
  players: PlayerState[]
  bases: BaseState[]
  orders: AiOrder[]
  constructionPlans: AiConstructionPlan[]
  onClose: () => void
  onSaveOrder: (order: AiOrder) => { ok: boolean; reason?: string }
  onDeleteOrder: (aiPlayerId: string, orderId: string) => { ok: boolean; reason?: string }
  onSaveConstructionPlan: (plan: AiConstructionPlan) => { ok: boolean; reason?: string }
}

const defaultPolicy: AiConstructionPolicy = 'defense'

function StrategicCommandModal({ open, aiPlayers, players, bases, orders, constructionPlans, onClose, onSaveOrder, onDeleteOrder, onSaveConstructionPlan }: StrategicCommandModalProps) {
  const [message, setMessage] = useState<string | null>(null)

  // 表單狀態由子元件在掛載時初始化；Modal 的 destroyOnHidden 確保每次開啟都重新掛載，
  // 不需在 Effect 內同步呼叫 setState，避免 cascading renders。
  return (
    <Modal
      title="AI 戰略指揮"
      open={open}
      onCancel={onClose}
      width={720}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnHidden
    >
      {aiPlayers.length === 0 ? (
        <Typography.Text type="secondary">目前沒有可指揮的 AI 玩家。</Typography.Text>
      ) : (
        <StrategicCommandForm
          aiPlayers={aiPlayers}
          players={players}
          bases={bases}
          orders={orders}
          constructionPlans={constructionPlans}
          message={message}
          onMessage={setMessage}
          onSaveOrder={onSaveOrder}
          onSaveConstructionPlan={onSaveConstructionPlan}
          onDeleteOrder={onDeleteOrder}
        />
      )}
    </Modal>
  )
}

type StrategicCommandFormProps = {
  aiPlayers: PlayerState[]
  players: PlayerState[]
  bases: BaseState[]
  orders: AiOrder[]
  constructionPlans: AiConstructionPlan[]
  message: string | null
  onMessage: (value: string | null) => void
  onSaveOrder: (order: AiOrder) => { ok: boolean; reason?: string }
  onSaveConstructionPlan: (plan: AiConstructionPlan) => { ok: boolean; reason?: string }
  onDeleteOrder: (aiPlayerId: string, orderId: string) => { ok: boolean; reason?: string }
}

function StrategicCommandForm({ aiPlayers, players, bases, orders, constructionPlans, message, onMessage, onSaveOrder, onSaveConstructionPlan, onDeleteOrder }: StrategicCommandFormProps) {
  const initialAiId = aiPlayers[0]?.id ?? ''
  const initialOrder = orders.find((order) => order.aiPlayerId === initialAiId && order.status === 'active')
  const initialPlan = constructionPlans.find((plan) => plan.aiPlayerId === initialAiId)
  // AiOrder 為區分聯集，無法在未判別 type 下存取特定欄位；以輔助函式安全讀取初始值。
  const initialProtect = initialOrder?.type === 'protect-base' ? initialOrder : undefined
  const initialSupport = initialOrder?.type === 'support-player' ? initialOrder : undefined
  const [selectedAiId, setSelectedAiId] = useState(initialAiId)
  const [orderType, setOrderType] = useState<AiOrder['type']>(initialOrder?.type ?? 'protect-base')
  const [targetBaseId, setTargetBaseId] = useState(initialProtect?.baseId ?? bases[0]?.id ?? '')
  const [targetPlayerId, setTargetPlayerId] = useState(initialSupport?.playerId ?? players.find((player) => player.id !== initialAiId)?.id ?? '')
  const [radius, setRadius] = useState(initialProtect?.radius ?? 6)
  const [maxDistance, setMaxDistance] = useState(initialSupport?.maxDistance ?? 8)
  const [priority, setPriority] = useState(initialOrder?.priority ?? 50)
  const [retreatHealthPercent, setRetreatHealthPercent] = useState(initialOrder && 'retreatHealthPercent' in initialOrder ? initialOrder.retreatHealthPercent : 30)
  const [policy, setPolicy] = useState<AiConstructionPolicy>(initialPlan?.policy ?? defaultPolicy)
  const [allowUpgrade, setAllowUpgrade] = useState(initialPlan?.allowUpgrade ?? true)
  const [constructionQueue, setConstructionQueue] = useState<AiConstructionPlan['queue']>(initialPlan?.queue ?? [])
  const [queueBuildingType, setQueueBuildingType] = useState('')
  const [queuePriority, setQueuePriority] = useState(50)

  const selectedAi = aiPlayers.find((player) => player.id === selectedAiId)
  const selectedOrder = orders.find((order) => order.aiPlayerId === selectedAiId && order.status === 'active')
  const selectedPlan = constructionPlans.find((plan) => plan.aiPlayerId === selectedAiId)
  const targetPlayers = players.filter((player) => player.id !== selectedAiId)

  // 切換 AI 玩家時，以該玩家既有命令/方針重新初始化選單欄位。
  const changeSelectedAi = (nextAiId: string) => {
    const order = orders.find((candidate) => candidate.aiPlayerId === nextAiId && candidate.status === 'active')
    const plan = constructionPlans.find((candidate) => candidate.aiPlayerId === nextAiId)
    setSelectedAiId(nextAiId)
    setOrderType(order?.type ?? 'protect-base')
    if (order?.type === 'protect-base') {
      setTargetBaseId(order.baseId)
      setRadius(order.radius)
    } else if (order?.type === 'support-player') {
      setTargetPlayerId(order.playerId)
      setMaxDistance(order.maxDistance)
    }
    setPriority(order?.priority ?? 50)
    setRetreatHealthPercent(order && 'retreatHealthPercent' in order ? order.retreatHealthPercent : 30)
    setPolicy(plan?.policy ?? defaultPolicy)
    setAllowUpgrade(plan?.allowUpgrade ?? true)
    setConstructionQueue(plan?.queue ?? [])
    onMessage(null)
  }

  const orderSummary = useMemo(() => {
    if (!selectedOrder) return '尚未設定 active 命令'
    if (selectedOrder.type === 'protect-base') {
      return `保護 ${bases.find((base) => base.id === selectedOrder.baseId)?.name ?? selectedOrder.baseId}`
    }
    if (selectedOrder.type === 'support-player') {
      return `支援 ${players.find((player) => player.id === selectedOrder.playerId)?.name ?? selectedOrder.playerId}`
    }
    if (selectedOrder.type === 'test1') return '模糊策略'
    if (selectedOrder.type === 'test2') return '決策樹'
  }, [bases, players, selectedOrder])

  const saveOrder = () => {
    if (!selectedAi) return
    const id = selectedOrder?.id ?? `ai-order-${selectedAi.id}-${Date.now()}`
    const order: AiOrder = orderType === 'protect-base'
      ? { id, type: 'protect-base', aiPlayerId: selectedAi.id, baseId: targetBaseId, radius, priority, retreatHealthPercent, status: 'active' }
      : orderType === 'support-player'
        ? { id, type: 'support-player', aiPlayerId: selectedAi.id, playerId: targetPlayerId, maxDistance, priority, retreatHealthPercent, status: 'active' }
        : orderType === 'test2'
          ? { id, type: 'test2', aiPlayerId: selectedAi.id, priority, status: 'active' }
          : { id, type: 'test1', aiPlayerId: selectedAi.id, priority, status: 'active' }
    const result = onSaveOrder(order)
    onMessage(result.ok ? '戰略命令已保存。' : result.reason ?? '戰略命令保存失敗。')
  }

  const savePlan = () => {
    if (!selectedAi || !targetBaseId) return
    const plan: AiConstructionPlan = {
      aiPlayerId: selectedAi.id,
      baseId: selectedPlan?.baseId ?? targetBaseId,
      policy,
      allowUpgrade,
      queue: constructionQueue,
    }
    const result = onSaveConstructionPlan(plan)
    onMessage(result.ok ? '建設方針已保存。AI 將直接依方針執行。' : result.reason ?? '建設方針保存失敗。')
  }

  const addConstructionItem = () => {
    if (!queueBuildingType) return
    if (constructionQueue.some((item) => item.buildingType === queueBuildingType && item.status !== 'cancelled')) {
      onMessage('此建築已在建設佇列中。')
      return
    }
    setConstructionQueue((current) => [...current, { buildingType: queueBuildingType, priority: queuePriority, status: 'planned' }])
    setQueueBuildingType('')
    onMessage(null)
  }

  const updateConstructionItem = (index: number, patch: Partial<AiConstructionPlan['queue'][number]>) => {
    setConstructionQueue((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item))
  }

  const removeConstructionItem = (index: number) => {
    setConstructionQueue((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const deleteOrder = () => {
    if (!selectedAi || !selectedOrder) return
    const result = onDeleteOrder(selectedAi.id, selectedOrder.id)
    onMessage(result.ok ? '戰略命令已刪除。' : result.reason ?? '戰略命令刪除失敗。')
  }

  return (
    <Flex vertical gap={16}>
      <label>
        <Typography.Text strong>選擇 AI 玩家</Typography.Text>
        <Select
          value={selectedAiId}
          onChange={changeSelectedAi}
          style={{ width: '100%', marginTop: 6 }}
          options={aiPlayers.map((player) => ({ label: `${player.name}（${player.id}）`, value: player.id }))}
        />
      </label>

      <Flex align="center" gap={8} wrap>
        <Typography.Text>目前命令：</Typography.Text>
        <Tag color={selectedOrder ? 'blue' : 'default'}>{orderSummary}</Tag>
      </Flex>

      <Divider>戰略命令</Divider>
      <Flex gap={12} wrap>
        <label className="strategic-command-modal__field">
          <Typography.Text strong>命令類型</Typography.Text>
          <Select value={orderType} onChange={setOrderType} options={[{ label: '保護據點', value: 'protect-base' }, { label: '支援玩家', value: 'support-player' }, { label: '模糊策略', value: 'test1' }, { label: '決策樹', value: 'test2' }]} />
        </label>
        {orderType === 'protect-base' ? (
          <label className="strategic-command-modal__field">
            <Typography.Text strong>目標據點</Typography.Text>
            <Select value={targetBaseId} onChange={setTargetBaseId} options={bases.map((base) => ({ label: base.name, value: base.id }))} />
          </label>
        ) : orderType === 'support-player' ? (
          <label className="strategic-command-modal__field">
            <Typography.Text strong>支援目標</Typography.Text>
            <Select value={targetPlayerId} onChange={setTargetPlayerId} options={targetPlayers.map((player) => ({ label: player.name, value: player.id }))} />
          </label>
        ) : null}
      </Flex>
      <Flex gap={12} wrap>
        {orderType === 'protect-base' ? <label className="strategic-command-modal__field"><Typography.Text strong>防守半徑（格）</Typography.Text><InputNumber min={0} max={40} value={radius} onChange={(value) => value !== null && setRadius(value)} /></label> : orderType === 'support-player' ? <label className="strategic-command-modal__field"><Typography.Text strong>最大支援距離（格）</Typography.Text><InputNumber min={0} max={40} value={maxDistance} onChange={(value) => value !== null && setMaxDistance(value)} /></label> : null}
        <label className="strategic-command-modal__field"><Typography.Text strong>優先級（玩家設定）</Typography.Text><InputNumber min={0} max={100} value={priority} onChange={(value) => value !== null && setPriority(value)} /></label>
        <label className="strategic-command-modal__field"><Typography.Text strong>撤退生命百分比</Typography.Text><InputNumber min={0} max={100} value={retreatHealthPercent} onChange={(value) => value !== null && setRetreatHealthPercent(value)} /></label>
      </Flex>
      <Space>
        <Button type="primary" onClick={saveOrder}>保存命令</Button>
        <Button danger disabled={!selectedOrder} onClick={deleteOrder}>刪除目前命令</Button>
      </Space>

      <Divider>據點建設方針</Divider>
      <Flex gap={12} wrap>
        <label className="strategic-command-modal__field"><Typography.Text strong>管理據點</Typography.Text><Select value={selectedPlan?.baseId ?? targetBaseId} onChange={setTargetBaseId} options={bases.map((base) => ({ label: base.name, value: base.id }))} /></label>
        <label className="strategic-command-modal__field"><Typography.Text strong>建設方針</Typography.Text><Select value={policy} onChange={setPolicy} options={[{ label: '防守優先', value: 'defense' }, { label: '經濟優先', value: 'economy' }, { label: '戰鬥支援', value: 'frontline' }, { label: '均衡發展', value: 'balanced' }, { label: '暫停主動建造', value: 'paused' }]} /></label>
      </Flex>
      <label><Typography.Text strong>允許升級建築：</Typography.Text><Select value={allowUpgrade ? 'yes' : 'no'} onChange={(value) => setAllowUpgrade(value === 'yes')} options={[{ label: '允許', value: 'yes' }, { label: '不允許', value: 'no' }]} /></label>
      <Typography.Text strong>建設佇列</Typography.Text>
      <Flex vertical gap={8}>
        {constructionQueue.map((item, index) => (
          <Flex key={`${item.buildingType}-${index}`} align="center" gap={8} wrap>
            <Typography.Text className="strategic-command-modal__queue-index">{index + 1}.</Typography.Text>
            <Typography.Text className="strategic-command-modal__queue-name">{buildingCatalog.find((building) => building.type === item.buildingType)?.name ?? item.buildingType}</Typography.Text>
            <InputNumber min={0} max={100} value={item.priority} onChange={(value) => value !== null && updateConstructionItem(index, { priority: value })} />
            <Select value={item.status} onChange={(value) => updateConstructionItem(index, { status: value })} options={[{ label: '規劃中', value: 'planned' }, { label: '建造中', value: 'building' }, { label: '已完成', value: 'completed' }, { label: '阻塞', value: 'blocked' }, { label: '取消', value: 'cancelled' }]} />
            <Button danger size="small" onClick={() => removeConstructionItem(index)}>移除</Button>
          </Flex>
        ))}
        <Flex gap={8} wrap>
          <Select className="strategic-command-modal__queue-building" placeholder="選擇建築" value={queueBuildingType || undefined} onChange={setQueueBuildingType} options={buildingCatalog.filter((building) => building.type !== 'board').map((building) => ({ label: `${building.name}（${building.constructionCost} 建料）`, value: building.type }))} />
          <InputNumber min={0} max={100} value={queuePriority} onChange={(value) => value !== null && setQueuePriority(value)} />
          <Button onClick={addConstructionItem}>加入佇列</Button>
        </Flex>
      </Flex>
      <Button onClick={savePlan}>保存建設方針</Button>

      <div className="strategic-command-modal__message" aria-live="polite">
        {message && <Typography.Text type={message.includes('失敗') ? 'danger' : 'success'}>{message}</Typography.Text>}
      </div>
    </Flex>
  )
}

export default StrategicCommandModal
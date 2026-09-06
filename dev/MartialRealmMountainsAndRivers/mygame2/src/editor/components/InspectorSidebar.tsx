import { Checkbox, Empty, Input, InputNumber, Select, Switch, Typography, Flex, Button, message } from 'antd'
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import type { Position } from '../../game/types'
import type { MartialSchoolId } from '../../game/catalogs/martialSchoolCatalog'
import type { CreatureBehaviorType } from '../../game/rules/creatureBehaviorRules'
import type { ScenarioEntityPlacement } from '../editorTypes'
import { SCHOOL_OPTIONS, BEHAVIOR_OPTIONS, POLICY_OPTIONS, EVENT_TYPE_OPTIONS, LOOT_ITEM_OPTIONS, INNER_SKILL_OPTIONS, EXTERNAL_SKILL_OPTIONS, ATTRIBUTE_FIELDS, BUILDING_OPTIONS, DEFENSE_STRUCTURE_OPTIONS, AI_TYPE_OPTIONS, AI_PERSONALITY_OPTIONS } from '../editorOptions'

type InspectorSidebarProps = {
  selectedEntity: ScenarioEntityPlacement | null
  onUpdateEntity: (entityId: string, data: Record<string, unknown>) => void
  /** 開啟自定義事件編輯器（僅事件實體）。 */
  onEditCustomEvent?: (entityId: string) => void
  /** 場景中所有據點實體（供資源點指定所屬據點）。 */
  bases?: ScenarioEntityPlacement[]
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8 }}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>{label}</Typography.Text>
      <div style={{ marginTop: 2 }}>{children}</div>
    </div>
  )
}

function CreatureInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const name = (data.name as string) ?? '怪物'
  const level = (data.level as number) ?? 1
  const schoolId = (data.schoolId as MartialSchoolId) ?? 'void-spirit'
  const behaviorType = (data.behaviorType as CreatureBehaviorType) ?? 'roamer'
  const isBoss = (data.isBoss as boolean) ?? false
  const spawnOnLoad = (data.spawnOnLoad as boolean | undefined) ?? true
  const aggroRange = (data.aggroRange as number) ?? 2
  const maxHealthOverride = (data.maxHealthOverride as number | undefined) ?? undefined
  const dropRate = (data.dropRate as number | undefined) ?? undefined
  const customDrops = (data.customDrops as Array<{ lootId: string; chance: number }> | undefined) ?? []
  const attributes = (data.attributes as Record<string, number> | undefined) ?? {}
  const innerSkillId = (data.innerSkillId as string | undefined) ?? undefined
  const equippedExternalSkillIds = (data.equippedExternalSkillIds as string[] | undefined) ?? []

  const handleAddDrop = () => {
    onUpdate({ customDrops: [...customDrops, { lootId: '', chance: 100 }] })
  }
  const handleRemoveDrop = (index: number) => {
    onUpdate({ customDrops: customDrops.filter((_, i) => i !== index) })
  }
  const handleUpdateDrop = (index: number, field: 'lootId' | 'chance', value: string | number) => {
    const next = customDrops.map((drop, i) => i === index ? { ...drop, [field]: value } : drop)
    onUpdate({ customDrops: next })
  }

  return (
    <>
      <Field label="名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
      <Field label="開局生成">
        <Switch checked={spawnOnLoad} size="small" onChange={(checked) => onUpdate({ spawnOnLoad: checked })} />
      </Field>
      <Field label="首領標記（Boss）">
        <Switch checked={isBoss} size="small" onChange={(checked) => onUpdate({ isBoss: checked })} />
      </Field>
      <Field label="等級">
        <InputNumber min={1} max={20} value={level} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ level: value })} />
      </Field>
      <Field label="五行流派">
        <Select value={schoolId} size="small" style={{ width: '100%' }} options={SCHOOL_OPTIONS} onChange={(value) => onUpdate({ schoolId: value })} />
      </Field>
      <Field label="行為模式">
        <Select value={behaviorType} size="small" style={{ width: '100%' }} options={BEHAVIOR_OPTIONS} onChange={(value) => onUpdate({ behaviorType: value })} />
      </Field>
      <Field label="警戒範圍">
        <InputNumber min={1} max={10} value={aggroRange} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ aggroRange: value })} />
      </Field>
      <Field label="血量上限覆寫（留空=自動）">
        <InputNumber min={1} max={9999} value={maxHealthOverride} size="small" style={{ width: '100%' }} placeholder="自動" onChange={(value) => onUpdate({ maxHealthOverride: value ?? undefined })} />
      </Field>
      <Field label="五維屬性（留空=依等級自動）">
        <Flex vertical gap={4}>
          {ATTRIBUTE_FIELDS.map((attr) => (
            <Flex key={attr.key} gap={8} align="center">
              <Typography.Text style={{ fontSize: 12, width: 40 }}>{attr.label}</Typography.Text>
              <InputNumber
                min={1}
                max={99}
                value={attributes[attr.key]}
                size="small"
                style={{ flex: 1 }}
                placeholder="自動"
                onChange={(value) => {
                  const next = { ...attributes }
                  if (value === null || value === undefined) {
                    delete next[attr.key]
                  } else {
                    next[attr.key] = value
                  }
                  onUpdate({ attributes: next })
                }}
              />
            </Flex>
          ))}
        </Flex>
      </Field>
      <Field label="內功（留空=依流派自動）">
        <Select
          value={innerSkillId || undefined}
          size="small"
          style={{ width: '100%' }}
          placeholder="自動"
          allowClear
          options={INNER_SKILL_OPTIONS}
          onChange={(value) => onUpdate({ innerSkillId: value ?? undefined })}
        />
      </Field>
      <Field label="裝備外功清單">
        <Flex vertical gap={4}>
          {equippedExternalSkillIds.map((skillId, index) => (
            <Flex key={index} gap={4} align="center">
              <Select
                value={skillId || undefined}
                size="small"
                style={{ flex: 1 }}
                placeholder="選擇外功"
                options={EXTERNAL_SKILL_OPTIONS}
                onChange={(value) => {
                  const next = equippedExternalSkillIds.map((id, i) => i === index ? value : id)
                  onUpdate({ equippedExternalSkillIds: next })
                }}
              />
              <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => {
                onUpdate({ equippedExternalSkillIds: equippedExternalSkillIds.filter((_, i) => i !== index) })
              }} />
            </Flex>
          ))}
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => {
            onUpdate({ equippedExternalSkillIds: [...equippedExternalSkillIds, ''] })
          }}>新增外功</Button>
        </Flex>
      </Field>
      <Field label="掉落機率覆寫（留空=預設20%）">
        <InputNumber min={0} max={100} value={dropRate} size="small" style={{ width: '100%' }} placeholder="20" onChange={(value) => onUpdate({ dropRate: value ?? undefined })} />
      </Field>
      <Field label="自訂掉落物清單">
        <Flex vertical gap={4}>
          {customDrops.map((drop, index) => (
            <Flex key={index} gap={4} align="center">
              <Select
                value={drop.lootId || undefined}
                size="small"
                style={{ flex: 1 }}
                placeholder="選擇掉落物"
                options={LOOT_ITEM_OPTIONS}
                onChange={(value) => handleUpdateDrop(index, 'lootId', value)}
              />
              <InputNumber
                min={1}
                max={100}
                value={drop.chance}
                size="small"
                style={{ width: 60 }}
                addonAfter="%"
                onChange={(value) => value && handleUpdateDrop(index, 'chance', value)}
              />
              <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => handleRemoveDrop(index)} />
            </Flex>
          ))}
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddDrop}>新增掉落物</Button>
        </Flex>
      </Field>
    </>
  )
}

function BaseInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const name = (data.name as string) ?? '據點'
  const health = (data.health as number) ?? 150
  const maxHealth = (data.maxHealth as number) ?? 150
  const buildingMaterials = (data.buildingMaterials as number) ?? 30
  const policyId = (data.policyId as string) ?? 'basic'
  const spawnOnLoad = (data.spawnOnLoad as boolean | undefined) ?? true
  const presetBuildings = (data.presetBuildings as Array<{ type: string; level: number }> | undefined) ?? []
  const allowedBuildings = (data.allowedBuildings as Array<{ type: string; maxLevel?: number }> | undefined) ?? []

  const handleAddBuilding = () => {
    onUpdate({ presetBuildings: [...presetBuildings, { type: 'board', level: 1 }] })
  }
  const handleRemoveBuilding = (index: number) => {
    onUpdate({ presetBuildings: presetBuildings.filter((_, i) => i !== index) })
  }
  const handleUpdateBuilding = (index: number, field: 'type' | 'level', value: string | number) => {
    const next = presetBuildings.map((b, i) => i === index ? { ...b, [field]: value } : b)
    onUpdate({ presetBuildings: next })
  }

  const handleAddAllowed = () => {
    onUpdate({ allowedBuildings: [...allowedBuildings, { type: 'board' }] })
  }
  const handleRemoveAllowed = (index: number) => {
    onUpdate({ allowedBuildings: allowedBuildings.filter((_, i) => i !== index) })
  }
  const handleUpdateAllowed = (index: number, field: 'type' | 'maxLevel', value: string | number | undefined) => {
    const next = allowedBuildings.map((b, i) => i === index ? { ...b, [field]: value } : b)
    onUpdate({ allowedBuildings: next })
  }

  return (
    <>
      <Field label="開局生成">
        <Switch checked={spawnOnLoad} size="small" onChange={(checked) => onUpdate({ spawnOnLoad: checked })} />
      </Field>
      <Field label="據點名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
      <Field label="初始生命值">
        <InputNumber min={1} max={9999} value={health} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ health: value })} />
      </Field>
      <Field label="最大生命值">
        <InputNumber min={1} max={9999} value={maxHealth} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ maxHealth: value })} />
      </Field>
      <Field label="初始建料">
        <InputNumber min={0} max={9999} value={buildingMaterials} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ buildingMaterials: value })} />
      </Field>
      <Field label="初始政策">
        <Select value={policyId} size="small" style={{ width: '100%' }} options={POLICY_OPTIONS} onChange={(value) => onUpdate({ policyId: value })} />
      </Field>
      <Field label="預建建築清單">
        <Flex vertical gap={4}>
          {presetBuildings.map((building, index) => (
            <Flex key={index} gap={4} align="center">
              <Select
                value={building.type}
                size="small"
                style={{ flex: 1 }}
                options={BUILDING_OPTIONS}
                onChange={(value) => handleUpdateBuilding(index, 'type', value)}
              />
              <Select
                value={building.level}
                size="small"
                style={{ width: 70 }}
                options={[
                  { value: 1, label: 'Lv.1' },
                  { value: 2, label: 'Lv.2' },
                  { value: 3, label: 'Lv.3' },
                ]}
                onChange={(value) => handleUpdateBuilding(index, 'level', value)}
              />
              <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => handleRemoveBuilding(index)} />
            </Flex>
          ))}
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddBuilding}>新增建築</Button>
        </Flex>
      </Field>
      <Field label="允許建築（留空=無限制）">
        <Flex vertical gap={4}>
          {allowedBuildings.map((entry, index) => (
            <Flex key={index} gap={4} align="center">
              <Select
                value={entry.type}
                size="small"
                style={{ flex: 1 }}
                options={BUILDING_OPTIONS}
                onChange={(value) => handleUpdateAllowed(index, 'type', value)}
              />
              <Select
                value={entry.maxLevel}
                size="small"
                style={{ width: 90 }}
                placeholder="最高級"
                allowClear
                options={[
                  { value: 1, label: 'Lv.1' },
                  { value: 2, label: 'Lv.2' },
                  { value: 3, label: 'Lv.3' },
                ]}
                onChange={(value) => handleUpdateAllowed(index, 'maxLevel', value)}
              />
              <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => handleRemoveAllowed(index)} />
            </Flex>
          ))}
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddAllowed}>新增允許建築</Button>
        </Flex>
      </Field>
    </>
  )
}

function PlayerInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const name = (data.name as string) ?? '玩家'
  const isAI = (data.isAI as boolean | undefined) ?? false
  const aiType = (data.aiType as string | undefined) ?? 'fuzzy'
  const aiPersonality = (data.aiPersonality as string | undefined) ?? 'balanced'
  /** 是否觸發互動（探索點／道具點／區域觸發等）。預設 true。 */
  const canTriggerInteraction = (data.canTriggerInteraction as boolean | undefined) ?? true
  const schoolId = (data.schoolId as MartialSchoolId) ?? 'void-spirit'
  const money = (data.money as number) ?? 30
  // 用預設值填補缺少的欄位，避免只調整部分欄位時，未調整欄位剩下 undefined。
  const attributes = { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8, ...((data.attributes as Record<string, number> | undefined) ?? {}) }
  const innerSkillId = (data.innerSkillId as string | undefined) ?? 'tuna-gong'
  const externalSkillIds = (data.externalSkillIds as string[] | undefined) ?? []

  /**
   * 設定內功：同步維護 `innerSkillId`（裝備中）與 `innerSkillIds`（已知清單）。
   * 編譯器以 `innerSkillIds` 為功法頁顯示來源，若只寫 `innerSkillId` 而清單未含，
   * 遊戲內功法頁會看不到該內功。
   */
  const handleSetInnerSkill = (value: string) => {
    const knownIds = (data.innerSkillIds as string[] | undefined) ?? ['tuna-gong']
    const next = knownIds.includes(value) ? knownIds : [...knownIds, value]
    onUpdate({ innerSkillId: value, innerSkillIds: next })
  }

  /** 同步外功：`externalSkillIds`（已知清單）與 `equippedExternalSkillIds`（裝備中）保持一致。 */
  const syncExternalSkills = (next: string[]) => {
    const cleaned = next.filter(Boolean)
    onUpdate({ externalSkillIds: next, equippedExternalSkillIds: cleaned })
  }

  const handleAddExternalSkill = () => {
    syncExternalSkills([...externalSkillIds, ''])
  }
  const handleRemoveExternalSkill = (index: number) => {
    syncExternalSkills(externalSkillIds.filter((_, i) => i !== index))
  }
  const handleUpdateExternalSkill = (index: number, value: string) => {
    syncExternalSkills(externalSkillIds.map((id, i) => i === index ? value : id))
  }

  return (
    <>
      <Field label="玩家名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
      <Field label="玩家控制">
        <Checkbox checked={isAI} onChange={(e) => onUpdate({ isAI: e.target.checked })}>AI 玩家</Checkbox>
      {isAI && (
        <Field label="AI 類型">
          <Select
            value={aiType}
            size="small"
            style={{ width: '100%' }}
            options={AI_TYPE_OPTIONS}
            onChange={(value) => onUpdate({ aiType: value })}
          />
        </Field>
      )}
      {isAI && (
        <Field label="AI 個性">
          <Select
            value={aiPersonality}
            size="small"
            style={{ width: '100%' }}
            options={AI_PERSONALITY_OPTIONS}
            onChange={(value) => onUpdate({ aiPersonality: value })}
          />
        </Field>
      )}
      {isAI && (
        <Field label="觸發互動">
          <Checkbox
            checked={canTriggerInteraction}
            onChange={(e) => onUpdate({ canTriggerInteraction: e.target.checked })}
          >
            此角色會觸發探索／道具／區域互動
          </Checkbox>
        </Field>
      )}
      </Field>
      <Field label="五行流派">
        <Select value={schoolId} size="small" style={{ width: '100%' }} options={SCHOOL_OPTIONS} onChange={(value) => onUpdate({ schoolId: value })} />
      </Field>
      <Field label="初始金錢">
        <InputNumber min={0} max={9999} value={money} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ money: value })} />
      </Field>
      <Field label="五維屬性">
        <Flex vertical gap={4}>
          {ATTRIBUTE_FIELDS.map((attr) => (
            <Flex key={attr.key} gap={8} align="center">
              <Typography.Text style={{ fontSize: 12, width: 40 }}>{attr.label}</Typography.Text>
              <InputNumber
                min={1}
                max={99}
                value={attributes[attr.key] ?? 8}
                size="small"
                style={{ flex: 1 }}
                onChange={(value) => onUpdate({ attributes: { ...attributes, [attr.key]: value ?? 8 } })}
              />
            </Flex>
          ))}
        </Flex>
      </Field>
      <Field label="內功">
        <Select
          value={innerSkillId}
          size="small"
          style={{ width: '100%' }}
          options={INNER_SKILL_OPTIONS}
          onChange={handleSetInnerSkill}
        />
      </Field>
      <Field label="外功清單">
        <Flex vertical gap={4}>
          {externalSkillIds.map((skillId, index) => (
            <Flex key={index} gap={4} align="center">
              <Select
                value={skillId || undefined}
                size="small"
                style={{ flex: 1 }}
                placeholder="選擇外功"
                options={EXTERNAL_SKILL_OPTIONS}
                onChange={(value) => handleUpdateExternalSkill(index, value)}
              />
              <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => handleRemoveExternalSkill(index)} />
            </Flex>
          ))}
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddExternalSkill}>新增外功</Button>
        </Flex>
      </Field>
    </>
  )
}

function NestInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const schoolId = (data.schoolId as MartialSchoolId) ?? 'void-spirit'
  const behaviorType = (data.behaviorType as CreatureBehaviorType) ?? 'scavenger'
  const spawnLevel = (data.spawnLevel as number) ?? 1
  const spawnOnLoad = (data.spawnOnLoad as boolean | undefined) ?? true

  return (
    <>
      <Field label="開局生成">
        <Switch checked={spawnOnLoad} size="small" onChange={(checked) => onUpdate({ spawnOnLoad: checked })} />
      </Field>
      <Field label="五行流派">
        <Select value={schoolId} size="small" style={{ width: '100%' }} options={SCHOOL_OPTIONS} onChange={(value) => onUpdate({ schoolId: value })} />
      </Field>
      <Field label="行為模式">
        <Select value={behaviorType} size="small" style={{ width: '100%' }} options={BEHAVIOR_OPTIONS} onChange={(value) => onUpdate({ behaviorType: value })} />
      </Field>
      <Field label="生成怪物等級">
        <InputNumber min={1} max={10} value={spawnLevel} size="small" style={{ width: '100%' }} onChange={(value) => value && onUpdate({ spawnLevel: value })} />
      </Field>
    </>
  )
}

function SectGateInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const schoolId = (data.schoolId as MartialSchoolId) ?? 'void-spirit'
  const level = (data.level as 1 | 2 | 3) ?? 1

  return (
    <>
      <Field label="門派流派">
        <Select value={schoolId} size="small" style={{ width: '100%' }} options={SCHOOL_OPTIONS} onChange={(value) => onUpdate({ schoolId: value })} />
      </Field>
      <Field label="據點等級">
        <Select value={level} size="small" style={{ width: '100%' }} options={[
          { value: 1, label: 'Lv.1（內功）' },
          { value: 2, label: 'Lv.2（內功+傷害外功）' },
          { value: 3, label: 'Lv.3（全功法）' },
        ]} onChange={(value) => onUpdate({ level: value })} />
      </Field>
    </>
  )
}

function RuinInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const name = (data.name as string) ?? '廢墟'
  const status = (data.status as 'intact' | 'reconstructed') ?? 'intact'

  return (
    <>
      <Field label="廢墟名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
      <Field label="狀態">
        <Select value={status} size="small" style={{ width: '100%' }} options={[
          { value: 'intact', label: '完整（可修復）' },
          { value: 'reconstructed', label: '已修復' },
        ]} onChange={(value) => onUpdate({ status: value })} />
      </Field>
    </>
  )
}

/** 資源點屬性檢視器：可指定名稱與所屬據點。 */
function ResourcePointInspector({ entity, onUpdate, bases }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void; bases: ScenarioEntityPlacement[] }) {
  const data = entity.data
  const name = (data.name as string) ?? '資源點'
  const ownerBaseId = (data.ownerBaseId as string) ?? ''
  const materialIncome = (data.materialIncome as number) ?? 10

  const baseOptions = bases.map((base) => ({
    value: base.id,
    label: `${(base.data.name as string) ?? '據點'}（${base.id}）`,
  }))

  return (
    <>
      <Field label="名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
      <Field label="所屬據點">
        <Select
          value={ownerBaseId || undefined}
          size="small"
          style={{ width: '100%' }}
          placeholder="選擇所屬據點"
          allowClear
          options={baseOptions}
          onChange={(value) => onUpdate({ ownerBaseId: value ?? '' })}
        />
      </Field>
      <Field label="每回合產出建料">
        <InputNumber min={0} max={999} value={materialIncome} size="small" style={{ width: '100%' }} onChange={(value) => onUpdate({ materialIncome: value ?? 10 })} />
      </Field>
    </>
  )
}

/** 道具點屬性檢視器：可指定掉落多個道具。 */
function ItemPointInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const name = (data.name as string) ?? '道具點'
  const customDrops = (data.customDrops as Array<{ lootId: string; chance: number }> | undefined) ?? []
  const eatableByCreatures = (data.eatableByCreatures as boolean | undefined) ?? false

  const handleAddDrop = () => {
    onUpdate({ customDrops: [...customDrops, { lootId: '', chance: 100 }] })
  }
  const handleRemoveDrop = (index: number) => {
    onUpdate({ customDrops: customDrops.filter((_, i) => i !== index) })
  }
  const handleUpdateDrop = (index: number, field: 'lootId' | 'chance', value: string | number) => {
    const next = customDrops.map((drop, i) => i === index ? { ...drop, [field]: value } : drop)
    onUpdate({ customDrops: next })
  }

  return (
    <>
      <Field label="名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
      <Field label="可被敵人生吃（關閉時不會被怪物吃掉）">
        <Switch checked={eatableByCreatures} size="small" onChange={(checked) => onUpdate({ eatableByCreatures: checked })} />
      </Field>
      <Field label="自訂掉落物清單（留空=依地形隨機）">
        <Flex vertical gap={4}>
          {customDrops.map((drop, index) => (
            <Flex key={index} gap={4} align="center">
              <Select
                value={drop.lootId || undefined}
                size="small"
                style={{ flex: 1 }}
                placeholder="選擇掉落物"
                options={LOOT_ITEM_OPTIONS}
                onChange={(value) => handleUpdateDrop(index, 'lootId', value)}
              />
              <InputNumber
                min={1}
                max={100}
                value={drop.chance}
                size="small"
                style={{ width: 60 }}
                addonAfter="%"
                onChange={(value) => value && handleUpdateDrop(index, 'chance', value)}
              />
              <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => handleRemoveDrop(index)} />
            </Flex>
          ))}
          <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={handleAddDrop}>新增掉落物</Button>
        </Flex>
      </Field>
    </>
  )
}

function EventInspector({ entity, onUpdate, onEditCustomEvent }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void; onEditCustomEvent?: () => void }) {
  const data = entity.data
  const isCustom = data.type === 'custom'
  const eventType = (data.eventType as string) ?? 'wandering-merchant'
  const spawnOnLoad = (data.spawnOnLoad as boolean | undefined) ?? true
  const eatableByCreatures = (data.eatableByCreatures as boolean | undefined) ?? false
  return (
    <>
      <Field label="開局生成">
        <Switch checked={spawnOnLoad} size="small" onChange={(checked) => onUpdate({ spawnOnLoad: checked })} />
      </Field>
      <Field label="可被敵人生吃（關閉時不會被怪物吃掉）">
        <Switch checked={eatableByCreatures} size="small" onChange={(checked) => onUpdate({ eatableByCreatures: checked })} />
      </Field>
      <Field label="事件模式">
        <Select
          value={isCustom ? 'custom' : 'existing'}
          size="small"
          style={{ width: '100%' }}
          options={[
            { value: 'existing', label: '既有事件' },
            { value: 'custom', label: '自定義事件' },
          ]}
          onChange={(value) => {
            if (value === 'custom') {
              onUpdate({
                type: 'custom',
                name: '自定義事件',
                description: '',
                icon: '🗨️',
                choices: [],
              })
            } else {
              onUpdate({ type: undefined, eventType: 'wandering-merchant' })
            }
          }}
        />
      </Field>
      {isCustom ? (
        <Field label="自定義事件">
          <Button size="small" type="primary" block onClick={onEditCustomEvent}>
            編輯自定義事件
          </Button>
        </Field>
      ) : (
        <Field label="事件類型">
          <Select value={eventType} size="small" style={{ width: '100%' }} options={EVENT_TYPE_OPTIONS} onChange={(value) => onUpdate({ eventType: value })} />
        </Field>
      )}
    </>
  )
}

/** 防禦設施屬性檢視器：可選擇防禦建築類型。 */
function DefenseStructureInspector({ entity, onUpdate }: { entity: ScenarioEntityPlacement; onUpdate: (data: Record<string, unknown>) => void }) {
  const data = entity.data
  const type = (data.type as string) ?? 'barricade'
  const name = (data.name as string) ?? '防禦設施'

  return (
    <>
      <Field label="防禦建築類型">
        <Select
          value={type}
          size="small"
          style={{ width: '100%' }}
          options={DEFENSE_STRUCTURE_OPTIONS}
          onChange={(value) => onUpdate({ type: value })}
        />
      </Field>
      <Field label="名稱">
        <Input value={name} size="small" onChange={(e) => onUpdate({ name: e.target.value })} />
      </Field>
    </>
  )
}

function InspectorSidebar({ selectedEntity, onUpdateEntity, onEditCustomEvent, bases = [] }: InspectorSidebarProps) {
  if (!selectedEntity) {
    return (
      <div style={{ padding: 16, minWidth: 240, maxHeight: '100%', overflowY: 'auto', background: '#fff' }}>
        <Empty description="選取地圖上的物件以編輯屬性" />
      </div>
    )
  }

  const { id, kind, position } = selectedEntity
  const pos = position as Position
  const handleUpdate = (data: Record<string, unknown>) => onUpdateEntity(id, data)

  const renderInspector = () => {
    switch (kind) {
      case 'creature': return <CreatureInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'base': return <BaseInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'player': return <PlayerInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'nest': return <NestInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'sectGate': return <SectGateInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'ruin': return <RuinInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'resourcePoint': return <ResourcePointInspector entity={selectedEntity} onUpdate={handleUpdate} bases={bases} />
      case 'itemPoint': return <ItemPointInspector entity={selectedEntity} onUpdate={handleUpdate} />
      case 'event': return <EventInspector entity={selectedEntity} onUpdate={handleUpdate} onEditCustomEvent={() => onEditCustomEvent?.(id)} />
      case 'defenseStructure': return <DefenseStructureInspector entity={selectedEntity} onUpdate={handleUpdate} />
      default: return null
    }
  }

  return (
    <div style={{ padding: 16, minWidth: 240, maxHeight: '100%', overflowY: 'auto', background: '#fff' }}>
      <Typography.Text strong>📋 屬性檢視器</Typography.Text>
      <Field label="類型">{kind}</Field>
      <Field label="ID">
        <Flex gap={6} align="center">
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{id}</span>
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard?.writeText(id)
              message.success(`已複製 ID：${id}`)
            }}
          />
        </Flex>
      </Field>
      <Field label="位置">({pos.row}, {pos.column})</Field>
      <div style={{ marginTop: 12, marginBottom: 8, borderBottom: '1px solid #f0f0f0' }} />
      <Flex vertical gap={0}>
        {renderInspector()}
      </Flex>
    </div>
  )
}

export default InspectorSidebar

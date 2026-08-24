import { Button, Flex, List, Modal, Space, Tag, Typography } from 'antd'
import { getActivePolicyId, POLICY_SWITCH_COOLDOWN } from '../game/rules/policyRules'
import type { BaseState } from '../game/types'
import type { GovernancePolicyId } from '../game/catalogs/governancePolicyCatalog'
import { governancePolicyCatalog } from '../game/catalogs/governancePolicyCatalog'

type PolicySwitchModalProps = {
  base: BaseState | null
  availablePolicies: GovernancePolicyId[]
  /** 目前的回合數，用於計算政策切換冷卻。 */
  currentRound: number
  onSwitch: (policyId: GovernancePolicyId) => void
  onClose: () => void
}

function PolicySwitchModal({ base, availablePolicies, currentRound, onSwitch, onClose }: PolicySwitchModalProps) {
  const activePolicyId = base ? getActivePolicyId(base) : 'basic'

  // 政策切換冷卻剩餘回合（0 表示可切換）。
  const lastSwitchRound = base?.lastPolicySwitchRound
  const cooldownRemaining = lastSwitchRound !== undefined
    ? Math.max(0, POLICY_SWITCH_COOLDOWN - (currentRound - lastSwitchRound))
    : 0

  return (
    <Modal
      title={base ? `${base.name} · 切換政策` : '切換政策'}
      open={base !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {base && (
        <Flex vertical gap={12}>
          <Typography.Text>
            目前政策：<Tag color="blue">{governancePolicyCatalog.find((p) => p.id === activePolicyId)?.name}</Tag>
          </Typography.Text>
          {cooldownRemaining > 0 && (
            <Typography.Text type="warning">
              政策切換冷卻中，還需等待 {cooldownRemaining} 回合才能再次切換。
            </Typography.Text>
          )}
          <List
            dataSource={governancePolicyCatalog}
            renderItem={(policy) => {
              const isActive = policy.id === activePolicyId
              const isUnlocked = availablePolicies.includes(policy.id)
              const disabled = isActive || !isUnlocked || cooldownRemaining > 0
              return (
                <List.Item
                  actions={[
                    <Button
                      key="switch"
                      type="primary"
                      disabled={disabled}
                      onClick={() => onSwitch(policy.id)}
                    >
                      {isActive ? '啟用中' : cooldownRemaining > 0 ? `冷卻 ${cooldownRemaining}` : '切換'}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<Space>{policy.name}{!isUnlocked && <Tag>未解鎖</Tag>}</Space>}
                    description={policy.description}
                  />
                </List.Item>
              )
            }}
          />
        </Flex>
      )}
    </Modal>
  )
}

export default PolicySwitchModal

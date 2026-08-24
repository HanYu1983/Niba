import { useState } from 'react'
import { Button, Flex, InputNumber, Modal, Select, Tag, Tooltip, Typography } from 'antd'
import {
    getAvailablePolicyIds,
    getPolicyDefinition,
} from '../game/rules/governanceRules'
import { getActivePolicyId, getPolicyName, POLICY_SWITCH_COOLDOWN } from '../game/rules/policyRules'
import { MATERIAL_TRANSFER_LOSS_RATE } from '../game/rules/regionalManagementRules'
import { governancePolicyCatalog } from '../game/catalogs/governancePolicyCatalog'
import type { GovernancePolicyId } from '../game/catalogs/governancePolicyCatalog'
import type { PlayerState, BaseState } from '../game/types'

type RegionalManagementModalProps = {
    player: PlayerState | null
    bases: BaseState[]
    open: boolean
    /** 目前的回合數，用於計算政策切換冷卻。 */
    currentRound: number
    onSwitchPolicy: (targetBaseId: string, policyId: GovernancePolicyId) => void
    onTransferMaterials: (sourceBaseId: string, targetBaseId: string, amount: number) => void
    onClose: () => void
}

function RegionalManagementModal({
    player,
    bases,
    open,
    currentRound,
    onSwitchPolicy,
    onTransferMaterials,
    onClose,
}: RegionalManagementModalProps) {
    const [selectedBaseId, setSelectedBaseId] = useState<string | undefined>(bases[0]?.id)
    const [policyId, setPolicyId] = useState<GovernancePolicyId>('economic')
    const [sourceBaseId, setSourceBaseId] = useState<string | undefined>(bases[0]?.id)
    const [targetBaseId, setTargetBaseId] = useState<string | undefined>(bases[1]?.id)
    const [amount, setAmount] = useState(10)

    const selectedBase = bases.find((b) => b.id === selectedBaseId)

    const lastSwitchRound = selectedBase?.lastPolicySwitchRound
    const cooldownRemaining = lastSwitchRound !== undefined
        ? Math.max(0, POLICY_SWITCH_COOLDOWN - (currentRound - lastSwitchRound))
        : 0

    return (
        <Modal
            title="總管府 · 區域治理"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <Flex vertical gap={16}>
                <Typography.Text type="secondary">
                    管理所有據點的政策與建料調度。
                </Typography.Text>

                <Flex vertical gap={8}>
                    <Typography.Text strong>政策管理</Typography.Text>
                    <Flex vertical gap={8}>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedBaseId}
                            onChange={setSelectedBaseId}
                            options={bases.map((b) => ({ label: b.name, value: b.id }))}
                        />
                        {selectedBase && (
                            <Flex wrap gap={8} align="center">
                                <Tooltip title={getPolicyDefinition(getActivePolicyId(selectedBase))?.description}>
                                    <Tag color="blue">目前：{getPolicyName(getActivePolicyId(selectedBase))}</Tag>
                                </Tooltip>
                                {cooldownRemaining > 0 && (
                                    <Tag color="warning">冷卻 {cooldownRemaining} 回合</Tag>
                                )}
                                <Select
                                    style={{ width: 140 }}
                                    value={policyId}
                                    onChange={(value) => setPolicyId(value as GovernancePolicyId)}
                                    options={governancePolicyCatalog.map((p) => ({ label: p.name, value: p.id }))}
                                />
                                <Button
                                    type="primary"
                                    disabled={!player || !getAvailablePolicyIds(player).includes(policyId) || cooldownRemaining > 0}
                                    onClick={() => onSwitchPolicy(selectedBase.id, policyId)}
                                >
                                    切換政策
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                </Flex>

                <Flex vertical gap={8}>
                    <Typography.Text strong>建料調度</Typography.Text>
                    <Typography.Text type="secondary">
                        損耗率 {Math.round(MATERIAL_TRANSFER_LOSS_RATE * 100)}%
                    </Typography.Text>
                    <Flex vertical gap={8}>
                        <Flex wrap gap={8} align="center">
                            <Select
                                style={{ width: 150 }}
                                value={sourceBaseId}
                                onChange={setSourceBaseId}
                                options={bases.map((b) => ({ label: `${b.name}（${b.buildingMaterials}）`, value: b.id }))}
                            />
                            <Typography.Text>→</Typography.Text>
                            <Select
                                style={{ width: 150 }}
                                value={targetBaseId}
                                onChange={setTargetBaseId}
                                options={bases.map((b) => ({ label: b.name, value: b.id }))}
                            />
                            <InputNumber min={1} value={amount} onChange={(value) => setAmount(value ?? 1)} />
                            <Button
                                type="primary"
                                disabled={!sourceBaseId || !targetBaseId || sourceBaseId === targetBaseId}
                                onClick={() => sourceBaseId && targetBaseId && onTransferMaterials(sourceBaseId, targetBaseId, amount)}
                            >
                                調度
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Modal>
    )
}

export default RegionalManagementModal

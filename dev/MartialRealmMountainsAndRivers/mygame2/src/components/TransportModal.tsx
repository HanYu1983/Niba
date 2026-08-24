import { Button, Flex, List, Modal, Tag, Typography } from 'antd'
import { WAYSTATION_TRANSPORT_COST, SMALL_WAYSTATION_TRANSPORT_COST, type TransportTarget } from '../game/rules/transportRules'
import type { PlayerState } from '../game/types'

type TransportModalProps = {
  player: PlayerState | null
  open: boolean
  title: string
  isSmallWaystation: boolean
  targets: TransportTarget[]
  onTransport: (targetId: string) => void
  onClose: () => void
}

function TransportModal({ player, open, title, isSmallWaystation, targets, onTransport, onClose }: TransportModalProps) {
  const cost = isSmallWaystation ? SMALL_WAYSTATION_TRANSPORT_COST : WAYSTATION_TRANSPORT_COST
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Flex vertical gap={12}>
        <Typography.Text>
          傳送費用：<Tag color="gold">{cost} 金錢</Tag>
          {'　'}目前金錢：<strong>{player?.money ?? 0}</strong>
        </Typography.Text>
        <Typography.Text type="secondary">
          {isSmallWaystation
            ? '小型驛站只能傳送至其他小型驛站。'
            : '從此據點前往任意其他據點或小型驛站。'}
        </Typography.Text>
        <List
          dataSource={targets}
          renderItem={(target) => {
            const canAfford = (player?.money ?? 0) >= cost
            return (
              <List.Item
                actions={[
                  <Button
                    key="transport"
                    type="primary"
                    disabled={!canAfford}
                    onClick={() => onTransport(target.id)}
                  >
                    傳送
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={target.name}
                  description={`${target.kind === 'small-waystation' ? '小型驛站' : '據點'} · 位置 (${target.position.row + 1}, ${target.position.column + 1})`}
                />
              </List.Item>
            )
          }}
        />
      </Flex>
    </Modal>
  )
}

export default TransportModal

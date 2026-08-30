import { Button, Flex, Modal, Typography } from 'antd'

type SystemCommandModalProps = {
  open: boolean
  onOpenSave: () => void
  onBackToMapSettings: () => void
  onOpenGameIntroduction: () => void
  onOpenStrategicCommand: () => void
  onClose: () => void
}

function SystemCommandModal({ open, onOpenSave, onBackToMapSettings, onOpenGameIntroduction, onOpenStrategicCommand, onClose }: SystemCommandModalProps) {
  return (
    <Modal
      title="系統指令"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnHidden
    >
      <Flex vertical gap={16}>
        <Typography.Text type="secondary">請選擇要執行的系統功能。</Typography.Text>
        <Button size="large" onClick={onOpenSave}>存檔管理</Button>
        {/* <Button size="large" onClick={onOpenStrategicCommand}>AI 戰略指揮</Button> */}
        <Button size="large" onClick={onBackToMapSettings}>回到地圖設定</Button>
        <Button size="large" onClick={onOpenGameIntroduction}>游戲介紹</Button>
      </Flex>
    </Modal>
  )
}

export default SystemCommandModal
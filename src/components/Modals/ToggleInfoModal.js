import { Checkbox, Flex, Modal } from '@mantine/core'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { useContext } from 'react'

const ToggleInfoModal = ({ isOpen, onClose }) => {
  const { layoutConfig, setLayoutConfig } = useContext(ConfigContext)

  const toggleInfo = (infoKey) => {
    setLayoutConfig((prev) => ({
      ...prev,
      hiddenInfo: prev.hiddenInfo.includes(infoKey)
        ? prev.hiddenInfo.filter((key) => key !== infoKey)
        : [...prev.hiddenInfo, infoKey],
    }))
  }

  return (
    <Modal
      opened={isOpen}
      centered
      title="Toggle Information"
      onClose={onClose}
    >
      <Flex direction="column" gap="sm">
        <Checkbox
          label="Hide viewer stats"
          checked={layoutConfig?.hiddenInfo?.includes('viewers')}
          onChange={(e) => {
            toggleInfo('viewers')
          }}
        />

        <Checkbox
          label="Hide net profit"
          checked={layoutConfig?.hiddenInfo?.includes('profit')}
          onChange={(e) => {
            toggleInfo('profit')
          }}
        />

        <Checkbox
          label="Hide fan balance"
          checked={layoutConfig?.hiddenInfo?.includes('fan_balance')}
          onChange={(e) => {
            toggleInfo('fan_balance')
          }}
        />

        <Checkbox
          label="Hide bank balance"
          checked={layoutConfig?.hiddenInfo?.includes('bank_balance')}
          onChange={(e) => {
            toggleInfo('bank_balance')
          }}
        />

        <Checkbox
          label="Hide livestream info"
          checked={layoutConfig?.hiddenInfo?.includes('livestream_info')}
          onChange={(e) => {
            toggleInfo('livestream_info')
          }}
        />

        <Checkbox
          label="Hide subathon info"
          checked={layoutConfig?.hiddenInfo?.includes('subathon')}
          onChange={(e) => {
            toggleInfo('subathon')
          }}
        />
      </Flex>
    </Modal>
  )
}

export default ToggleInfoModal

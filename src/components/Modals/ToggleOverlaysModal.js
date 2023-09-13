import { Checkbox, Divider, Flex, Modal } from '@mantine/core'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useContext } from 'react'

const ToggleOverlaysModal = ({ isOpen, onClose }) => {
  const { kv, updateKV } = useContext(LanyardContext)

  const isHidingClock = kv?.clock_visible === 'false'
  const isHidingLocationText = kv?.location_text_visible === 'false'
  const isHidingWeather = kv?.weather_visible === 'false'
  const isHidingNetProfit = kv?.net_profit_visible === 'false'
  const isHidingSubGoal = kv?.sub_goal_visible === 'false'

  const isHidingFanBalance = kv?.fan_balance_visible === 'false'
  const isHidingBankBalance = kv?.bank_balance_visible === 'false'

  return (
    <Modal title="Toggle Overlays" opened={isOpen} centered onClose={onClose}>
      <Flex direction="column" gap="sm">
        <Checkbox
          label="Hide clock"
          checked={isHidingClock}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('clock_visible', val ? 'false' : 'true')
          }}
        />
        <Checkbox
          label="Hide location text"
          checked={isHidingLocationText}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('location_text_visible', val ? 'false' : 'true')
          }}
        />
        <Checkbox
          label="Hide weather"
          checked={isHidingWeather}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('weather_visible', val ? 'false' : 'true')
          }}
        />
        <Checkbox
          label="Hide net profit"
          checked={isHidingNetProfit}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('net_profit_visible', val ? 'false' : 'true')
          }}
        />
        <Checkbox
          label="Hide sub goal"
          checked={isHidingSubGoal}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('sub_goal_visible', val ? 'false' : 'true')
          }}
        />

        <Divider />

        <Checkbox
          label="Hide fan balance"
          checked={isHidingFanBalance}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('fan_balance_visible', val ? 'false' : 'true')
          }}
        />
        <Checkbox
          label="Hide bank balance"
          checked={isHidingBankBalance}
          onChange={(e) => {
            const val = e.currentTarget.checked
            updateKV('bank_balance_visible', val ? 'false' : 'true')
          }}
        />
      </Flex>
    </Modal>
  )
}

export default ToggleOverlaysModal

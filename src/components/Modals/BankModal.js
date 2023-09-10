import {
  Button,
  Divider,
  Flex,
  Modal,
  Space,
  Text,
  TextInput,
} from '@mantine/core'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useCallback, useContext, useRef } from 'react'

const BankModal = ({ isOpen = false, onClose }) => {
  const { kv, updateKV } = useContext(LanyardContext)
  const bankInputRef = useRef(null)

  const updateFanBalance = useCallback(
    (amount) => {
      try {
        const value = kv?.fan_balance
        if (value === undefined) return

        const updatedValue = parseInt(value) + (parseInt(amount) || 0) * 100

        updateKV('fan_balance', updatedValue.toString())
      } catch (e) {
        console.log(e)
      }
    },
    [kv, updateKV]
  )

  const updateBankBalance = useCallback(
    (amount) => {
      try {
        const value = kv?.bank_balance
        if (value === undefined) return

        const updatedValue = parseInt(value) + (parseFloat(amount) || 0) * 100

        updateKV('bank_balance', updatedValue.toString())
        bankInputRef.current.value = ''
      } catch (e) {
        console.log(e)
      }
    },
    [kv, updateKV]
  )

  return (
    <Modal title="Bank" centered size="md" opened={isOpen} onClose={onClose}>
      <Flex direction="column" gap="md">
        <Text lh="2em">
          <b>Fan balance (in USD):</b>{' '}
          {(parseInt(kv?.fan_balance || 0) / 100)
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
            .replace('.00', '')}
        </Text>
        <Flex gap="md" justify="center">
          <Button color="red" size="md" onClick={() => updateFanBalance(-5)}>
            -$5
          </Button>
          <Button color="orange" size="md" onClick={() => updateFanBalance(-3)}>
            -$3
          </Button>
          <Space />
          <Button color="lime" size="md" onClick={() => updateFanBalance(3)}>
            +$3
          </Button>
          <Button color="green" size="md" onClick={() => updateFanBalance(5)}>
            +$5
          </Button>
        </Flex>

        <Divider />

        <Text lh="2em">
          <b>Bank balance (in USD):</b>{' '}
          {(parseInt(kv?.bank_balance || 0) / 100)
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
            .replace('.00', '')}
        </Text>
        <TextInput
          label={`Amount (USD)`}
          placeholder="Enter an amount"
          required
          style={{ width: '100%' }}
          ref={bankInputRef}
          data-autofocus
          inputMode="decimal"
        />
        <Button.Group>
          <Button
            fullWidth
            color="red"
            onClick={() => updateBankBalance(-bankInputRef.current.value)}
          >
            Subtract -
          </Button>
          <Button
            fullWidth
            color="green"
            onClick={() => updateBankBalance(bankInputRef.current.value)}
          >
            Add +
          </Button>
        </Button.Group>
      </Flex>
    </Modal>
  )
}

export default BankModal

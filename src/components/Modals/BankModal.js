/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import {
  Button,
  Divider,
  Flex,
  Modal,
  Space,
  Text,
  TextInput,
} from '@mantine/core'
import wretch from 'wretch'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useCallback, useContext, useRef } from 'react'
import CurrencySelect from './CurrencySelect'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { showNotification } from '@mantine/notifications'

const { REACT_APP_EXCHANGE_RATE_API_URL } = process.env

const BankModal = ({ isOpen = false, onClose }) => {
  const { kv, updateKV } = useContext(LanyardContext)
  const bankInputRef = useRef(null)
  const {
    currencyConfig = {
      currency: 'usd',
    },
  } = useContext(ConfigContext)

  const amountToUSD = useCallback(
    async (amount) => {
      try {
        const currency = currencyConfig?.currency?.toUpperCase()

        if (currency === 'USD') return parseFloat(amount)

        let usdConversionRate
        let convertedValue = 0

        await wretch(
          `${REACT_APP_EXCHANGE_RATE_API_URL}/v1/rates/${currencyConfig?.currency}`
        )
          .get()
          .json()
          .then((res) => {
            if (res) {
              try {
                usdConversionRate = parseFloat(
                  res?.data?.[currencyConfig?.currency]
                )
              } catch (err) {
                console.error("Couldn't parse the exchange rate response", err)
              }
            }
          })
          .catch(() => {
            showNotification({
              title: 'Error',
              message: 'There was an error getting the exchange rate',
              color: 'red',
            })
          })
          .finally(() => {
            let numericInput = bankInputRef.current.value
            numericInput = numericInput.replace(/[^0-9.]/g, '')

            if (isNaN(numericInput)) {
              throw new Error('Invalid input')
            }

            convertedValue = parseFloat(numericInput) / usdConversionRate
          })

        return convertedValue
      } catch (e) {
        console.log(e)
      }
    },
    [currencyConfig]
  )

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

  const toggleFanOverlay = useCallback(() => {
    try {
      const value = kv?.fan_balance_visible || 'false'

      const updatedValue = value === 'true' ? 'false' : 'true'

      updateKV('fan_balance_visible', updatedValue)
    } catch (e) {
      console.log(e)
    }
  }, [kv, updateKV])

  const toggleBankOverlay = useCallback(() => {
    try {
      const value = kv?.bank_balance_visible || 'false'

      const updatedValue = value === 'true' ? 'false' : 'true'

      updateKV('bank_balance_visible', updatedValue)
    } catch (e) {
      console.log(e)
    }
  }, [kv, updateKV])

  const isFanOverlayVisible = kv?.fan_balance_visible === 'true'
  const isBankOverlayVisible = kv?.bank_balance_visible === 'true'

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
          <CurrencySelect />
        </Text>
        <TextInput
          label={`Amount (${currencyConfig?.currency?.toUpperCase()})`}
          placeholder="Enter an amount"
          required
          style={{ width: '100%' }}
          ref={bankInputRef}
          data-autofocus
          inputMode="decimal"
        />
        <Space />
        <Button.Group>
          <Button
            fullWidth
            color="red"
            onClick={async () => {
              const usdValue = await amountToUSD(bankInputRef.current.value)
              console.log(usdValue)
              updateBankBalance(-usdValue)
            }}
          >
            Subtract -
          </Button>
          <Button
            fullWidth
            color="green"
            onClick={async () => {
              const usdValue = await amountToUSD(bankInputRef.current.value)
              updateBankBalance(usdValue)
            }}
          >
            Add +
          </Button>
        </Button.Group>

        <Divider />

        <Button.Group>
          <Button
            fullWidth
            color={isFanOverlayVisible ? 'green' : 'blue'}
            variant={isFanOverlayVisible ? 'light' : 'filled'}
            onClick={toggleFanOverlay}
          >
            {isFanOverlayVisible ? 'Hide fan overlay' : 'Show fan overlay'}
          </Button>
          <Button
            fullWidth
            color={isBankOverlayVisible ? 'green' : 'blue'}
            variant={isBankOverlayVisible ? 'light' : 'filled'}
            onClick={toggleBankOverlay}
          >
            {isBankOverlayVisible ? 'Hide bank overlay' : 'Show bank overlay'}
          </Button>
        </Button.Group>
      </Flex>
    </Modal>
  )
}

export default BankModal

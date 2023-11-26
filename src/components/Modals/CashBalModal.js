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

const CashBalModal = ({ isOpen = false, onClose }) => {
  const { kv, updateKV } = useContext(LanyardContext)
  const cashInputRef = useRef(null)
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
            let numericInput = cashInputRef.current.value
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

  const updateCashBalance = useCallback(
    (amount) => {
      try {
        const value = kv?.cash_balance
        if (value === undefined) return

        const updatedValue = parseInt(value) + (parseInt(amount) || 0) * 100

        updateKV('cash_balance', updatedValue.toString())
        cashInputRef.current.value = ''
      } catch (e) {
        console.log(e)
      }
    },
    [kv, updateKV]
  )

  return (
    <Modal title="Cash" centered size="md" opened={isOpen} onClose={onClose}>
      <Flex direction="column" gap="md">
        <Text lh="2em">
          <b>Cash balance (in USD):</b>{' '}
          {(parseInt(kv?.cash_balance || 0) / 100)
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
          ref={cashInputRef}
          data-autofocus
          inputMode="decimal"
        />
        <Space />
        <Button.Group>
          <Button
            fullWidth
            color="red"
            onClick={async () => {
              const usdValue = await amountToUSD(cashInputRef.current.value)
              updateCashBalance(-usdValue)
            }}
          >
            Subtract -
          </Button>
          <Button
            fullWidth
            color="green"
            onClick={async () => {
              const usdValue = await amountToUSD(cashInputRef.current.value)
              updateCashBalance(usdValue)
            }}
          >
            Add +
          </Button>
        </Button.Group>
      </Flex>
    </Modal>
  )
}

export default CashBalModal

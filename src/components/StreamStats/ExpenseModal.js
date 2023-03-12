import {
  Box,
  Button,
  Modal,
  Select,
  Space,
  Text,
  TextInput,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { useContext, useRef } from 'react'
import wretch from 'wretch'
import { StatContext } from 'components/Providers/StatProvider'

const {
  REACT_APP_API_2_URL,
  REACT_APP_API_3_URL,
  REACT_APP_EXCHANGE_RATE_API_URL,
} = process.env

const ExpenseModal = ({ isOpen = false, onClose }) => {
  const {
    setCurrencyConfig,
    lanyardConfig,
    currencyConfig = {
      currency: 'usd',
    },
  } = useContext(ConfigContext)
  const { kv } = useContext(LanyardContext)
  const { netProfit } = useContext(StatContext)
  const { discordUserId, apiKey } = lanyardConfig
  const expenseRef = useRef(null)

  return (
    <Modal centered title="Add Expense" opened={isOpen} onClose={onClose}>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Box>
          <Text lh="2em">
            <b>Current (in USD):</b>{' '}
            {parseFloat(netProfit)
              .toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
              .replace('.00', '')}
          </Text>
          <Space h="16px" />
          <Select
            label="Choose Currency"
            value={currencyConfig?.currency}
            onChange={(value) => {
              setCurrencyConfig({
                ...currencyConfig,
                currency: value,
              })
            }}
            data={[
              { label: 'Thai Baht (฿)', value: 'thb' },
              { label: 'US Dollar ($)', value: 'usd' },
              { label: 'Hong Kong Dollar (HKD)', value: 'hkd' },
              { label: 'Philippine Peso (₱)', value: 'php' },
            ]}
          />
        </Box>
        <TextInput
          label={`Amount (${currencyConfig?.currency?.toUpperCase()})`}
          placeholder="Enter the amount"
          required
          style={{ width: '100%' }}
          ref={expenseRef}
          data-autofocus
          inputMode="decimal"
        />
        <Space h="8px" />
        <Button.Group>
          <Button
            fullWidth
            color="red"
            onClick={() => {
              let usdConversionRate
              let numericInput = expenseRef.current.value

              onClose()

              // get exchange rate
              wretch(
                `${REACT_APP_EXCHANGE_RATE_API_URL}/v1/rates/${currencyConfig?.currency}`
              )
                .get()
                .json(async (res) => {
                  if (res) {
                    try {
                      usdConversionRate = parseFloat(
                        res?.data?.[currencyConfig?.currency]
                      )
                    } catch (err) {
                      console.error(
                        "Couldn't parse the exchange rate response",
                        err
                      )
                    }
                  }
                })
                .catch((err) => {
                  console.error('Error fetching the exchange rate: ', err)
                })
                .finally(() => {
                  numericInput = numericInput.replace(/[^0-9.]/g, '')

                  if (isNaN(numericInput)) {
                    throw new Error('Invalid input')
                  }

                  const expenseValue =
                    parseFloat(numericInput) / usdConversionRate

                  wretch(`${REACT_APP_API_3_URL}/api/expenses`)
                    .post({
                      amount_in_usd: expenseValue.toFixed(2) * -1,
                      streamer_id: 1,
                      value: {
                        amount: parseInt(parseFloat(numericInput * -1) * 100),
                        currency: currencyConfig?.currency,
                      },
                    })
                    .res((res) => {
                      if (res.ok) {
                        showNotification({
                          title: 'Expense Added',
                          message: 'Net profit was updated successfully',
                          color: 'teal',
                        })
                      }
                    })
                    .catch((err) => {
                      console.error(err)
                      showNotification({
                        title: 'Error',
                        message: 'There was an error adding the expense',
                        color: 'red',
                      })
                    })
                })
                .catch((err) => {
                  console.error('Error adding the new expense: ', err)
                  showNotification({
                    title: 'Error',
                    message: 'There was an error adding the expense',
                    color: 'red',
                  })
                })
            }}
          >
            Subtract -
          </Button>
          <Button
            fullWidth
            color="green"
            onClick={() => {
              let usdConversionRate
              let numericInput = expenseRef.current.value

              onClose()

              // get exchange rate
              wretch(
                `${REACT_APP_EXCHANGE_RATE_API_URL}/v1/rates/${currencyConfig?.currency}`
              )
                .get()
                .json(async (res) => {
                  if (res) {
                    try {
                      usdConversionRate = parseFloat(
                        res?.data?.[currencyConfig?.currency]
                      )
                    } catch (err) {
                      console.error(
                        "Couldn't parse the exchange rate response",
                        err
                      )
                    }
                  }
                })
                .catch((err) => {
                  console.error('Error fetching the exchange rate: ', err)
                })
                .finally(() => {
                  numericInput = numericInput.replace(/[^0-9.]/g, '')

                  if (isNaN(numericInput)) {
                    throw new Error('Invalid input')
                  }

                  const expenseValue =
                    parseFloat(numericInput) / usdConversionRate

                  wretch(`${REACT_APP_API_3_URL}/api/expenses`)
                    .post({
                      amount_in_usd: expenseValue.toFixed(2),
                      streamer_id: 1,
                      value: {
                        amount: parseInt(parseFloat(numericInput) * 100),
                        currency: currencyConfig?.currency,
                      },
                    })
                    .res((res) => {
                      if (res.ok) {
                        showNotification({
                          title: 'Expense Added',
                          message: 'Net profit was updated successfully',
                          color: 'teal',
                        })
                      }
                    })
                    .catch((err) => {
                      console.error(err)
                      showNotification({
                        title: 'Error',
                        message: 'There was an error adding the expense',
                        color: 'red',
                      })
                    })
                })
                .catch((err) => {
                  console.error('Error adding the new expense: ', err)
                  showNotification({
                    title: 'Error',
                    message: 'There was an error adding the expense',
                    color: 'red',
                  })
                })
            }}
          >
            Add +
          </Button>
        </Button.Group>
      </form>
    </Modal>
  )
}

export default ExpenseModal

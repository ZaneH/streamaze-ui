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
import { StatContext } from 'components/Providers/StatProvider'
import { useContext, useRef } from 'react'
import wretch from 'wretch'

const { REACT_APP_API_3_URL, REACT_APP_EXCHANGE_RATE_API_URL } = process.env

const ExpenseModal = ({ isOpen = false, onClose }) => {
  const {
    userConfig,
    setCurrencyConfig,
    currencyConfig = {
      currency: 'usd',
    },
  } = useContext(ConfigContext)
  const { streamazeKey } = userConfig
  const { netProfit } = useContext(StatContext)
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
            withinPortal
            label="Choose Currency"
            value={currencyConfig?.currency}
            onChange={(value) => {
              setCurrencyConfig({
                ...currencyConfig,
                currency: value,
              })
            }}
            data={[
              { label: 'New Zealand Dollar ($)', value: 'nzd' },
              { label: 'Japanese Yen (¥)', value: 'jpy' },
              { label: 'South Korean Won (₩)', value: 'krw' },
              { label: 'Nepalese Rupee (रू)', value: 'npr' },
              { label: 'Indian Rupee (₹)', value: 'inr' },
              { label: 'Hong Kong Dollar (HKD)', value: 'hkd' },
              { label: 'Philippine Peso (₱)', value: 'php' },
              { label: 'Thai Baht (฿)', value: 'thb' },
              { label: 'US Dollar ($)', value: 'usd' },
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
                      api_key: streamazeKey,
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
                      api_key: streamazeKey,
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

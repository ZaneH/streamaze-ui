/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

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
import CurrencySelect from './CurrencySelect'

const { REACT_APP_API_3_URL, REACT_APP_EXCHANGE_RATE_API_URL } = process.env

const ExpenseModal = ({ isOpen = false, onClose, onOpenBank }) => {
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
          <Space h={8} />
          <CurrencySelect />
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
                .then(() => {
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
                        onClose()

                        showNotification({
                          title: 'Expense Added',
                          message: 'Net profit was updated successfully',
                          color: 'teal',
                        })
                      }
                    })
                    .catch((err) => {
                      console.error(err)

                      if (err?.status === 401) {
                        showNotification({
                          title: 'You must subscribe to add expenses',
                          message: 'Go to my.streamerdash.com to upgrade',
                          color: 'yellow',
                        })
                      } else {
                        showNotification({
                          title: 'Error',
                          message: 'There was an error adding the expense',
                          color: 'red',
                        })
                      }
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

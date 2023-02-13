import {
  Box,
  Button,
  Flex,
  Modal,
  Select,
  Space,
  Text,
  TextInput,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { ReactComponent as DollarSignIcon } from 'dollar-sign-icon.svg'
import { ReactComponent as FlagIcon } from 'flag-icon.svg'
import { useContext, useRef, useState } from 'react'
import { secondsToHHMMSS } from 'utils/time'
import wretch from 'wretch'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'
import SubathonModal from './SubathonModal'

const { REACT_APP_API_2_URL, REACT_APP_EXCHANGE_RATE_API_URL } = process.env

const StatPanel = () => {
  const { ytViewers, tiktokViewers, isYTLoading, isTikTokLoading } =
    useContext(StatContext)
  const { bitrate } = useContext(HopContext)
  const { kv } = useContext(LanyardContext)
  const { timeRemaining } = useContext(SubathonContext)
  const {
    lanyardConfig,
    setCurrencyConfig,
    subathonConfig,
    currencyConfig = {
      currency: 'usd',
    },
  } = useContext(ConfigContext)
  const { discordUserId, apiKey } = lanyardConfig
  const [showMoneyModal, setShowMoneyModal] = useState(false)
  const [showSubathonModal, setShowSubathonModal] = useState(false)
  const expenseRef = useRef(null)

  return (
    <>
      <Flex direction="column" gap="xs">
        <Flex gap="md" style={{ flexWrap: 'wrap' }}>
          {ytViewers || isYTLoading ? (
            <StatInfo
              network="youtube"
              label={
                isYTLoading ? 'Loading' : parseInt(ytViewers).toLocaleString()
              }
            />
          ) : null}
          {/* TODO: Implement Twitch /viewers endpoint */}
          {/* <StatInfo network="twitch" label="661" /> */}
          {tiktokViewers || isTikTokLoading ? (
            <StatInfo
              network="tiktok"
              label={
                isTikTokLoading
                  ? 'Loading'
                  : parseInt(tiktokViewers).toLocaleString()
              }
            />
          ) : null}
        </Flex>
        <Flex gap="md">
          <StatInfo
            image={<BitRateIcon style={{ width: 26, height: 26 }} />}
            label={bitrate ? `${bitrate} Kbps` : 'Offline'}
          />
          {kv?.net_profit ? (
            <StatInfo
              onClick={() => {
                if (kv?.net_profit) {
                  setShowMoneyModal(true)
                } else {
                  showNotification({
                    title: 'Error',
                    message: 'Lanyard is not ready...',
                    color: 'yellow',
                  })
                }
              }}
              image={<DollarSignIcon style={{ width: 26, height: 26 }} />}
              label={parseFloat(kv?.net_profit)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
                .replace('.00', '')}
            />
          ) : null}

          {subathonConfig?.isSubathonActive && (
            <StatInfo
              image={<FlagIcon style={{ width: 26, height: 26 }} />}
              label={secondsToHHMMSS(timeRemaining)}
              onClick={() => {
                setShowSubathonModal(true)
              }}
            />
          )}
        </Flex>
      </Flex>
      <Modal
        centered
        title="Add Expense"
        opened={showMoneyModal}
        onClose={() => setShowMoneyModal(false)}
      >
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <Box>
            <Text lh="2em">
              <b>Current (in USD):</b>{' '}
              {parseFloat(kv?.net_profit)
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
          />
          <Space h="8px" />
          <Button.Group>
            <Button
              fullWidth
              color="red"
              onClick={() => {
                let usdConversionRate

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
                    const previousUSDValue = parseFloat(kv?.net_profit)
                    let numericInput = expenseRef.current.value
                    numericInput = numericInput.replace(/[^0-9.]/g, '')

                    if (isNaN(numericInput)) {
                      throw new Error('Invalid input')
                    }

                    const newUSDValue =
                      previousUSDValue -
                      parseFloat(numericInput) / usdConversionRate

                    wretch(`${REACT_APP_API_2_URL}/kv/set`)
                      .post({
                        discordUserId,
                        key: 'net_profit',
                        value: newUSDValue.toFixed(2),
                        apiKey,
                      })
                      .res((res) => {
                        if (res.ok) {
                          setShowMoneyModal(false)

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
                    const previousUSDValue = parseFloat(kv?.net_profit)
                    let numericInput = expenseRef.current.value
                    numericInput = numericInput.replace(/[^0-9.]/g, '')

                    if (isNaN(numericInput)) {
                      throw new Error('Invalid input')
                    }

                    const newUSDValue =
                      previousUSDValue +
                      parseFloat(numericInput) / usdConversionRate

                    wretch(`${REACT_APP_API_2_URL}/kv/set`)
                      .post({
                        discordUserId,
                        key: 'net_profit',
                        value: newUSDValue.toString(),
                        apiKey,
                      })
                      .res((res) => {
                        if (res.ok) {
                          setShowMoneyModal(false)

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
      <SubathonModal
        isOpen={showSubathonModal}
        onClose={() => {
          setShowSubathonModal(false)
        }}
      />
    </>
  )
}

export default StatPanel

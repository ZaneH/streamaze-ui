import { Box, Button, Flex, Modal, Text, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { ReactComponent as DollarSignIcon } from 'dollar-sign-icon.svg'
import { useContext, useRef, useState } from 'react'
import { useLanyardWS } from 'use-lanyard'
import wretch from 'wretch'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'

const { REACT_APP_API_2_URL } = process.env

const StatPanel = () => {
  const { ytViewers, tiktokViewers, isYTLoading, isTikTokLoading } =
    useContext(StatContext)
  const { lanyardConfig } = useContext(ConfigContext)
  const { discordUserId, apiKey } = lanyardConfig
  const { bitrate } = useContext(HopContext)
  const [showMoneyModal, setShowMoneyModal] = useState(false)
  const data = useLanyardWS(discordUserId)
  const expenseRef = useRef(null)

  const netProfit = data?.kv?.net_profit

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
          {netProfit ? (
            <StatInfo
              onClick={() => {
                if (netProfit) {
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
              label={parseFloat(netProfit)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
                .replace('.00', '')}
            />
          ) : null}
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
            <Text>
              <b>Current:</b>{' '}
              {parseFloat(netProfit)
                .toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
                .replace('.00', '')}
            </Text>
          </Box>
          <TextInput
            label="Amount"
            placeholder="100"
            required
            style={{ width: '100%' }}
            ref={expenseRef}
            data-autofocus
          />
          <Button.Group>
            <Button
              fullWidth
              color="red"
              onClick={() => {
                const previousValue = parseFloat(netProfit)
                const newValue =
                  previousValue - parseFloat(expenseRef.current.value)

                wretch(`${REACT_APP_API_2_URL}/kv/set`)
                  .post({
                    discordUserId,
                    key: 'net_profit',
                    value: newValue,
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
              }}
            >
              Subtract
            </Button>
            <Button
              fullWidth
              color="green"
              onClick={() => {
                const previousValue = parseFloat(netProfit)
                const newValue =
                  previousValue + parseFloat(expenseRef.current.value)

                wretch(`${REACT_APP_API_2_URL}/kv/set`)
                  .post({
                    discordUserId,
                    key: 'net_profit',
                    value: newValue,
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
              }}
            >
              Add
            </Button>
          </Button.Group>
        </form>
      </Modal>
    </>
  )
}

export default StatPanel

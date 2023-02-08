import { Box, Button, Flex, Modal, Text, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { LanyardContext } from 'components/Providers/LanyardProvider'
import { ReactComponent as DollarSignIcon } from 'dollar-sign-icon.svg'
import { useContext, useRef, useState } from 'react'
import wretch from 'wretch'
import { ReactComponent as BitRateIcon } from '../../bit-rate-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import { StatContext } from '../Providers/StatProvider'
import StatInfo from './StatInfo'

const { REACT_APP_API_2_URL } = process.env

const StatPanel = () => {
  const { ytViewers, tiktokViewers, isYTLoading, isTikTokLoading } =
    useContext(StatContext)
  const { bitrate } = useContext(HopContext)
  const { kv } = useContext(LanyardContext)
  const { lanyardConfig } = useContext(ConfigContext)
  const { discordUserId, apiKey } = lanyardConfig
  const [showMoneyModal, setShowMoneyModal] = useState(false)
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
              {parseFloat(kv?.net_profit)
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
                const previousValue = parseFloat(kv?.net_profit)
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
                const previousValue = parseFloat(kv?.net_profit)
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

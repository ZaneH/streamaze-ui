import styled from '@emotion/styled'
import { Box, Button, Flex, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { GiveawaySlotMachine } from 'components/Giveaway'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import moment from 'moment'
import { useCallback, useContext, useEffect, useState } from 'react'
import wretch from 'wretch'

const SlotItem = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  font-weight: bolder;
`

const SlotMachine = () => {
  const [target, setTarget] = useState(1)
  const [times, setTimes] = useState(1)
  const [duration, setDuration] = useState()
  const [turn, setTurn] = useState(false)

  const [entries, setEntries] = useState([])

  const { userConfig } = useContext(ConfigContext)

  const fetchGiveawayEntries = useCallback(async () => {
    const res = await wretch(
      `${process.env.REACT_APP_API_3_URL}/api/giveaway_entries?api_key=${userConfig?.streamazeKey}`
    )
      .get()
      .json()

    return res?.data || []
  }, [userConfig?.streamazeKey])

  useEffect(() => {
    fetchGiveawayEntries().then((data) => {
      setEntries([{ entry_username: '???' }, ...data])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Box align="center" mt="15%">
        <Title size="h2" align="center">
          How to Play
        </Title>
        <Text>
          Type <b>!stake</b> in chat to register
        </Text>
      </Box>
      <Box my="10%">
        <Flex direction="column" gap="md" align="center">
          <GiveawaySlotMachine
            style={{
              fontSize: '3em',
              height: '3em',
            }}
            duration={duration}
            target={turn ? target : 0}
            times={times}
            onEnd={async () => {
              const res = await wretch(
                `${process.env.REACT_APP_API_3_URL}/api/giveaway_entries/${entries[target]?.id}?api_key=${userConfig?.streamazeKey}`
              )
                .patch({ win_count: 1, last_win: moment.utc().toISOString() })
                .json()

              if (res?.data) {
                showNotification({
                  title: 'Congratulations!',
                  message: `${res?.data?.entry_username} won the giveaway!`,
                  color: 'teal',
                })
              }
            }}
          >
            {entries?.map(({ entry_username: username }, idx) => {
              let randomColor = Math.floor(Math.random() * 16777215).toString(
                16
              )

              if (username === '???') {
                randomColor = '000'
              }

              return (
                <SlotItem
                  key={idx}
                  style={{
                    color: `#${randomColor}`,
                  }}
                >
                  {username}
                </SlotItem>
              )
            })}
          </GiveawaySlotMachine>
          <Button
            size="lg"
            radius="xl"
            color="green"
            onClick={() => {
              setTarget(Math.floor(Math.random() * (entries?.length - 1)) + 1)
              setDuration(Math.floor(Math.random() * 3000) + 4000)
              setTimes(Math.floor(Math.random() * 16) + 8)

              setTurn(true)
            }}
          >
            Spin
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export default SlotMachine

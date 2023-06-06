import styled from '@emotion/styled'
import { Box, Button, Flex, Text, Title } from '@mantine/core'
import { GiveawaySlotMachine } from 'components/Giveaway'
import { useState } from 'react'
import { useReward } from 'react-rewards'

const list = [
  { name: '???' },
  { name: 'Sakuranomiya\nMaika' },
  { name: 'Hinata\nKaho' },
  // { name: 'Hoshikawa\nMahuyu'},
  // { name: 'Amano\nMiu'},
  // { name: 'Kanzaki\nHideri'},
  // { name: 'Dino'},
  // { name: 'Akiduki\nKouyou'},
]

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

  // const { reward } = useReward('slot-machine', 'emoji', {
  //   emoji: '💸',
  // })

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
            id="slot-machine"
            style={{
              fontSize: '3em',
              height: '3em',
            }}
            duration={duration}
            target={turn ? target : 0}
            times={times}
            onEnd={() => {
              // reward()
            }}
          >
            {list.map(({ name }, idx) => {
              let randomColor = Math.floor(Math.random() * 16777215).toString(
                16
              )

              if (name === '???') {
                randomColor = '000'
              }

              return (
                <SlotItem
                  key={idx}
                  style={{
                    color: `#${randomColor}`,
                  }}
                >
                  {name}
                </SlotItem>
              )
            })}
          </GiveawaySlotMachine>
          <Button
            size="lg"
            radius="xl"
            color="green"
            onClick={() => {
              setTarget(Math.floor(Math.random() * (list.length - 1)) + 1)
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

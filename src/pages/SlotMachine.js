/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Box, Button, Center, Flex, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { nanoid } from 'nanoid'
import { useContext, useEffect, useState } from 'react'
import RoulettePro from 'react-roulette-pro'
import wretch from 'wretch'

import ResetGiveawayModal from 'components/Modals/ResetGiveawayModal'
import { ProviderProvider } from 'components/Providers'
import { Layout } from 'components/document'
import 'react-roulette-pro/dist/index.css'
import TagSEO from 'components/TagSEO'
import { ChatLog } from 'components/Chat'

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <SlotMachine />
    </ProviderProvider>
  )
}

const reproductionArray = (array = [], length = 0) => [
  ...Array(length)
    .fill('_')
    .map(() => array[Math.floor(Math.random() * array.length)]),
]

const SlotMachine = () => {
  const [names, setNames] = useState([])
  const [prizeList, setPrizeList] = useState([])

  const [start, setStart] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [prizeIndex, setPrizeIndex] = useState(0)
  const [previousWinner, setPreviousWinner] = useState(null)

  const [showResetModal, setShowResetModal] = useState(false)

  const { userConfig } = useContext(ConfigContext)

  useEffect(() => {
    fetchNames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchNames = async () => {
    try {
      const response = await wretch(
        `${process.env.REACT_APP_API_3_URL}/api/giveaway_entries?api_key=${userConfig?.streamazeKey}`
      )
        .get()
        .json()

      if (response?.data) {
        setNames(
          response.data
            ?.map((entry) => ({
              id: entry.id,
              username: entry?.entry_username,
              chatName: entry?.chat_username,
            }))
            ?.filter((entry) => entry.username)
        )
      }
    } catch (error) {
      console.error('Error fetching names:', error)
    }
  }

  useEffect(() => {
    const prizes = names?.map((name) => ({
      entryId: name.id,
      text: `Stake: ${name.username}\nKick: ${name.chatName}`,
      chatName: name.chatName,
    }))

    const reproducedArray = [
      ...prizes,
      ...reproductionArray(prizes, prizes.length * 3),
      ...prizes,
      ...reproductionArray(prizes, prizes.length),
      ...prizes,
      ...reproductionArray(prizes, prizes.length * 3),
    ]

    const list = [...reproducedArray].map((item) => ({
      ...item,
      // add an ID to each item
      id: `${item.id}--${nanoid()}`,
    }))

    setPrizeList(list)
  }, [names])

  useEffect(() => {
    if (!prizeIndex || start) {
      return
    }

    setStart(true)
  }, [prizeIndex, start])

  useEffect(() => {
    if (!spinning || !prizeList.length) {
      return
    }

    const prepare = () => {
      const minNumber = Math.ceil(0)
      const maxNumber = Math.floor(names.length - 1)

      const randomPrizeIndex = Math.floor(
        Math.random() * (maxNumber - minNumber + 1) + minNumber
      )

      const randomPrizeIndexOffset = names.length * 4

      setPrizeIndex(randomPrizeIndex + randomPrizeIndexOffset)
      setStart(false)
    }

    prepare()
  }, [spinning, prizeList, names.length])

  return (
    <Layout>
      <TagSEO title="Streamaze | Giveaway" />
      <Box mt="12vh" mb="4vh">
        {names.length > 0 ? (
          <RoulettePro
            type="horizontal"
            start={start}
            prizes={prizeList}
            prizeIndex={prizeIndex}
            spinningTime={3}
            options={{
              stopInCenter: true,
            }}
            onPrizeDefined={async () => {
              const winningPrize = prizeList[prizeIndex]

              showNotification({
                title: 'Winner!',
                message: `Congratulations, ${winningPrize.text}!`,
                color: 'teal',
              })

              setSpinning(false)

              // Send the API request with the selected name
              await wretch(
                `${process.env.REACT_APP_API_3_URL}/api/giveaway_entries/${winningPrize.entryId}?api_key=${userConfig?.streamazeKey}`
              )
                .patch({ win_count: 1 })
                .json()

              setPreviousWinner(winningPrize)
            }}
            defaultDesignOptions={{
              prizesWithText: true,
            }}
          />
        ) : (
          <Text size="xl" align="center">
            No eligible entries found.
          </Text>
        )}
      </Box>

      <Center>
        <Flex direction="column" gap="md">
          <Button
            color="green"
            disabled={spinning}
            size="lg"
            style={{
              borderRadius: '25px',
            }}
            onClick={() => {
              if (previousWinner) {
                setNames(
                  names.filter((name) => name.id !== previousWinner.entryId)
                )
              }

              setSpinning(true)
            }}
          >
            Spin
          </Button>

          <Button
            color="red"
            size="lg"
            style={{
              borderRadius: '25px',
            }}
            onClick={() => {
              setShowResetModal(true)
            }}
          >
            Reset All
          </Button>
        </Flex>
      </Center>

      <Center m="md">
        <ChatLog
          height="400px"
          width="80%"
          fluid
          hideIceButton={true}
          paddingX="12px"
          isFiltered
          usernameFilter={previousWinner?.chatName}
        />
      </Center>

      <ResetGiveawayModal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false)
        }}
        onConfirm={() => {
          wretch(
            `${process.env.REACT_APP_API_3_URL}/api/giveaway_entries/reset?api_key=${userConfig?.streamazeKey}`
          )
            .post()
            .res(() => {
              showNotification({
                title: 'Giveaway Reset',
                message: 'The giveaway has been reset.',
                color: 'teal',
              })

              setShowResetModal(false)
            })
            .catch(() => {
              showNotification({
                title: 'Error',
                message:
                  'There was an error resetting the giveaway. Please try again later.',
                color: 'red',
              })
            })
        }}
      />
    </Layout>
  )
}

export default ProvidersWrapper

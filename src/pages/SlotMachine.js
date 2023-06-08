import styled from '@emotion/styled'
import { Box, Button, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import React, { useContext, useEffect, useRef, useState } from 'react'
import wretch from 'wretch'

const SlotItem = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  font-weight: bolder;
`

function getColorCodeFromString(str) {
  // Hash the string using a simple hash function
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate a random color code based on the hashed value
  const randomColor = Math.floor(Math.abs(Math.sin(hash) * 16777215)).toString(
    16
  )

  // Return the color code
  return '#' + randomColor
}

const SlotMachine = () => {
  const [names, setNames] = useState([])
  const [visibleIndex, setVisibleIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [winnerIndex, setWinnerIndex] = useState(null) // New state variable
  const [prevWinnerIndex, setPrevWinnerIndex] = useState()
  const containerRef = useRef(null)

  const { userConfig } = useContext(ConfigContext)

  useEffect(() => {
    // Fetch the initial list of names from the API
    fetchNames()
  }, [])

  useEffect(() => {
    // Adjust the visible index when the names list changes
    setVisibleIndex(0)
  }, [names])

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
              username: entry.chat_username,
            }))
            ?.filter((entry) => entry.username)
        )
      }
    } catch (error) {
      console.error('Error fetching names:', error)
    }
  }

  const startSpinning = async () => {
    if (prevWinnerIndex) {
      // Remove the selected name from the list
      setNames((prevNames) => prevNames.filter((_, i) => i !== prevWinnerIndex))
      setPrevWinnerIndex(null)
    }

    setIsSpinning(true)
    setIsButtonDisabled(true)

    const targetIndex = Math.floor(Math.random() * names.length)

    const minCycles = 2
    const maxCycles = 4
    const totalCycles =
      minCycles + Math.floor(Math.random() * (maxCycles - minCycles + 1))

    // Calculate the number of items to scroll per cycle
    const itemsToScrollPerCycle = names.length

    const spinningDurationPerItem = Math.floor(Math.random() * 35) + 25

    // Calculate the total spinning duration based on the number of items to scroll and cycles
    const totalSpinningDuration =
      itemsToScrollPerCycle * totalCycles * spinningDurationPerItem

    let scrollDistance = 0
    const startTime = Date.now()
    let animationFrameId
    let cycleCount = 0

    const spinAnimation = () => {
      const elapsedTime = Date.now() - startTime

      // Calculate the scroll speed based on elapsed time and total spinning duration
      const t = Math.min(elapsedTime / totalSpinningDuration, 1)
      const scrollSpeed = easeOutQuad(t) * itemsToScrollPerCycle

      // Update the scroll distance
      scrollDistance += scrollSpeed

      // Wrap the scroll distance to create the circular effect
      scrollDistance %= names.length

      // Update the visible index based on the scroll distance
      setVisibleIndex((prevIndex) => {
        const newIndex = (prevIndex + scrollDistance) % names.length

        // Check if a full cycle has been completed
        if (Math.floor(newIndex) === 0 && prevIndex > 0) {
          cycleCount++
        }

        console.log(
          cycleCount,
          totalCycles,
          Math.floor(newIndex),
          Math.floor(targetIndex),
          t,
          totalSpinningDuration,
          elapsedTime
        )
        // Stop spinning when reaching the target index after completing the required cycles
        if (
          cycleCount >= totalCycles &&
          Math.floor(newIndex) === Math.floor(targetIndex) &&
          t >= 1
        ) {
          cancelAnimationFrame(animationFrameId)
          setIsSpinning(false)
          setIsButtonDisabled(false)
          handleWinnerSelected(targetIndex) // Send API request and remove the winner
        }

        return newIndex
      })

      // Request the next animation frame
      animationFrameId = requestAnimationFrame(spinAnimation)
    }

    // Start the spin animation
    animationFrameId = requestAnimationFrame(spinAnimation)
  }

  const handleWinnerSelected = async (index) => {
    try {
      const { id } = names[index]

      // Send the API request with the selected name
      await wretch(
        `${process.env.REACT_APP_API_3_URL}/api/giveaway_entries/${id}?api_key=${userConfig?.streamazeKey}`
      )
        .patch({ win_count: 1 })
        .json()

      showNotification({
        title: 'Congratulations!',
        message: `The winner is ${names[index].username}`,
        color: 'teal',
      })
    } catch (error) {
      console.error('Error selecting winner:', error)
    }
  }

  // Easing function: easeOutQuad
  const easeOutQuad = (t) => t * (2 - t)

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
      <Box
        style={{
          fontSize: '3em',
          height: '3em',
          textAlign: 'center',
          marginTop: '1em',
        }}
      >
        <div
          ref={containerRef}
          style={{
            maxHeight: '1.75em',
            overflow: 'hidden',
          }}
        >
          <div style={{ transform: `translateY(-${visibleIndex * 1.5}em` }}>
            {names?.map(({ id, username }) => {
              const textColor = getColorCodeFromString(username)
              return (
                <div key={id} style={{ color: textColor }}>
                  <SlotItem>{username}</SlotItem>
                </div>
              )
            })}
          </div>
        </div>
        <Button
          disabled={isButtonDisabled}
          size="lg"
          radius="xl"
          color="green"
          onClick={() => {
            startSpinning()
          }}
        >
          {isSpinning ? 'Spinning...' : 'Spin'}
        </Button>
        {/* <button onClick={startSpinning} disabled={isButtonDisabled}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button> */}
      </Box>
    </>
  )
}

export default SlotMachine

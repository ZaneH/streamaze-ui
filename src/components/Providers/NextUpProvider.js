// Next Up is a game provided for live streamers.
// It starts with X amout of lives and if viewers vote more
// bad than good, the streamer loses a life.

import { useInterval, useLocalStorage } from '@mantine/hooks'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LanyardContext } from './LanyardProvider'
import { secondsToHHMMSS } from 'utils/time'

export const NextUpContext = createContext()

const DEFAULT_FRAME_LENGTH = 1000 * 60 * 1 // 1 minute

const NextUpProvider = ({ children }) => {
  const { updateKV } = useContext(LanyardContext)
  const [showNextUpModal, setShowNextUpModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [nextUpClock, setNextUpClock] = useState(null)
  const [userIds, setUserIds] = useState([])

  const [nextUp, setNextUp] = useLocalStorage({
    key: 'next-up-data',
    defaultValue: {
      startLives: 20,
      lives: 20,
      nextUpTimestamp: null,
      frameLength: DEFAULT_FRAME_LENGTH,
      totalTime: 0,
      frameVotes: {
        good: 0,
        bad: 0,
      },
    },
  })

  const clockInterval = useInterval(() => {
    // Next Up Clock will be a timer formatted HH:MM:SS
    let timeLeft = parseInt(nextUp.nextUpTimestamp) - Date.now()
    if (isNaN(timeLeft)) {
      timeLeft = 0
    }

    setNextUpClock(secondsToHHMMSS(timeLeft / 1000))
    if (timeLeft <= 0) {
      clockInterval.stop()
      checkNextUp()
    }
  }, 1000)

  useEffect(() => {
    clockInterval.stop()
    clockInterval.start()

    let timeLeft = parseInt(nextUp.nextUpTimestamp) - Date.now()
    if (isNaN(timeLeft)) {
      timeLeft = 0
    }

    setNextUpClock(secondsToHHMMSS(timeLeft / 1000))
  }, [nextUp.nextUpTimestamp])

  useEffect(() => {
    if (nextUp.nextUpTimestamp === null) {
      clockInterval.stop()
    }

    return () => {
      clockInterval.stop()
    }
  }, [])

  useEffect(() => {
    if (nextUp.nextUpTimestamp === null) {
      updateKV('next_up_lives', '0')
      updateKV('next_up_timestamp', '0')
      return
    }

    setUserIds([])

    updateLanyard()
  }, [nextUp.nextUpTimestamp])

  const updateLanyard = () => {
    updateKV('next_up_lives', nextUp.lives.toString())
    updateKV('next_up_timestamp', (nextUp.nextUpTimestamp ?? '0').toString())
  }

  const checkNextUp = useCallback(() => {
    if (nextUp.nextUpTimestamp === null) {
      return
    }

    setNextUp((prev) => {
      let newLives = prev.lives
      if (prev.frameVotes.good < prev.frameVotes.bad) {
        if (prev.lives > 1) {
          newLives = prev.lives - 1
        } else {
          setShowGameOverModal(true)
          return {
            ...prev,
            lives: 0,
            totalTime: prev.totalTime + prev.frameLength / 1000,
            nextUpTimestamp: null,
            frameVotes: {
              good: 0,
              bad: 0,
            },
          }
        }
      }

      return {
        ...prev,
        lives: newLives,
        totalTime: prev.totalTime + prev.frameLength / 1000,
        nextUpTimestamp: Date.now() + prev.frameLength,
        frameVotes: {
          good: 0,
          bad: 0,
        },
      }
    })
  }, [nextUp.frameVotes, nextUp.lives, nextUp.nextUpTimestamp])

  const startNextUp = ({ lives, frameLength = DEFAULT_FRAME_LENGTH }) => {
    const newTimestamp = Date.now() + frameLength
    setUserIds([])
    setNextUp({
      startLives: lives,
      lives,
      nextUpTimestamp: newTimestamp,
      frameLength,
      totalTime: 0,
      frameVotes: {
        good: 0,
        bad: 0,
      },
    })

    updateLanyard()

    clockInterval.stop()
    clockInterval.start()
  }

  const endNextUp = () => {
    clockInterval.stop()

    setNextUp((prev) => ({
      ...prev,
      nextUpTimestamp: null,
    }))
  }

  const handleNextUpMessage = useCallback(
    ({ userId, content }) => {
      if (nextUp.nextUpTimestamp === null) {
        return
      }

      if (userIds.includes(userId)) {
        return
      }

      // console.log(content)

      let didRespond = false
      if (content === '[emote:1631438:samContent]') {
        setNextUp((prev) => ({
          ...prev,
          frameVotes: {
            ...prev.frameVotes,
            good: prev.frameVotes.good + 1,
          },
        }))

        didRespond = true
      } else if (content === '[emote:1631440:samNontent]') {
        setNextUp((prev) => ({
          ...prev,
          frameVotes: {
            ...prev.frameVotes,
            bad: prev.frameVotes.bad + 1,
          },
        }))

        didRespond = true
      }

      if (didRespond) {
        setUserIds([...userIds, userId])
      }
    },
    [nextUp.nextUpTimestamp, userIds]
  )

  return (
    <NextUpContext.Provider
      value={{
        nextUp,
        handleNextUpMessage,
        startNextUp,
        endNextUp,
        showNextUpModal,
        setShowNextUpModal,
        showGameOverModal,
        setShowGameOverModal,
        nextUpClock,
      }}
    >
      {children}
    </NextUpContext.Provider>
  )
}

export default NextUpProvider

/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { createContext, useCallback, useContext, useState } from 'react'
import { LanyardContext } from './LanyardProvider'
import WordRankProvider from './WordRankProvider'
export const PollContext = createContext()

const PollProvider = ({ children }) => {
  const { updateKV } = useContext(LanyardContext)
  const [showPollModal, setShowPollModal] = useState(false)
  const [isPollActive, setIsPollActive] = useState(true)
  // formatted: [{ userId: '123456', content: '1' }]
  const [pollResponses, setPollResponses] = useState([])

  const updatePollKV = useCallback(
    (pollData) => {
      /**
       * 1. Convert pollResponses to {choice: count} object
       * 2. Update KV
       */
      const pollResults = pollData.reduce((acc, pollResponse) => {
        const choice = pollResponse.content
        if (acc[choice]) {
          acc[choice] += 1
        } else {
          acc[choice] = 1
        }

        return acc
      }, {})

      updateKV('poll', JSON.stringify(pollResults))
    },
    [updateKV]
  )

  // 1. Check if poll is active
  // 2. Check if user's message is a poll response (e.g. 1, 2, 3, 4)
  // 3. Check if user has voted on poll
  // 4. If user has voted, remove their previous vote
  // 5. Add new vote to pollResponses
  const handlePollResponse = useCallback(
    (message) => {
      if (isPollActive) {
        try {
          const strippedMessage = String(message.content).trim()

          // return if message has any non-numeric characters
          if (/\D/.test(strippedMessage)) {
            return
          }

          const response = parseInt(strippedMessage)
          if (isNaN(response) || response < 0 || response > 1000) {
            return
          }

          setPollResponses((prev) => {
            const hasVoted = prev.find(
              (pollResponse) => pollResponse.userId === message.userId
            )
            if (hasVoted) {
              const removedDuplicate = prev.filter((pollResponse) => {
                return pollResponse.userId !== message.userId
              })

              const newValue = [...removedDuplicate, message]
              updatePollKV(newValue)
              return newValue
            } else {
              const newValue = [...prev, message]
              updatePollKV(newValue)
              return newValue
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
    [isPollActive, updatePollKV]
  )

  return (
    <PollContext.Provider
      value={{
        showPollModal,
        setShowPollModal,
        isPollActive,
        setIsPollActive,
        pollResponses,
        setPollResponses,
        handlePollResponse,
        updatePollKV,
      }}
    >
      <WordRankProvider>{children}</WordRankProvider>
    </PollContext.Provider>
  )
}

export default PollProvider

import { createContext, useCallback, useState } from 'react'
export const PollContext = createContext()

const PollProvider = ({ children }) => {
  const [showPollModal, setShowPollModal] = useState(false)
  const [isPollActive, setIsPollActive] = useState(true)
  // formatted: [{ userId: '123456', content: '1' }]
  const [pollResponses, setPollResponses] = useState([])

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
          if (isNaN(response) || response < 1 || response > 100) {
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

              return [...removedDuplicate, message]
            } else {
              return [...prev, message]
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
    [isPollActive]
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
      }}
    >
      {children}
    </PollContext.Provider>
  )
}

export default PollProvider

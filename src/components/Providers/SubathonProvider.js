import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LanyardContext } from './LanyardProvider'
export const SubathonContext = createContext()

const SubathonProvider = ({ children }) => {
  const { kv } = useContext(LanyardContext)

  // Time remaining in seconds
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubathonActive, setIsSubathonActive] = useState(false)
  const [secondsInterval, setSecondsInterval] = useState(null)

  const setupInterval = useCallback(() => {
    if (secondsInterval) {
      clearInterval(secondsInterval)
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          clearInterval(secondsInterval)
          setIsSubathonActive(false)
          return 0
        } else {
          return newTime
        }
      })
    }, 1000)

    setSecondsInterval(interval)
  }, [secondsInterval])

  useEffect(() => {
    if (kv?.time_unit_base && kv?.stream_start_time && kv?.donation_amount) {
      // how long each $ should add to the subathon (in minutes)
      const timeUnitBase = parseFloat(kv.time_unit_base * 60)
      // when the stream started (unix timestamp)
      const streamStartTime = parseFloat(kv.stream_start_time)
      // how much has been donated
      const donationAmount = parseFloat(kv.donation_amount)

      // calculate how much time is left in the subathon
      const timeRemaining =
        streamStartTime - Date.now() / 1000 + donationAmount * timeUnitBase

      setTimeRemaining(timeRemaining)
      setupInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kv])

  useEffect(() => {
    return () => clearInterval(secondsInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SubathonContext.Provider
      value={{
        timeRemaining,
        setTimeRemaining,
        isSubathonActive,
        setIsSubathonActive,
      }}
    >
      {children}
    </SubathonContext.Provider>
  )
}

export default SubathonProvider
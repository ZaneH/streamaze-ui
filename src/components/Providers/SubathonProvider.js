import { useInterval } from '@mantine/hooks'
import { createContext, useEffect, useState } from 'react'
import wretch from 'wretch'
import moment from 'moment'
export const SubathonContext = createContext()

const SubathonProvider = ({ children }) => {
  const [subathonStreamId, setSubathonStreamId] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubathonActive, setIsSubathonActive] = useState(false)

  const secondsInterval = useInterval(() => {
    setTimeRemaining((prev) => prev - 1)
  }, 1000)

  useEffect(() => {
    if (timeRemaining <= 0 && isSubathonActive) {
      setIsSubathonActive(false)
      wretch(`http://localhost:4000/api/live_streams/${subathonStreamId}`)
        .patch({
          subathon_ended_time: moment().utc().toISOString(),
        })
        .res(() => {
          secondsInterval.stop()
          setIsSubathonActive(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining])

  useEffect(() => {
    secondsInterval.start()
    return secondsInterval.stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SubathonContext.Provider
      value={{
        subathonStreamId,
        setSubathonStreamId,
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

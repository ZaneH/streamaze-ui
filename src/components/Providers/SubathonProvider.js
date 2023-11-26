/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { useInterval } from '@mantine/hooks'
import { createContext, useEffect, useState } from 'react'
import wretch from 'wretch'
import moment from 'moment'
export const SubathonContext = createContext()

const SubathonProvider = ({ children }) => {
  const [activeStreamId, setActiveStreamId] = useState(null) // TODO: Move this out of SubathonProvider
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubathonActive, setIsSubathonActive] = useState(false)

  const secondsInterval = useInterval(() => {
    setTimeRemaining((prev) => Math.max(0, prev - 1))
  }, 1000)

  useEffect(() => {
    if (timeRemaining <= 0 && isSubathonActive) {
      wretch(
        `${process.env.REACT_APP_API_3_URL}/api/live_streams/${activeStreamId}`
      )
        .patch({
          subathon_ended_time: moment().utc().toISOString(),
        })
        .res(() => {
          secondsInterval.stop()
          setIsSubathonActive(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, secondsInterval])

  useEffect(() => {
    secondsInterval.start()
    return secondsInterval.stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SubathonContext.Provider
      value={{
        activeStreamId,
        setActiveStreamId,
        timeRemaining,
        setTimeRemaining,
        isSubathonActive,
        setIsSubathonActive,
        secondsInterval,
      }}
    >
      {children}
    </SubathonContext.Provider>
  )
}

export default SubathonProvider

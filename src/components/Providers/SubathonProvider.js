import { useInterval } from '@mantine/hooks'
import { createContext, useEffect, useState } from 'react'
export const SubathonContext = createContext()

const SubathonProvider = ({ children }) => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubathonActive, setIsSubathonActive] = useState(false)

  const secondsInterval = useInterval(() => {
    setTimeRemaining((prev) => prev - 1)
  }, 1000)

  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsSubathonActive(false)
    }
  }, [timeRemaining])

  useEffect(() => {
    secondsInterval.start()
    return secondsInterval.stop
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

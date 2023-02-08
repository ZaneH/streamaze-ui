import { createContext, useContext } from 'react'
import { useLanyardWS } from 'use-lanyard'
import { ConfigContext } from './ConfigProvider'
export const LanyardContext = createContext()

const LanyardProvider = ({ children }) => {
  const { lanyardConfig } = useContext(ConfigContext)
  const { discordUserId } = lanyardConfig

  const data = useLanyardWS(discordUserId)
  const kv = data?.kv

  return (
    <LanyardContext.Provider value={{ kv }}>{children}</LanyardContext.Provider>
  )
}

export default LanyardProvider

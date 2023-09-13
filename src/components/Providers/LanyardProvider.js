import { createContext, useCallback, useContext } from 'react'
import { useLanyardWS } from 'use-lanyard'
import { ConfigContext } from './ConfigProvider'
import wretch from 'wretch'
export const LanyardContext = createContext()

const LanyardProvider = ({ children }) => {
  const { lanyardConfig } = useContext(ConfigContext)
  const { discordUserId, apiKey } = lanyardConfig

  const data = useLanyardWS(discordUserId, {
    api: {
      hostname: discordUserId ? 'api.lanyard.rest' : undefined,
      secure: true,
    },
  })

  const kv = data?.kv

  const updateKV = useCallback(
    (key, value) => {
      return new Promise((resolve, reject) => {
        if (!discordUserId || !apiKey) {
          console.error('Missing discordUserId or apiKey')
          reject()
          return
        }

        wretch(`${process.env.REACT_APP_API_2_URL}/kv/set`)
          .post({
            key,
            value,
            discordUserId,
            apiKey,
          })
          .res((res) => {
            if (res.ok) {
              resolve()
            } else {
              console.error(res)
              reject()
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    [discordUserId, apiKey]
  )

  return (
    <LanyardContext.Provider value={{ kv, updateKV }}>
      {children}
    </LanyardContext.Provider>
  )
}

export default LanyardProvider

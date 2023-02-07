import { showNotification } from '@mantine/notifications'
import { createContext, useContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { ConfigContext } from './ConfigProvider'
export const LanyardContext = createContext()

const { REACT_APP_API_2_WS_URL } = process.env

const LanyardProvider = ({ children }) => {
  const { lanyardConfig } = useContext(ConfigContext)
  const { discordUserId, apiKey } = lanyardConfig
  const [lanyardData, setLanyardData] = useState({})

  const {
    lastJsonMessage: lastLanyardMessage,
    sendJsonMessage: sendLanyardMessage,
  } = useWebSocket(
    REACT_APP_API_2_WS_URL,
    {
      retryOnError: true,
      reconnectInterval: 10000,
      shouldReconnect: () => true,
      onError: () => {
        showNotification({
          title: 'Chat Error',
          message: "Couldn't connect to the Lanyard API.",
          color: 'red',
        })
      },
      onOpen: () => {
        const params = {}
        if (discordUserId) {
          params['discordUserId'] = discordUserId
        }

        if (apiKey) {
          params['lanyardApiKey'] = apiKey
        }

        sendLanyardMessage(params)
      },
    },
    !!discordUserId
  )

  useEffect(() => {
    if (lastLanyardMessage) {
      setLanyardData(lastLanyardMessage)
    }
  }, [lastLanyardMessage])

  return (
    <LanyardContext.Provider
      value={{
        lanyardData,
      }}
    >
      {children}
    </LanyardContext.Provider>
  )
}

export default LanyardProvider

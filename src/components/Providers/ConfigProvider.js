import { useLocalStorage } from '@mantine/hooks'
import { createContext } from 'react'
export const ConfigContext = createContext()

const ConfigProvider = ({ children }) => {
  // Chat config
  const [chatConfig, setChatConfig] = useLocalStorage({
    key: 'chat-sources',
    getInitialValueInEffect: true,
    defaultValue: {
      configName: 'example',
      twitch: {
        enabled: false,
        handle: '',
      },
      tiktok: {
        enabled: false,
        handle: '',
      },
      youtube: {
        enabled: false,
        channel: '',
      },
    },
  })

  // OBS config
  const [obsConfig, setObsConfig] = useLocalStorage({
    key: 'obs-config',
    getInitialValueInEffect: false,
    defaultValue: {
      streamChannelId: '',
    },
  })

  // StatCard config
  const [statsConfig, setStatsConfig] = useLocalStorage({
    key: 'stats-config',
    getInitialValueInEffect: false,
    defaultValue: {
      tiktokUsername: '',
      twitchUsername: '',
      youtubeChannel: '',
    },
  })

  return (
    <ConfigContext.Provider
      value={{
        chatConfig,
        setChatConfig,
        obsConfig,
        setObsConfig,
        statsConfig,
        setStatsConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider

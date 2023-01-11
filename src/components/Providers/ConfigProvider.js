import { useLocalStorage } from '@mantine/hooks'
import { createContext } from 'react'
export const SidebarContext = createContext()

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
      connectionId: '',
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
    <SidebarContext.Provider
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
    </SidebarContext.Provider>
  )
}

export default ConfigProvider

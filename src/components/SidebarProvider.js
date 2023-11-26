/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { useLocalStorage } from '@mantine/hooks'
import { createContext, useState } from 'react'
export const SidebarContext = createContext()

const SidebarProvider = ({ children }) => {
  const [startDraggingWidth, setStartDraggingWidth] = useState(300)

  // Sidebar config (persisted in localStorage)
  const [sidebarConfig, setSidebarConfig] = useLocalStorage({
    key: 'sidebar-config',
    getInitialValueInEffect: true,
    defaultValue: {
      width: 300,
      opened: false,
    },
  })

  // Theme config
  const [themeConfig, setThemeConfig] = useLocalStorage({
    key: 'active-theme',
    getInitialValueInEffect: true,
    defaultValue: {
      name: 'default',
    },
  })

  // Chat config
  const [chatConfig, setChatConfig] = useLocalStorage({
    key: 'chat-sources',
    getInitialValueInEffect: true,
    defaultValue: {
      example: {
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
    },
  })

  // Chat config name
  const [chatConfigName, setChatConfigName] = useLocalStorage({
    key: 'chat-source-name',
    getInitialValueInEffect: true,
    defaultValue: 'example',
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
        chatSidebarOpened: sidebarConfig.opened,
        setChatSidebarOpened: (opened) =>
          setSidebarConfig({ ...sidebarConfig, opened }),
        width: sidebarConfig.width,
        setWidth: (width) => setSidebarConfig({ ...sidebarConfig, width }),
        startDraggingWidth,
        setStartDraggingWidth,
        chatConfig,
        setChatConfig,
        chatConfigName,
        setChatConfigName,
        themeConfig,
        setThemeConfig,
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

export default SidebarProvider

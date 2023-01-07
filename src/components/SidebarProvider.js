import { useLocalStorage } from '@mantine/hooks'
import { createContext, useState } from 'react'
export const SidebarContext = createContext()

const SidebarProvider = ({ children }) => {
  const [startDraggingWidth, setStartDraggingWidth] = useState(300)
  const [chats, setChats] = useState()

  // Sidebar config (persisted in localStorage)
  const [config, setConfig] = useLocalStorage({
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

  return (
    <SidebarContext.Provider
      value={{
        chatSidebarOpened: config.opened,
        setChatSidebarOpened: (opened) => setConfig({ ...config, opened }),
        width: config.width,
        setWidth: (width) => setConfig({ ...config, width }),
        startDraggingWidth,
        setStartDraggingWidth,
        chats,
        setChats,
        themeConfig: themeConfig,
        setThemeConfig: setThemeConfig,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider

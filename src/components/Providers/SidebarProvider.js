import { createContext, useState } from 'react'
export const SidebarContext = createContext()

const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider

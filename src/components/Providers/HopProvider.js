import { useReadChannelState } from '@onehop/react'
import { createContext, useContext } from 'react'
import { ConfigContext } from './ConfigProvider'
export const HopContext = createContext()

const HopProvider = ({ children }) => {
  const { obsConfig } = useContext(ConfigContext)
  const { state, error } = useReadChannelState(obsConfig?.streamChannelId)

  const serverState = state?.server?.state ?? 'error'
  const isLive = state?.stream_live === true
  const isError = error || serverState === 'error'
  const streamScenes = state?.server?.scenes ?? []
  const streamActiveScene = state?.server?.active_scene ?? ''

  return (
    <HopContext.Provider
      value={{
        hopState: state,
        hopError: isError,
        isStreamLive: isLive,
        streamScenes,
        streamActiveScene,
      }}
    >
      {children}
    </HopContext.Provider>
  )
}

export default HopProvider

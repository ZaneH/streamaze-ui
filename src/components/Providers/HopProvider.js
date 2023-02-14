import { useReadChannelState } from '@onehop/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { ConfigContext } from './ConfigProvider'
import ErrorChime from 'assets/error_chime.mp3'
import { showNotification } from '@mantine/notifications'
import DisconnectModal from 'components/Modals/DisconnectModal'
export const HopContext = createContext()

const HopProvider = ({ children }) => {
  const { obsConfig } = useContext(ConfigContext)

  const { state, error } = useReadChannelState(obsConfig.streamChannelId)

  const serverState = state?.server?.state ?? 'error'
  const isLive = state?.stream_live === true
  const isError = error || serverState === 'error'
  const streamScenes = state?.server?.scenes ?? []
  const streamActiveScene = state?.server?.active_scene ?? ''
  const bitrate = state?.rtmp?.bitrate ?? 0

  const [showDisconnectedModal, setShowDisconnectedModal] = useState(false)

  useEffect(() => {
    if (bitrate === 0 && isLive) {
      const chime = new Audio(ErrorChime)
      chime.play()

      setShowDisconnectedModal(true)
    } else {
      if (showDisconnectedModal) {
        setShowDisconnectedModal(false)
      }
    }
  }, [bitrate, isLive])

  return (
    <HopContext.Provider
      value={{
        serverState,
        hopError: isError,
        isLive,
        streamScenes,
        streamActiveScene,
        bitrate,
      }}
    >
      <DisconnectModal
        isOpen={showDisconnectedModal}
        onClose={() => setShowDisconnectedModal(false)}
      />
      {children}
    </HopContext.Provider>
  )
}

export default HopProvider

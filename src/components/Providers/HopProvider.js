import { useReadChannelState } from '@onehop/react'
import ErrorChime from 'assets/error_chime.mp3'
import DisconnectModal from 'components/Modals/DisconnectModal'
import { createContext, useContext, useEffect, useState } from 'react'
import { ConfigContext } from './ConfigProvider'
import { useLocation } from 'react-router-dom'
export const HopContext = createContext()

const HopProvider = ({ children }) => {
  const { obsConfig } = useContext(ConfigContext)
  const { state, error } = useReadChannelState(obsConfig.streamChannelId)

  const serverState = state?.server?.state ?? 'error'
  const isLive = state?.stream_live === true
  const isError = error || serverState === 'error'
  const streamScenes = state?.server?.scenes ?? []
  const streamActiveScene = state?.server?.active_scene ?? ''
  const bitrate = state?.srt?.bitrate ?? 0
  const rtt = state?.srt?.rtt ?? 0
  const uptime = state?.srt?.uptime ?? 0
  const { pathname } = useLocation()

  const [showDisconnectedModal, setShowDisconnectedModal] = useState(false)

  useEffect(() => {
    if (bitrate <= 500 && isLive && pathname === '/home') {
      const chime = new Audio(ErrorChime)
      chime.play()

      setShowDisconnectedModal(true)
    } else {
      if (showDisconnectedModal) {
        setShowDisconnectedModal(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        rtt,
        uptime,
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

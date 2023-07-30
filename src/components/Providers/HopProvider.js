import { showNotification } from '@mantine/notifications'
import { useReadChannelState } from '@onehop/react'
import { IconMusic } from '@tabler/icons'
import ErrorChime from 'assets/error_chime.mp3'
import DisconnectModal from 'components/Modals/DisconnectModal'
import debounce from 'lodash.debounce'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ConfigContext } from './ConfigProvider'
import { DonationContext } from './DonationProvider'
export const HopContext = createContext()

const HopProvider = ({ children }) => {
  const { obsConfig } = useContext(ConfigContext)
  const { audioElement } = useContext(DonationContext)
  const { state, error } = useReadChannelState(obsConfig.streamChannelId)
  const { state: meIrlState } = useReadChannelState('me_irl:sam')

  const serverState = state?.server?.state ?? 'error'
  const isLive = state?.stream_live === true
  const isError = error || serverState === 'error'
  const streamScenes = state?.server?.scenes ?? []
  const streamActiveScene = state?.server?.active_scene ?? ''
  const bitrate = state?.srt?.bitrate ?? 0
  const rtt = state?.srt?.rtt ?? 0
  const uptime = state?.srt?.uptime ?? 0
  const { artist, title } = meIrlState?.listening_to ?? {}

  const { pathname } = useLocation()

  const [showDisconnectedModal, setShowDisconnectedModal] = useState(false)
  const [previouslyShownListeningTo, setPreviouslyShownListeningTo] = useState(
    {}
  )

  const playChimeWithDebounce = useMemo(() => {
    const callback = () => {
      audioElement.src = ErrorChime

      setShowDisconnectedModal(true)
    }

    return debounce(callback, 5000)
  }, [audioElement])

  const showListeningToNotifWithDebounce = useMemo(() => {
    const callback = () => {
      showNotification({
        title: 'Song Detected',
        message: `${artist} - ${title}`,
        autoClose: 10_000,
        icon: <IconMusic style={{ width: 16, height: 16 }} />,
      })
    }

    return debounce(callback, 5000)
  }, [artist, title])

  useEffect(() => {
    if (bitrate <= 500 && isLive && pathname === '/dashboard') {
      if (state?.server?.active_scene?.toLowerCase() !== 'news') {
        playChimeWithDebounce()
      }
    } else {
      if (showDisconnectedModal) {
        setShowDisconnectedModal(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitrate, isLive])

  useEffect(() => {
    if (artist && title) {
      if (
        previouslyShownListeningTo.artist !== artist ||
        previouslyShownListeningTo.title !== title
      ) {
        showListeningToNotifWithDebounce()
        setPreviouslyShownListeningTo({ artist, title })
      }
    } else {
      if (
        previouslyShownListeningTo.artist &&
        previouslyShownListeningTo.title
      ) {
        setPreviouslyShownListeningTo({})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist, title])

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
        listeningTo: {
          artist,
          title,
        },
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

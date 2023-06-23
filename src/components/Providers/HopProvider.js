import { useReadChannelState } from '@onehop/react'
import ErrorChime from 'assets/error_chime.mp3'
import DisconnectModal from 'components/Modals/DisconnectModal'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ConfigContext } from './ConfigProvider'
import { useLocation } from 'react-router-dom'
import { DonationContext } from './DonationProvider'
import debounce from 'lodash.debounce'
import ListeningToModal from 'components/Modals/ListeningToModal'
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
  const [showListeningToModal, setShowListeningToModal] = useState(false)
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

  const showListeningToModalWithDebounce = useMemo(() => {
    const callback = () => {
      setShowListeningToModal(true)
    }

    return debounce(callback, 5000)
  }, [])

  useEffect(() => {
    if (bitrate <= 500 && isLive && pathname === '/home') {
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
        showListeningToModalWithDebounce()
        setPreviouslyShownListeningTo({ artist, title })
      }
    } else {
      if (showListeningToModal) {
        setShowListeningToModal(false)
      }

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
      <ListeningToModal
        isOpen={showListeningToModal}
        onClose={() => setShowListeningToModal(false)}
        listeningTo={{ artist, title }}
      />
      {children}
    </HopContext.Provider>
  )
}

export default HopProvider

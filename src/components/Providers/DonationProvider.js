import { useInterval } from '@mantine/hooks'
import PeppersAudio from 'assets/peppers_in_the_chat.mp3'
import { createContext, useContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { ConfigContext } from './ConfigProvider'

export const DonationContext = createContext()

const DonationProvider = ({ children }) => {
  // Store donations
  const [donations, setDonations] = useState([])

  // For determining when to show/play the next donation
  const [donationIndex, setDonationIndex] = useState(-1)

  const [isAutoplay, setIsAutoplay] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [ttsAudio, setTTSAudio] = useState(null)
  const [playingMediaId, setPlayingMediaId] = useState(null)

  const { slobsConfig } = useContext(ConfigContext)
  const { readyState, sendJsonMessage } = useWebSocket(
    `${process.env.REACT_APP_API_2_WS_URL}`,
    {
      onOpen: () => {
        sendJsonMessage({
          streamToken: slobsConfig?.streamToken,
        })
      },
    }
  )

  const ttsInterval = useInterval(() => {
    if (
      donations.length > 0 &&
      donations.length > donationIndex &&
      isAutoplay &&
      !isPlaying
    ) {
      setIsPlaying(true)
      setDonationIndex((prev) => prev + 1)

      const currentDonation = donations[donationIndex]

      let ttsUrl = currentDonation?.data?.tts_url

      if (currentDonation?.type === 'mediaShareEvent') {
        setPlayingMediaId(currentDonation?.data?.donation_id)

        return
      }

      if (!ttsUrl) {
        ttsUrl = PeppersAudio
      }

      if (ttsUrl) {
        const _audio = new Audio(ttsUrl)

        _audio.play()

        _audio.addEventListener('ended', () => {
          setIsPlaying(false)
        })

        setTTSAudio(_audio)
      } else {
        setIsPlaying(false)
      }
    }
  }, 500) // delay between donations

  // refresh loops when data changes
  useEffect(() => {
    ttsInterval.stop()
    ttsInterval.start()
  }, [isAutoplay, ttsInterval])

  useEffect(() => {
    ttsInterval.start()

    return () => {
      ttsInterval.stop()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <DonationContext.Provider
      value={{
        donations,
        setDonations,
        donationIndex,
        setDonationIndex,
        isAutoplay,
        setIsAutoplay,
        ttsAudio,
        setTTSAudio,
        isPlaying,
        setIsPlaying,
        playingMediaId,
        setPlayingMediaId,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}

export default DonationProvider

import { useInterval } from '@mantine/hooks'
import { createContext, useEffect, useState } from 'react'
import PeppersAudio from 'assets/peppers_in_the_chat.mp3'

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
        const mediaDuration = currentDonation?.data?.duration
        setPlayingMediaId(currentDonation?.data?.donation_id)

        setTimeout(() => {
          setPlayingMediaId(null)
          setIsPlaying(false)
        }, mediaDuration)

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

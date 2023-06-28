import { useInterval } from '@mantine/hooks'
import PeppersAudio from 'assets/peppers_in_the_chat.mp3'
import { createContext, useContext, useEffect, useState } from 'react'
import { ConfigContext } from './ConfigProvider'

export const DonationContext = createContext()

const DonationProvider = ({ children }) => {
  // Store donations
  const [donations, setDonations] = useState([])
  const [audioElement] = useState(new Audio())
  const [blankAudio] = useState(new Audio())

  // For determining when to show/play the next donation
  const [donationIndex, setDonationIndex] = useState(-1)
  const [prevDonationIndex, setPrevDonationIndex] = useState(-1)

  const [isAutoplay, setIsAutoplay] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [ttsAudio, setTTSAudio] = useState(null)
  const [playingMediaId, setPlayingMediaId] = useState(null)

  const { slobsConfig } = useContext(ConfigContext)

  const ttsInterval = useInterval(() => {
    if (
      donations.length > 0 &&
      donations.length > donationIndex &&
      isAutoplay &&
      !isPlaying
    ) {
      setIsPlaying(true)
      if (prevDonationIndex > -1) {
        setDonationIndex(prevDonationIndex)
        setPrevDonationIndex(-1)
      } else {
        setDonationIndex((prev) => prev + 1)
      }

      const currentDonation = donations[donationIndex]

      let ttsUrl = currentDonation?.data?.metadata?.tts_url

      if (
        // TODO: mediaShareEvent is the legacy type, remove later
        currentDonation?.type === 'mediaShareEvent' ||
        currentDonation?.type === 'streamlabs_media'
      ) {
        setPlayingMediaId(currentDonation?.data?.metadata?.donation_id)

        return
      }

      const isOverMinAmount =
        parseFloat(currentDonation?.data?.amount) >
        (slobsConfig?.ttsDollarMin ?? 0)

      if (!ttsUrl) {
        ttsUrl = PeppersAudio
      }

      if (ttsUrl && isOverMinAmount) {
        audioElement.src = ttsUrl

        audioElement.play().catch((err) => {
          console.log(err)
          setIsPlaying(false)
        })

        const endedListener = audioElement.addEventListener('ended', () => {
          setIsPlaying(false)

          audioElement.removeEventListener('ended', endedListener)
        })

        setTTSAudio(audioElement)
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
        prevDonationIndex,
        setPrevDonationIndex,
        isAutoplay,
        setIsAutoplay,
        ttsAudio,
        setTTSAudio,
        isPlaying,
        setIsPlaying,
        playingMediaId,
        setPlayingMediaId,
        audioElement,
        blankAudio,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}

export default DonationProvider

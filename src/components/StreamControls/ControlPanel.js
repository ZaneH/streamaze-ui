import { Flex, Space } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ReactComponent as IconPause } from 'assets/pause-icon.svg'
import { ReactComponent as PlayIcon } from 'assets/play-icon.svg'
import { ReactComponent as SkipIcon } from 'assets/skip-icon.svg'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { useContext } from 'react'
import { DonationContext } from '../Providers/DonationProvider'
import { HopContext } from '../Providers/HopProvider'
import StreamButton from './StreamButton'

const ControlPanel = () => {
  const { hopError, streamActiveScene, streamScenes } = useContext(HopContext)
  const { streamerChannel } = useContext(PhoenixContext)
  const {
    donations,
    isAutoplay,
    setIsAutoplay,
    ttsAudio,
    setIsPlaying,
    donationIndex,
    setDonationIndex,
    isPlaying,
    playingMediaId,
    setPlayingMediaId,
    audioElement,
    blankAudio,
  } = useContext(DonationContext)

  return (
    <Flex direction="column">
      <Flex>
        <StreamButton
          color={isAutoplay ? 'red' : 'green'}
          icon={
            isAutoplay ? (
              <IconPause width="32" height="32" />
            ) : (
              <PlayIcon width="20" height="32" />
            )
          }
          onClick={() => {
            setIsAutoplay((prev) => !prev)
            audioElement.autoplay = true
            audioElement.src =
              'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

            blankAudio.autoplay = true
            blankAudio.src =
              'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

            if (donationIndex === -1) {
              setDonationIndex(0)
            }
          }}
        />
        <StreamButton
          color="blue"
          icon={<SkipIcon width="36" height="36" />}
          disabled={
            // skip button should only show when there are donations playing
            donationIndex === -1 ||
            (donationIndex === donations.length && !isPlaying)
          }
          onClick={() => {
            if (playingMediaId) {
              setPlayingMediaId(null)
              setIsPlaying(false)
            }

            if (ttsAudio) {
              ttsAudio.pause()
              ttsAudio.currentTime = 0
              setIsPlaying(false)
            }
          }}
        />
      </Flex>

      <Space h="sm" />

      <Flex style={{ boxSizing: 'border-box', flexWrap: 'wrap' }}>
        {streamScenes.map((scene, i) => {
          const isActive = streamActiveScene === scene
          return (
            <StreamButton
              key={scene}
              disabled={hopError || isActive}
              requireConfirmation
              color={isActive ? 'disabled' : i % 2 === 0 ? 'red' : 'purple'}
              onClick={() => {
                const resp = streamerChannel.push('switch_scene', { scene })
                resp.receive('ok', () => {
                  showNotification({
                    title: 'Success',
                    message: `Scene switched to ${scene}`,
                    color: 'green',
                  })
                })

                resp.receive('error', () => {
                  showNotification({
                    title: 'Error',
                    message: `Failed to switch scene to ${scene}`,
                    color: 'red',
                  })
                })
              }}
              style={{
                width: '50%',
                flexGrow: 1,
                boxSizing: 'border-box',
              }}
            >
              {scene}
            </StreamButton>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default ControlPanel

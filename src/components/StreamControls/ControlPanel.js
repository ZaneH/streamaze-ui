import { Flex, Space } from '@mantine/core'
import { useContext } from 'react'
import { ReactComponent as PlayIcon } from '../../play-icon.svg'
import { ReactComponent as SkipIcon } from '../../skip-icon.svg'
import { HopContext } from '../Providers/HopProvider'
import StreamButton from './StreamButton'
import wretch from 'wretch'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from '../Providers/ConfigProvider'
import { DonationContext } from '../Providers/DonationProvider'
import { ReactComponent as IconPause } from '../../pause-icon.svg'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'

const ControlPanel = () => {
  const { hopError, streamActiveScene, streamScenes } = useContext(HopContext)
  const { timestampConfig } = useContext(ConfigContext)
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
                streamerChannel.push('switch_scene', { scene })
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

      <Space h="sm" />

      <StreamButton
        color="orange"
        disabled={!timestampConfig?.discordChannelId}
        onClick={() => {
          wretch(`${process.env.REACT_APP_API_URL}/timestamp/push`)
            .post({
              discord_channel: timestampConfig?.discordChannelId,
              youtube_channel: timestampConfig?.youtubeChannel,
              timestamp: new Date().toUTCString(),
            })
            .res((res) => {
              if (res.ok) {
                showNotification({
                  title: 'Success',
                  message: 'Timestamp sent to Discord!',
                  color: 'green',
                })
              }
            })
            .catch(() => {
              showNotification({
                title: 'Error',
                message:
                  'Something went wrong. Check your settings and try again.',
                color: 'red',
              })
            })
        }}
      >
        Clip
      </StreamButton>
    </Flex>
  )
}

export default ControlPanel

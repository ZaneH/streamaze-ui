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

const { REACT_APP_API_URL } = process.env

const ControlPanel = () => {
  const { hopError } = useContext(HopContext)
  const { timestampConfig } = useContext(ConfigContext)
  const {
    donations,
    isAutoplay,
    setIsAutoplay,
    ttsQueue,
    setTTSQueue,
    ttsAudio,
    setIsPlaying,
  } = useContext(DonationContext)

  return (
    <Flex direction="column">
      <Flex>
        <StreamButton
          color={isAutoplay ? 'red' : 'green'}
          icon={isAutoplay ? <IconPause /> : <PlayIcon />}
          disabled={donations.length === 0}
          onClick={() => {
            setIsAutoplay((prev) => !prev)
          }}
        />
        <StreamButton
          color="blue"
          icon={<SkipIcon />}
          disabled={ttsQueue.length === 0}
          onClick={() => {
            if (ttsAudio) {
              ttsAudio.pause()
              ttsAudio.currentTime = 0
              setIsPlaying(false)
            }

            setTTSQueue((prev) => prev.slice(1))
          }}
        />
      </Flex>

      <Space h="sm" />

      {/* TODO: Dynamically load available scenes as buttons */}
      <StreamButton
        color="red"
        disabled={hopError}
        onClick={() => {
          wretch(`${REACT_APP_API_URL}/obs/switch-scene`)
            .post({
              scene_name: 'Hidden',
            })
            .json((res) => {
              if (res?.error) {
                throw new Error(res.error)
              }

              showNotification({
                title: 'Success',
                message: res?.message,
                color: 'teal',
              })
            })
            .catch(({ message }) => {
              showNotification({
                title: 'OBS Error',
                color: 'red',
                message,
              })
            })
        }}
      >
        BRB
      </StreamButton>
      <StreamButton
        color="purple"
        disabled={hopError}
        onClick={() => {
          wretch(`${REACT_APP_API_URL}/obs/switch-scene`)
            .post({
              scene_name: 'Main',
            })
            .json((res) => {
              if (res?.error) {
                throw new Error(res.error)
              }

              showNotification({
                title: 'Success',
                message: res?.message,
                color: 'teal',
              })
            })
            .catch(({ message }) => {
              showNotification({
                title: 'OBS Error',
                color: 'red',
                message,
              })
            })
        }}
      >
        Main
      </StreamButton>

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

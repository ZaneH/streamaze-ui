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

const { REACT_APP_LANYARD_API_ENDPOINT } = process.env

const ControlPanel = () => {
  const { hopError, streamActiveScene, streamScenes } = useContext(HopContext)
  const { setGpsConfig, gpsConfig, lanyardConfig } = useContext(ConfigContext)
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
  const { currentStreamer } = useContext(PhoenixContext)

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

      <Space h="sm" />

      <StreamButton
        color="orange"
        onClick={() => {
          const newValue = !gpsConfig?.isGpsEnabled

          if (!newValue) {
            fetch(
              `${REACT_APP_LANYARD_API_ENDPOINT}/${lanyardConfig?.discordUserId}/kv/gps`,
              {
                headers: {
                  authorization: lanyardConfig?.apiKey,
                },
                method: 'PUT',
                body: JSON.stringify({
                  coords: null,
                  last_updated_at: new Date().toISOString(),
                }),
              }
            )
          }

          wretch(
            `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer?.id}`
          )
            .patch({
              lanyard_config: {
                discord_user_id: lanyardConfig?.discordUserId,
                api_key: lanyardConfig?.apiKey,
                is_gps_enabled: newValue ? 'true' : 'false',
              },
            })
            .res(() => {
              showNotification({
                message: 'GPS settings updated',
                color: 'teal',
              })
            })
            .catch(() => {
              showNotification({
                message: 'Error updating GPS settings',
                color: 'red',
              })
            })

          setGpsConfig((prev) => {
            return {
              ...prev,
              isGpsEnabled: newValue,
            }
          })
        }}
      >
        Turn GPS {gpsConfig?.isGpsEnabled ? 'off' : 'on'}
      </StreamButton>
    </Flex>
  )
}

export default ControlPanel

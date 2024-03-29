/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { showNotification } from '@mantine/notifications'
import useStreamer from 'hooks/useStreamer'
import { Socket } from 'phoenix'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { calculateTimeRemaining } from 'utils/time'
import { ConfigContext } from './ConfigProvider'
import { DonationContext } from './DonationProvider'
import { StatContext } from './StatProvider'
import { SubathonContext } from './SubathonProvider'
import { useInterval } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import wretch from 'wretch'

export const PhoenixContext = createContext()
const { REACT_APP_API_2_URL } = process.env

const PhoenixProvider = ({
  children,
  options = {
    hasMazeConnection: false,
  },
}) => {
  const [socket, setSocket] = useState(null)
  const [streamerChannel, setStreamerChannel] = useState(null)
  const [mazeChannel, setMazeChannel] = useState(null)
  const { setDonations, setDonationIndex, setDonationAlertUrl } =
    useContext(DonationContext)
  const { setTimeRemaining, setActiveStreamId, setIsSubathonActive } =
    useContext(SubathonContext)
  const { pathname } = useLocation()
  const {
    setNetProfit,
    setStreamStartTime,
    setAllSubs,
    setKickSubs,
    setYoutubeSubs,
    setStatsOffset,
    setKickViewers,
  } = useContext(StatContext)
  const {
    userConfig,
    statsConfig,
    setLanyardConfig,
    setObsConfig,
    setChatConfig,
    setSlobsConfig,
    setTimestampConfig,
    setStatsConfig,
    setGpsConfig,
    setAdminConfig,
  } = useContext(ConfigContext)
  const streamer = useStreamer(userConfig?.streamazeKey)

  useEffect(() => {
    if (!streamer) return

    setLanyardConfig((prev) => ({
      ...prev,
      discordUserId: streamer?.lanyard_config?.discord_user_id,
      apiKey: streamer?.lanyard_config?.api_key,
    }))

    setGpsConfig((prev) => ({
      ...prev,
      isGpsEnabled: streamer?.lanyard_config?.is_gps_enabled === 'true',
    }))

    setObsConfig((prev) => ({
      ...prev,
      streamChannelId: streamer?.obs_config?.stream_channel_id,
    }))

    setChatConfig((prev) => ({
      ...prev,
      tiktok: {
        ...prev.tiktok,
        username: streamer?.chat_config?.tiktok_username,
      },
      youtube: {
        ...prev.youtube,
        channel: streamer?.chat_config?.youtube_channel,
      },
      kick: {
        ...prev.kick,
        channelId: streamer?.chat_config?.kick_channel_id,
        chatroomId: streamer?.chat_config?.kick_chatroom_id,
        channelName: streamer?.chat_config?.kick_channel_name,
      },
      twitch: {
        ...prev.twitch,
        username: streamer?.chat_config?.twitch_username,
      },
    }))

    setSlobsConfig((prev) => ({
      ...prev,
      streamToken: streamer?.donations_config?.streamlabs_token,
      ttsService: streamer?.donations_config?.tts_service,
      streamlabsVoice: streamer?.donations_config?.streamlabs_voice,
      elevenlabsVoice: streamer?.donations_config?.elevenlabs_voice,
      elevenlabsKey: streamer?.donations_config?.elevenlabs_key,
      tiktokUsername: streamer?.donations_config?.tiktok_username,
      silentAudioInterval: streamer?.donations_config?.silent_audio_interval,
      ttsDollarMin: streamer?.donations_config?.tts_dollar_min,
    }))

    setTimestampConfig((prev) => ({
      ...prev,
      discordChannelId: streamer?.clip_config?.discord_channel_id,
      youtubeChannel: streamer?.clip_config?.youtube_channel,
    }))

    setStatsConfig((prev) => ({
      ...prev,
      tiktokUsername: streamer?.viewers_config?.tiktok_username,
      twitchUsername: streamer?.viewers_config?.twitch_username,
      youtubeChannel: streamer?.viewers_config?.youtube_channel,
      kickChannelName: streamer?.viewers_config?.kick_channel_name,
    }))

    setAdminConfig((prev) => ({
      ...prev,
      role: streamer?.admin_config?.role,
      streamers: streamer?.admin_config?.streamers,
      obs_key: streamer?.admin_config?.obs_key,
    }))
  }, [
    streamer,
    setLanyardConfig,
    setObsConfig,
    setChatConfig,
    setSlobsConfig,
    setTimestampConfig,
    setStatsConfig,
    setGpsConfig,
    setAdminConfig,
  ])

  useEffect(() => {
    if (!userConfig?.streamazeKey) {
      showNotification({
        title: 'Streamaze Key Required',
        message: 'Please enter your Streamaze key in the settings page.',
      })
    }
  }, [userConfig?.streamazeKey])

  const updateKickViewers = useCallback(async () => {
    if (!statsConfig?.kickChannelName) {
      return
    }

    await wretch(
      `${REACT_APP_API_2_URL}/kick/viewers/${statsConfig?.kickChannelName}`
    )
      .get()
      .json((res) => {
        if (res?.viewers) {
          setKickViewers(res.viewers)
        } else {
          console.error(`Viewers not found: ${res}`)
        }
      })
      .catch((err) => {
        console.error(`Error fetching viewers: ${err}`)
      })
  }, [statsConfig?.kickChannelName, setKickViewers])

  const kickInterval = useInterval(async () => {
    if (pathname !== '/dashboard') {
      return
    }

    updateKickViewers()
  }, 60 * 1000) // 1 minute

  useEffect(() => {
    kickInterval.stop()
    kickInterval.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamerChannel])

  useEffect(() => {
    updateKickViewers()
    return kickInterval.stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const streamerSocket = new Socket(process.env.REACT_APP_API_3_WS_URL, {
      heartbeatIntervalMs: 30000,
    })

    setSocket(streamerSocket)

    return () => {
      if (socket) {
        console.log('disconnected')
        socket.disconnect()
        if (streamerChannel) {
          streamerChannel.leave()
        }

        if (mazeChannel) {
          mazeChannel.leave()
        }

        setSocket(null)
        setStreamerChannel(null)
        setMazeChannel(null)

        kickInterval.stop()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      !socket ||
      socket.isConnected() ||
      !streamer?.id ||
      !userConfig?.streamazeKey
    )
      return

    console.log(
      'connecting to streamer',
      streamer?.id,
      userConfig?.streamazeKey
    )

    socket.connect()

    const ch = socket.channel(`streamer:${streamer?.id}`, {
      userToken: userConfig?.streamazeKey,
    })

    if (options?.hasMazeConnection) {
      const mazeCh = socket.channel(`maze:${streamer?.id}`, {
        userToken: userConfig?.streamazeKey,
      })

      mazeCh.join().receive('ok', (_resp) => {
        setMazeChannel(mazeCh)
      })
    }

    ch.join().receive('ok', (_resp) => {
      setStreamerChannel(ch)
    })

    ch.on('expense', (payload) => {
      const { net_profit } = payload || {}
      setNetProfit(net_profit)
    })

    ch.on('subathon', (payload) => {
      const {
        subathon_seconds_added,
        subathon_start_time,
        subathon_start_minutes,
      } = payload || {}
      setTimeRemaining(() => {
        return calculateTimeRemaining(
          subathon_seconds_added,
          subathon_start_time,
          subathon_start_minutes
        )
      })
    })

    ch.on('donation', (payload) => {
      const { donation, net_profit } = payload || {}
      setNetProfit(net_profit)
      setDonations((prev) => [
        ...prev,
        {
          type: donation.type,
          data: {
            id: donation.id,
            name: donation.sender,
            message: donation.message,
            displayString: donation.display_string,
            amount: donation.amount_in_usd,
            currency: donation.value.currency,
            metadata: donation.metadata,
          },
        },
      ])
    })

    ch.on('statistic', (payload) => {
      const { all_subs, kick_subs, youtube_subs } = payload || {}
      setAllSubs(parseInt(all_subs))
      setKickSubs(parseInt(kick_subs))
      setYoutubeSubs(parseInt(youtube_subs))
    })

    ch.on('initial_state', (payload) => {
      const {
        active_stream: currentStream,
        net_profit: streamerNetProfit,
        last_10_donations: last10Donations,
        stats,
        viewers,
        stats_offset: offsets,
      } = payload || {}

      const seconds = calculateTimeRemaining(
        currentStream.subathon_seconds_added,
        currentStream.subathon_start_time,
        currentStream.subathon_start_minutes
      )

      if (currentStream.subathon_ended_time === null) {
        setIsSubathonActive(true)
        setTimeRemaining(seconds)
      }

      setNetProfit(streamerNetProfit)
      setDonationAlertUrl(payload.donation_alert_url)
      setDonationIndex(last10Donations.length)
      setActiveStreamId(currentStream.id)
      setStreamStartTime(currentStream.start_time)

      setDonations(
        last10Donations
          .map((donation) => {
            return {
              type: donation.type,
              data: {
                id: donation.id,
                name: donation.sender,
                message: donation.message,
                displayString: donation.display_string,
                amount: parseFloat(donation.amount_in_usd),
                currency: donation.value.currency,
                metadata: donation.metadata,
              },
            }
          })
          .reverse()
      )

      setAllSubs(stats?.all_subs ?? 0)
      setKickSubs(stats?.kick_subs ?? 0)
      setYoutubeSubs(stats?.youtube_subs ?? 0)
      setStatsOffset(offsets)

      setKickViewers(parseInt(viewers?.kick_count ?? 0))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, streamer?.id, userConfig?.streamazeKey])

  return (
    <PhoenixContext.Provider
      value={{
        socket,
        streamerChannel,
        mazeChannel,
        currentStreamer: streamer,
      }}
    >
      {children}
    </PhoenixContext.Provider>
  )
}

export default PhoenixProvider

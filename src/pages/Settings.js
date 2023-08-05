import {
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  PasswordInput,
  Select,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications, showNotification } from '@mantine/notifications'
import { ProviderProvider } from 'components/Providers'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import useElevenLabs from 'hooks/useElevenLabs'
import { useContext, useRef } from 'react'
import wretch from 'wretch'
import { ConfigContext } from '../components/Providers/ConfigProvider'
import { FieldLabel, FormSection } from '../components/Settings'
import TagSEO from '../components/TagSEO'
import { Layout } from '../components/document'

const { REACT_APP_LANYARD_API_ENDPOINT } = process.env

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <Settings />
    </ProviderProvider>
  )
}

const Settings = () => {
  const {
    userConfig,
    setUserConfig,
    chatConfig,
    setChatConfig,
    timestampConfig,
    setTimestampConfig,
    obsConfig,
    setObsConfig,
    statsConfig,
    setStatsConfig,
    slobsConfig,
    setSlobsConfig,
    lanyardConfig,
    setLanyardConfig,
    gpsConfig,
    setGpsConfig,
  } = useContext(ConfigContext)

  const { currentStreamer } = useContext(PhoenixContext)
  const { allVoices } = useElevenLabs(userConfig?.streamazeKey)
  const kickChannelNameRef = useRef(null)
  const kickChannelIdRef = useRef(null)
  const kickChatroomIdRef = useRef(null)

  const userForm = useForm({
    initialValues: {
      streamazeKey: userConfig?.streamazeKey,
    },
  })

  const chatForm = useForm({
    initialValues: {
      tiktok: chatConfig?.tiktok?.username,
      youtube: chatConfig?.youtube?.channel,
      twitch: chatConfig?.twitch?.channel,
      kickChannelName: chatConfig?.kick?.channelName,
      kickChannelId: chatConfig?.kick?.channelId,
      kickChatroomId: chatConfig?.kick?.chatroomId,
    },
  })

  const clipForm = useForm({
    initialValues: {
      discordChannelId: timestampConfig?.discordChannelId,
      youtubeChannel: timestampConfig?.youtubeChannel,
    },
  })

  const obsForm = useForm({
    initialValues: {
      streamChannelId: obsConfig.streamChannelId,
    },
  })

  const statsForm = useForm({
    initialValues: {
      tiktok: statsConfig.tiktokUsername,
      youtube: statsConfig.youtubeChannel,
      kick: statsConfig.kickChannelName,
    },
  })

  const slobsForm = useForm({
    initialValues: {
      streamToken: slobsConfig.streamToken,
      ttsService: slobsConfig.ttsService,
      streamlabsVoice: slobsConfig?.streamlabsVoice,
      elevenlabsVoice: slobsConfig?.elevenlabsVoice,
      elevenlabsKey: slobsConfig?.elevenlabsKey,
      tiktokUsername: slobsConfig?.tiktokUsername,
      silentAudioInterval: slobsConfig?.silentAudioInterval,
      ttsDollarMin: slobsConfig?.ttsDollarMin,
    },
  })

  const lanyardForm = useForm({
    initialValues: {
      discordUserId: lanyardConfig?.discordUserId,
      apiKey: lanyardConfig?.apiKey,
    },
  })

  const gpsForm = useForm({
    initialValues: {
      isGpsEnabled: gpsConfig?.isGpsEnabled,
    },
  })

  return (
    <Layout>
      <TagSEO title="Streamaze | Settings" />
      <Container size="sm" pt="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setUserConfig((prev) => ({
              ...prev,
              streamazeKey: userForm.values.streamazeKey,
            }))

            showNotification({
              title: 'Streamaze Key saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection title="Streamaze Key" subtitle="Sign in to Streamaze">
            <TextInput
              label="Streamaze Key"
              placeholder="api-xxxxxxxxxxxx"
              type="password"
              defaultValue={userForm.values.streamazeKey}
              onChange={(e) => {
                userForm.setFieldValue('streamazeKey', e.target.value)
              }}
            />
          </FormSection>
        </form>

        {userConfig?.streamazeKey && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setChatConfig((prev) => ({
                  ...prev,
                  tiktok: {
                    ...prev.tiktok,
                    username: chatForm.values.tiktok,
                  },
                  youtube: {
                    ...prev.youtube,
                    channel: chatForm.values.youtube,
                  },
                  kick: {
                    ...prev.kick,
                    channelId: chatForm.values.kickChannelId,
                    chatroomId: chatForm.values.kickChatroomId,
                    channelName: chatForm.values.kickChannelName,
                  },
                  twitch: {
                    ...prev.twitch,
                    channel: chatForm.values.twitch,
                  },
                }))

                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    chat_config: {
                      tiktok_username: chatForm.values.tiktok,
                      youtube_channel: chatForm.values.youtube,
                      kick_channel_id: chatForm.values.kickChannelId,
                      kick_chatroom_id: chatForm.values.kickChatroomId,
                      kick_channel_name: chatForm.values.kickChannelName,
                      twitch_channel: chatForm.values.twitch,
                    },
                  })
                  .res((res) => {
                    if (res.ok) {
                      showNotification({
                        title: 'Chat Settings saved!',
                        color: 'teal',
                      })
                    }
                  })
                  .catch(() => {
                    showNotification({
                      title: 'Error saving Chat Settings',
                      color: 'red',
                    })
                  })
              }}
            >
              <FormSection
                title="Chat Settings"
                subtitle="Merge many livestream chats into one"
              >
                <TextInput
                  label={<FieldLabel>TikTok Username</FieldLabel>}
                  placeholder="john.smith"
                  defaultValue={chatForm.values.tiktok}
                  onChange={(e) => {
                    chatForm.setFieldValue('tiktok', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>YouTube Channel URL</FieldLabel>}
                  placeholder="https://youtube.com/c/john.smith"
                  defaultValue={chatForm.values.youtube}
                  onChange={(e) => {
                    chatForm.setFieldValue('youtube', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>Twitch Channel Name</FieldLabel>}
                  placeholder="johnsmith"
                  defaultValue={chatForm.values.twitch}
                  onChange={(e) => {
                    chatForm.setFieldValue('twitch', e.target.value)
                  }}
                />
                <Divider />
                <TextInput
                  ref={kickChannelNameRef}
                  label={<FieldLabel>Kick Channel Name</FieldLabel>}
                  placeholder="johnsmith"
                  defaultValue={chatForm.values.kickChannelName}
                  onChange={(e) => {
                    chatForm.setFieldValue('kickChannelName', e.target.value)
                  }}
                />
                <Button
                  w="min-content"
                  variant="outline"
                  mb="sm"
                  onClick={() => {
                    showNotification({
                      loading: true,
                      title: 'Fetching Kick IDs...',
                      message: 'This may take a few seconds',
                      color: 'blue',
                      id: 'kick-id-loading',
                    })

                    wretch(
                      `${process.env.REACT_APP_API_2_URL}/kick/ids/${kickChannelNameRef.current.value}`
                    )
                      .post()
                      .json()
                      .then((res) => {
                        const { ids } = res || {}
                        const { channel, chatrooms } = ids || {}

                        kickChannelIdRef.current.value = channel
                        kickChatroomIdRef.current.value = chatrooms

                        notifications.hide('kick-id-loading')
                      })
                      .catch((err) => {
                        showNotification({
                          title: 'Error fetching Kick IDs',
                          message: err.message,
                          color: 'red',
                        })
                      })
                  }}
                >
                  Fetch IDs from Channel Name
                </Button>
                <TextInput
                  ref={kickChannelIdRef}
                  label={<FieldLabel>Kick Channel ID</FieldLabel>}
                  placeholder="123456"
                  defaultValue={chatForm.values.kickChannelId}
                  onChange={(e) => {
                    chatForm.setFieldValue('kickChannelId', e.target.value)
                  }}
                />
                <TextInput
                  ref={kickChatroomIdRef}
                  label={<FieldLabel>Kick Chatroom ID</FieldLabel>}
                  placeholder="123459"
                  defaultValue={chatForm.values.kickChatroomId}
                  onChange={(e) => {
                    chatForm.setFieldValue('kickChatroomId', e.target.value)
                  }}
                />
              </FormSection>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setTimestampConfig((prev) => ({
                  ...prev,
                  discordChannelId: clipForm.values.discordChannelId,
                  youtubeChannel: clipForm.values.youtubeChannel,
                }))

                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    clip_config: {
                      discord_channel_id: clipForm.values.discordChannelId,
                      youtube_channel: clipForm.values.youtubeChannel,
                    },
                  })
                  .res((res) => {
                    if (res.ok) {
                      showNotification({
                        title: 'Clip Settings saved!',
                        color: 'teal',
                      })
                    }
                  })
                  .catch(() => {
                    showNotification({
                      title: 'Error saving Clip Settings',
                      color: 'red',
                    })
                  })
              }}
            >
              <FormSection
                title="Clip Settings"
                subtitle="Timestamp a moment with one click"
              >
                <PasswordInput
                  label={<FieldLabel>Discord Channel ID</FieldLabel>}
                  placeholder="123456789"
                  defaultValue={clipForm.values.discordChannelId}
                  onChange={(e) => {
                    clipForm.setFieldValue('discordChannelId', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>YouTube Channel URL</FieldLabel>}
                  placeholder="https://youtube.com/c/john.smith"
                  defaultValue={clipForm.values.youtubeChannel}
                  onChange={(e) => {
                    clipForm.setFieldValue('youtubeChannel', e.target.value)
                  }}
                />
              </FormSection>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setObsConfig((prev) => ({
                  ...prev,
                  streamChannelId: obsForm.values.streamChannelId,
                }))

                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    obs_config: {
                      stream_channel_id: obsForm.values.streamChannelId,
                    },
                  })
                  .res((res) => {
                    if (res.ok) {
                      showNotification({
                        title: 'OBS Settings saved!',
                        color: 'teal',
                      })
                    }
                  })
                  .catch(() => {
                    showNotification({
                      title: 'Error saving OBS Settings',
                      color: 'red',
                    })
                  })
              }}
            >
              <FormSection
                title="OBS Settings"
                subtitle="Control your OBS from the dashboard"
              >
                <PasswordInput
                  label={<FieldLabel>Channel ID</FieldLabel>}
                  placeholder="150511291029518563"
                  defaultValue={obsForm.values.streamChannelId}
                  onChange={(e) => {
                    obsForm.setFieldValue('streamChannelId', e.target.value)
                  }}
                />
              </FormSection>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setStatsConfig((prev) => ({
                  ...prev,
                  tiktokUsername: statsForm.values.tiktok,
                  youtubeChannel: statsForm.values.youtube,
                  kickChannelName: statsForm.values.kick,
                }))

                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    viewers_config: {
                      tiktok_username: statsForm.values.tiktok,
                      youtube_channel: statsForm.values.youtube,
                      kick_channel_name: statsForm.values.kick,
                    },
                  })
                  .res((res) => {
                    if (res.ok) {
                      showNotification({
                        title: 'Stats Settings saved!',
                        color: 'teal',
                      })
                    }
                  })
                  .catch(() => {
                    showNotification({
                      title: 'Error saving Stats Settings',
                      color: 'red',
                    })
                  })
              }}
            >
              <FormSection
                title="Stats Settings"
                subtitle="View stream stats in real-time"
              >
                <TextInput
                  label={<FieldLabel>TikTok Username</FieldLabel>}
                  placeholder="john.smith"
                  defaultValue={statsForm.values.tiktok}
                  onChange={(e) => {
                    statsForm.setFieldValue('tiktok', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>YouTube Channel URL</FieldLabel>}
                  placeholder="https://youtube.com/c/john.smith"
                  defaultValue={statsForm.values.youtube}
                  onChange={(e) => {
                    statsForm.setFieldValue('youtube', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>Kick Channel Name</FieldLabel>}
                  placeholder="johnsmith"
                  defaultValue={statsForm.values.kick}
                  onChange={(e) => {
                    statsForm.setFieldValue('kick', e.target.value)
                  }}
                />
              </FormSection>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSlobsConfig((prev) => ({
                  ...prev,
                  streamToken: slobsForm.values.streamToken,
                  ttsService: slobsForm.values.ttsService,
                  streamlabsVoice: slobsForm.values.streamlabsVoice,
                  elevenlabsVoice: slobsForm.values.elevenlabsVoice,
                  elevenlabsKey: slobsForm.values.elevenlabsKey,
                  tiktokUsername: slobsForm.values.tiktokUsername,
                  silentAudioInterval: slobsForm.values.silentAudioInterval,
                  ttsDollarMin: slobsForm.values.ttsDollarMin,
                }))

                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    donations_config: {
                      streamlabs_token: slobsForm.values.streamToken,
                      tts_service: slobsForm.values.ttsService,
                      streamlabs_voice: slobsForm.values.streamlabsVoice,
                      elevenlabs_voice: slobsForm.values.elevenlabsVoice,
                      elevenlabs_key: slobsForm.values.elevenlabsKey,
                      tiktok_username: slobsForm.values.tiktokUsername,
                      silent_audio_interval:
                        slobsForm.values.silentAudioInterval,
                      tts_dollar_min: slobsForm.values.ttsDollarMin,
                    },
                  })
                  .res((res) => {
                    if (res.ok) {
                      showNotification({
                        title: 'Donation Settings saved!',
                        color: 'teal',
                      })
                    }
                  })
                  .catch(() => {
                    showNotification({
                      title: 'Error saving Donation Settings',
                      color: 'red',
                    })
                  })
              }}
            >
              <FormSection
                title="Donation Settings"
                subtitle="See your YouTube and Twitch donations live!"
              >
                <PasswordInput
                  label={<FieldLabel>Streamlabs Token</FieldLabel>}
                  placeholder="eykdjbnn2mnzb.bemMNjgknwli..."
                  defaultValue={slobsForm.values.streamToken}
                  onChange={(e) => {
                    slobsForm.setFieldValue('streamToken', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>TikTok Username</FieldLabel>}
                  placeholder="john.smith"
                  defaultValue={slobsForm.values.tiktokUsername}
                  onChange={(e) => {
                    slobsForm.setFieldValue('tiktokUsername', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>TTS Dollar Minimum</FieldLabel>}
                  placeholder="1"
                  defaultValue={slobsForm.values.ttsDollarMin}
                  onChange={(e) => {
                    slobsForm.setFieldValue('ttsDollarMin', e.target.value)
                  }}
                />
                <TextInput
                  label={<FieldLabel>Play Silent Audio (minutes)</FieldLabel>}
                  placeholder="10 (leave blank to disable)"
                  defaultValue={slobsForm.values.silentAudioInterval}
                  onChange={(e) => {
                    slobsForm.setFieldValue(
                      'silentAudioInterval',
                      e.target.value
                    )
                  }}
                />
                <Divider />
                <Select
                  label={<FieldLabel>TTS Service</FieldLabel>}
                  defaultValue={slobsForm.values.ttsService}
                  value={slobsForm.values.ttsService}
                  data={[
                    { value: 'elevenlabs', label: 'ElevenLabs' },
                    { value: 'streamlabs', label: 'Streamlabs' },
                  ]}
                  onChange={(e) => {
                    slobsForm.setFieldValue('ttsService', e)
                  }}
                />
                {slobsForm.values.ttsService === 'streamlabs' ? (
                  <Select
                    label={<FieldLabel>Streamlabs Voice</FieldLabel>}
                    defaultValue={slobsForm.values.streamlabsVoice}
                    value={slobsForm.values.streamlabsVoice}
                    data={[
                      // https://gist.github.com/idealwebsolutions/84dcb061baa427050672b9b41f900ce8?permalink_comment_id=3014186#gistcomment-3014186
                      { value: 'Nicole', label: 'Nicole' },
                      { value: 'Enrique', label: 'Enrique' },
                      { value: 'Tatyana', label: 'Tatyana' },
                      { value: 'Russell', label: 'Russell' },
                      { value: 'Lotte', label: 'Lotte' },
                      { value: 'Geraint', label: 'Geraint' },
                      { value: 'Carmen', label: 'Carmen' },
                      { value: 'Mads', label: 'Mads' },
                      { value: 'Penelope', label: 'Penelope' },
                      { value: 'Mia', label: 'Mia' },
                      { value: 'Joanna', label: 'Joanna' },
                      { value: 'Matthew', label: 'Matthew' },
                      { value: 'Brian', label: 'Brian' },
                      { value: 'Seoyeon', label: 'Seoyeon' },
                      { value: 'Ruben', label: 'Ruben' },
                      { value: 'Ricardo', label: 'Ricardo' },
                      { value: 'Maxim', label: 'Maxim' },
                      { value: 'Lea', label: 'Lea' },
                      { value: 'Giorgio', label: 'Giorgio' },
                      { value: 'Carla', label: 'Carla' },
                      { value: 'Naja', label: 'Naja' },
                      { value: 'Maja', label: 'Maja' },
                      { value: 'Astrid', label: 'Astrid' },
                      { value: 'Ivy', label: 'Ivy' },
                      { value: 'Kimberly', label: 'Kimberly' },
                      { value: 'Chantal', label: 'Chantal' },
                      { value: 'Amy', label: 'Amy' },
                      { value: 'Vicki', label: 'Vicki' },
                      { value: 'Marlene', label: 'Marlene' },
                      { value: 'Ewa', label: 'Ewa' },
                      { value: 'Conchita', label: 'Conchita' },
                      { value: 'Karl', label: 'Karl' },
                      { value: 'Zeina', label: 'Zeina' },
                      { value: 'Miguel', label: 'Miguel' },
                      { value: 'Mathieu', label: 'Mathieu' },
                      { value: 'Justin', label: 'Justin' },
                      { value: 'Lucia', label: 'Lucia' },
                      { value: 'Jacek', label: 'Jacek' },
                      { value: 'Bianca', label: 'Bianca' },
                      { value: 'Takumi', label: 'Takumi' },
                      { value: 'Ines', label: 'Ines' },
                      { value: 'Gwyneth', label: 'Gwyneth' },
                      { value: 'Cristiano', label: 'Cristiano' },
                      { value: 'Mizuki', label: 'Mizuki' },
                      { value: 'Celine', label: 'Celine' },
                      { value: 'Zhiyu', label: 'Zhiyu' },
                      { value: 'Jan', label: 'Jan' },
                      { value: 'Liv', label: 'Liv' },
                      { value: 'Joey', label: 'Joey' },
                      { value: 'Raveena', label: 'Raveena' },
                      { value: 'Filiz', label: 'Filiz' },
                      { value: 'Dora', label: 'Dora' },
                      { value: 'Salli', label: 'Salli' },
                      { value: 'Aditi', label: 'Aditi' },
                      { value: 'Vitoria', label: 'Vitoria' },
                      { value: 'Emma', label: 'Emma' },
                      { value: 'Hans', label: 'Hans' },
                      { value: 'Kendra', label: 'Kendra' },
                    ]}
                    onChange={(e) => {
                      slobsForm.setFieldValue('streamlabsVoice', e)
                    }}
                  />
                ) : null}
                {slobsForm.values.ttsService === 'elevenlabs' ? (
                  <>
                    <Select
                      label={<FieldLabel>ElevenLabs Voice</FieldLabel>}
                      defaultValue={slobsForm.values.elevenlabsVoice}
                      data={
                        allVoices?.map((voice) => ({
                          value: voice?.id,
                          label: voice?.name,
                        })) ?? []
                      }
                      onChange={(e) => {
                        slobsForm.setFieldValue('elevenlabsVoice', e)
                      }}
                    />
                    <PasswordInput
                      label={<FieldLabel>ElevenLabs API Key</FieldLabel>}
                      defaultValue={slobsForm.values.elevenlabsKey}
                      onChange={(e) => {
                        slobsForm.setFieldValue('elevenlabsKey', e.target.value)
                      }}
                    />
                  </>
                ) : null}
              </FormSection>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setLanyardConfig((prev) => ({
                  ...prev,
                  discordUserId: lanyardForm.values.discordUserId,
                  apiKey: lanyardForm.values.apiKey,
                }))

                wretch(
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    lanyard_config: {
                      discord_user_id: lanyardForm.values.discordUserId,
                      api_key: lanyardForm.values.apiKey,
                      is_gps_enabled: gpsForm.values.isGpsEnabled
                        ? 'true'
                        : 'false',
                    },
                  })
                  .res(() => {
                    showNotification({
                      message: 'Lanyard API settings saved!',
                      color: 'teal',
                    })
                  })
                  .catch(() => {
                    showNotification({
                      message: 'Error saving Lanyard API settings!',
                      color: 'red',
                    })
                  })
              }}
            >
              <FormSection
                title="Lanyard API"
                subtitle="Add custom data to your stream!"
              >
                <PasswordInput
                  label={<FieldLabel>Discord User ID</FieldLabel>}
                  placeholder="1234567890"
                  defaultValue={lanyardForm.values.discordUserId}
                  onChange={(e) => {
                    lanyardForm.setFieldValue('discordUserId', e.target.value)
                  }}
                />
                <PasswordInput
                  label={<FieldLabel>API Key</FieldLabel>}
                  placeholder="API Key"
                  defaultValue={lanyardForm.values.apiKey}
                  onChange={(e) => {
                    lanyardForm.setFieldValue('apiKey', e.target.value)
                  }}
                />
              </FormSection>
            </form>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setGpsConfig((prev) => ({
                  ...prev,
                  isGpsEnabled: gpsForm.values.isGpsEnabled,
                }))

                if (!gpsForm.values.isGpsEnabled) {
                  await fetch(
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
                  `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
                )
                  .patch({
                    lanyard_config: {
                      discord_user_id: lanyardForm.values.discordUserId,
                      api_key: lanyardForm.values.apiKey,
                      is_gps_enabled: gpsForm.values.isGpsEnabled
                        ? 'true'
                        : 'false',
                    },
                  })
                  .res(() => {
                    showNotification({
                      message: 'GPS settings saved!',
                      color: 'teal',
                    })
                  })
                  .catch(() => {
                    showNotification({
                      message: 'Error saving GPS settings!',
                      color: 'red',
                    })
                  })

                showNotification({
                  message: 'GPS settings saved!',
                  color: 'teal',
                })
              }}
            >
              <FormSection
                title="GPS"
                subtitle="Add location data to your stream!"
              >
                <Checkbox
                  label="Enable GPS"
                  defaultChecked={gpsForm.values.isGpsEnabled}
                  onChange={(e) => {
                    gpsForm.setFieldValue('isGpsEnabled', e.target.checked)
                  }}
                />
              </FormSection>
            </form>
          </>
        )}

        <Flex my="lg" pb="48px" justify="center">
          <Button
            mt="lg"
            w="50%"
            variant="outline"
            size="lg"
            onClick={async () => {
              setChatConfig((prev) => ({
                ...prev,
                tiktok: {
                  ...prev.tiktok,
                  username: chatForm.values.tiktok,
                },
                youtube: {
                  ...prev.youtube,
                  channel: chatForm.values.youtube,
                },
                twitch: {
                  ...prev.twitch,
                  channel: chatForm.values.twitch,
                },
                kick: {
                  ...prev.kick,
                  channelId: chatForm.values.kickChannelId,
                  chatroomId: chatForm.values.kickChatroomId,
                  channelName: chatForm.values.kickChannelName,
                },
              }))

              setTimestampConfig((prev) => ({
                ...prev,
                discordChannelId: clipForm.values.discordChannelId,
                youtubeChannel: clipForm.values.youtubeChannel,
              }))

              setObsConfig((prev) => ({
                ...prev,
                streamChannelId: obsForm.values.streamChannelId,
              }))

              setStatsConfig((prev) => ({
                ...prev,
                tiktokUsername: statsForm.values.tiktok,
                youtubeChannel: statsForm.values.youtube,
              }))

              setLanyardConfig((prev) => ({
                ...prev,
                discordUserId: lanyardForm.values.discordUserId,
                apiKey: lanyardForm.values.apiKey,
              }))

              setGpsConfig((prev) => ({
                ...prev,
                isGpsEnabled: gpsForm.values.isGpsEnabled,
              }))

              if (!gpsForm.values.isGpsEnabled) {
                await fetch(
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
                `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
              )
                .patch({
                  chat_config: {
                    tiktok_username: chatForm.values.tiktok,
                    youtube_channel: chatForm.values.youtube,
                    kick_channel_id: chatForm.values.kickChannelId,
                    kick_chatroom_id: chatForm.values.kickChatroomId,
                    kick_channel_name: chatForm.values.kickChannelName,
                    twitch_channel: chatForm.values.twitch,
                  },
                  clip_config: {
                    discord_channel_id: clipForm.values.discordChannelId,
                    youtube_channel: clipForm.values.youtubeChannel,
                  },
                  obs_config: {
                    stream_channel_id: obsForm.values.streamChannelId,
                  },
                  viewers_config: {
                    tiktok_username: statsForm.values.tiktok,
                    youtube_channel: statsForm.values.youtube,
                    kick_channel_name: statsForm.values.kick,
                  },
                  donations_config: {
                    stream_token: slobsForm.values.streamToken,
                    tts_service: slobsForm.values.ttsService,
                    streamlabs_voice: slobsForm.values.streamlabsVoice,
                    elevenlabs_voice: slobsForm.values.elevenlabsVoice,
                    tiktok_username: slobsForm.values.tiktokUsername,
                    silent_audio_interval: slobsForm.values.silentAudioInterval,
                    tts_dollar_min: slobsForm.values.ttsDollarMin,
                  },
                  lanyard_config: {
                    discord_user_id: lanyardForm.values.discordUserId,
                    api_key: lanyardForm.values.apiKey,
                    is_gps_enabled: gpsForm.values.isGpsEnabled
                      ? 'true'
                      : 'false',
                  },
                })
                .res(() => {
                  showNotification({
                    title: 'All Settings saved!',
                    color: 'green',
                  })
                })
                .catch(() => {
                  showNotification({
                    title: 'Error saving settings!',
                    color: 'red',
                  })
                })
            }}
          >
            Save All
          </Button>
        </Flex>
      </Container>
    </Layout>
  )
}

export default ProvidersWrapper

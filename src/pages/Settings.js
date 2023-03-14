import {
  Button,
  Container,
  Divider,
  Flex,
  Select,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useContext } from 'react'
import { Layout } from '../components/document'
import { ConfigContext } from '../components/Providers/ConfigProvider'
import { FieldLabel, FormSection } from '../components/Settings'
import TagSEO from '../components/TagSEO'

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
  } = useContext(ConfigContext)

  const userForm = useForm({
    initialValues: {
      streamazeKey: userConfig?.streamazeKey,
    },
  })

  const chatForm = useForm({
    initialValues: {
      tiktok: chatConfig.tiktok.username,
      youtube: chatConfig.youtube.channel,
      twitch: chatConfig.twitch.username,
      kickChatroomId: chatConfig.kick.chatroomId,
      kickChannelId: chatConfig.kick.channelId,
    },
  })

  const clipForm = useForm({
    initialValues: {
      discordChannelId: timestampConfig.discordChannelId,
      youtubeChannel: timestampConfig.youtubeChannel,
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
      ttsVoice: slobsConfig?.ttsVoice,
      tiktokUsername: slobsConfig?.tiktokUsername,
      silentAudioInterval: slobsConfig?.silentAudioInterval,
    },
  })

  const lanyardForm = useForm({
    initialValues: {
      discordUserId: lanyardConfig?.discordUserId,
      apiKey: lanyardConfig?.apiKey,
    },
  })

  return (
    <Layout>
      <TagSEO />
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
              // twitch: {
              //   ...prev.twitch,
              //   username: chatForm.values.twitch,
              // },
              kick: {
                ...prev.kick,
                chatroomId: chatForm.values.kickChatroomId,
                channelId: chatForm.values.kickChannelId,
              },
            }))

            showNotification({
              title: 'Chat Settings saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection
            title="Chat Settings"
            subtitle="Merge many livestream chats into one"
          >
            <TextInput
              label={<FieldLabel>TikTok Username</FieldLabel>}
              placeholder="sampepper"
              defaultValue={chatForm.values.tiktok}
              onChange={(e) => {
                chatForm.setFieldValue('tiktok', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>YouTube Channel URL</FieldLabel>}
              placeholder="https://youtube.com/c/sam"
              defaultValue={chatForm.values.youtube}
              onChange={(e) => {
                chatForm.setFieldValue('youtube', e.target.value)
              }}
            />
            {/* <TextInput
              label={<FieldLabel>Twitch Username</FieldLabel>}
              placeholder="sampepper"
              defaultValue={chatForm.values.twitch}
              onChange={(e) => {
                chatForm.setFieldValue('twitch', e.target.value)
              }}
            /> */}
            <Divider />
            <TextInput
              label={<FieldLabel>Kick Chatroom ID</FieldLabel>}
              placeholder="123456789"
              defaultValue={chatForm.values.kickChatroomId}
              onChange={(e) => {
                chatForm.setFieldValue('kickChatroomId', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>Kick Channel ID</FieldLabel>}
              placeholder="123456789"
              defaultValue={chatForm.values.kickChannelId}
              onChange={(e) => {
                chatForm.setFieldValue('kickChannelId', e.target.value)
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

            showNotification({
              title: 'Clip Settings saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection
            title="Clip Settings"
            subtitle="Timestamp a moment with one click"
          >
            <TextInput
              label={<FieldLabel>Discord Channel ID</FieldLabel>}
              placeholder="123456789"
              defaultValue={clipForm.values.discordChannelId}
              onChange={(e) => {
                clipForm.setFieldValue('discordChannelId', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>YouTube Channel URL</FieldLabel>}
              placeholder="https://youtube.com/c/sam"
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

            showNotification({
              title: 'OBS Settings saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection
            title="OBS Settings"
            subtitle="Control your OBS from the dashboard"
          >
            <TextInput
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

            showNotification({
              title: 'Stats Settings saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection
            title="Stats Settings"
            subtitle="View stream stats in real-time"
          >
            <TextInput
              label={<FieldLabel>TikTok Username</FieldLabel>}
              placeholder="sampepper"
              defaultValue={statsForm.values.tiktok}
              onChange={(e) => {
                statsForm.setFieldValue('tiktok', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>YouTube Channel URL</FieldLabel>}
              placeholder="https://youtube.com/c/sam"
              defaultValue={statsForm.values.youtube}
              onChange={(e) => {
                statsForm.setFieldValue('youtube', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>Kick Channel Name</FieldLabel>}
              placeholder="sam"
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
              ttsVoice: slobsForm.values.ttsVoice,
              tiktokUsername: slobsForm.values.tiktokUsername,
              silentAudioInterval: slobsForm.values.silentAudioInterval,
            }))

            showNotification({
              title: 'Donation Settings saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection
            title="Donation Settings"
            subtitle="See your YouTube and Twitch donations live!"
          >
            <TextInput
              label={<FieldLabel>Stream Token</FieldLabel>}
              placeholder="eykdjbnn2mnzb.bemMNjgknwliugi..."
              type="password"
              defaultValue={slobsForm.values.streamToken}
              onChange={(e) => {
                slobsForm.setFieldValue('streamToken', e.target.value)
              }}
            />
            <Select
              label={<FieldLabel>TTS Voice</FieldLabel>}
              defaultValue={slobsForm.values.ttsVoice}
              value={slobsForm.values.ttsVoice}
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
                console.log(e)
                slobsForm.setFieldValue('ttsVoice', e)
              }}
            />
            <TextInput
              label={<FieldLabel>TikTok Username</FieldLabel>}
              placeholder="sampepper"
              defaultValue={slobsForm.values.tiktokUsername}
              onChange={(e) => {
                slobsForm.setFieldValue('tiktokUsername', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>Play Silent Audio</FieldLabel>}
              placeholder="10 (leave blank to disable)"
              defaultValue={slobsForm.values.silentAudioInterval}
              onChange={(e) => {
                slobsForm.setFieldValue('silentAudioInterval', e.target.value)
              }}
            />
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

            showNotification({
              message: 'Lanyard API settings saved!',
              color: 'teal',
            })
          }}
        >
          <FormSection
            title="Lanyard API"
            subtitle="Add custom data to your stream!"
          >
            <TextInput
              label={<FieldLabel>Discord User ID</FieldLabel>}
              placeholder="1234567890"
              defaultValue={lanyardForm.values.discordUserId}
              onChange={(e) => {
                lanyardForm.setFieldValue('discordUserId', e.target.value)
              }}
            />
            <TextInput
              label={<FieldLabel>API Key</FieldLabel>}
              placeholder="API Key"
              defaultValue={lanyardForm.values.apiKey}
              type="password"
              onChange={(e) => {
                lanyardForm.setFieldValue('apiKey', e.target.value)
              }}
            />
          </FormSection>
        </form>

        <Flex my="lg" pb="48px" justify="center">
          <Button
            mt="lg"
            w="50%"
            variant="outline"
            size="lg"
            onClick={() => {
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
                  username: chatForm.values.twitch,
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

              showNotification({
                title: 'All Settings saved!',
                color: 'green',
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
export default Settings

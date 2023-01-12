import { Button, Container, Flex, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useContext } from 'react'
import { Layout } from '../components/document'
import { ConfigContext } from '../components/Providers/ConfigProvider'
import { FieldLabel, FormSection } from '../components/Settings'
import TagSEO from '../components/TagSEO'

const Settings = () => {
  const {
    chatConfig,
    setChatConfig,
    timestampConfig,
    setTimestampConfig,
    obsConfig,
    setObsConfig,
    statsConfig,
    setStatsConfig,
  } = useContext(ConfigContext)

  const chatForm = useForm({
    initialValues: {
      tiktok: chatConfig.tiktok.username,
      youtube: chatConfig.youtube.channel,
      twitch: chatConfig.twitch.username,
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
    },
  })

  console.log(chatConfig)

  return (
    <Layout>
      <TagSEO />
      <Container size="sm" pt="lg">
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
              twitch: {
                ...prev.twitch,
                username: chatForm.values.twitch,
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
            <TextInput
              label={<FieldLabel>Twitch Username</FieldLabel>}
              placeholder="sampepper"
              defaultValue={chatForm.values.twitch}
              onChange={(e) => {
                chatForm.setFieldValue('twitch', e.target.value)
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

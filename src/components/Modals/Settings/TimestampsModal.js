import { Modal, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import { useContext } from 'react'
import wretch from 'wretch'

const TimestampsModal = ({ isOpen, onClose }) => {
  const { timestampConfig, setTimestampConfig } = useContext(ConfigContext)
  const { currentStreamer } = useContext(PhoenixContext)
  const clipForm = useForm({
    initialValues: {
      discordChannelId: timestampConfig?.discordChannelId,
      youtubeChannel: timestampConfig?.youtubeChannel,
    },
  })

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      size="lg"
      withCloseButton={false}
    >
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
    </Modal>
  )
}

export default TimestampsModal

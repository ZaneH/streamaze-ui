import { Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import { useContext } from 'react'
import wretch from 'wretch'

const ViewersModal = ({ isOpen, onClose }) => {
  const { currentStreamer } = useContext(PhoenixContext)
  const { statsConfig, setStatsConfig } = useContext(ConfigContext)
  const statsForm = useForm({
    initialValues: {
      tiktok: statsConfig.tiktokUsername,
      youtube: statsConfig.youtubeChannel,
      kick: statsConfig.kickChannelName,
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
    </Modal>
  )
}

export default ViewersModal

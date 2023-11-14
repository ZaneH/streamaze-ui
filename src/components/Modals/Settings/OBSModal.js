import { Modal, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import { useContext } from 'react'
import wretch from 'wretch'

const OBSModal = ({ isOpen, onClose }) => {
  const { currentStreamer } = useContext(PhoenixContext)
  const { obsConfig, setObsConfig } = useContext(ConfigContext)
  const obsForm = useForm({
    initialValues: {
      streamChannelId: obsConfig.streamChannelId,
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
    </Modal>
  )
}

export default OBSModal

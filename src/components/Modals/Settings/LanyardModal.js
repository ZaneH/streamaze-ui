import { Modal, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import { useContext } from 'react'
import wretch from 'wretch'

const LanyardModal = ({ isOpen, onClose }) => {
  const { lanyardConfig, setLanyardConfig, gpsConfig } =
    useContext(ConfigContext)
  const { currentStreamer } = useContext(PhoenixContext)
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
                is_gps_enabled: gpsForm.values.isGpsEnabled ? 'true' : 'false',
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
    </Modal>
  )
}

export default LanyardModal

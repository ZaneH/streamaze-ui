import {
  Box,
  Container,
  Flex,
  Grid,
  PasswordInput,
  Select,
  SimpleGrid,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import ChatModal from 'components/Modals/Settings/ChatModal'
import DonationsModal from 'components/Modals/Settings/DonationsModal'
import LanyardModal from 'components/Modals/Settings/LanyardModal'
import OBSModal from 'components/Modals/Settings/OBSModal'
import TimestampsModal from 'components/Modals/Settings/TimestampsModal'
import ViewersModal from 'components/Modals/Settings/ViewersModal'
import { ProviderProvider } from 'components/Providers'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import SettingCell from 'components/Settings/SettingCell'
import { Layout } from 'components/document'
import { useContext, useRef, useState } from 'react'

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <SettingsGridPage />
    </ProviderProvider>
  )
}

const StreamazeKeyForm = () => {
  const streamazeKeyRef = useRef(null)
  const { adminConfig, userConfig, setUserConfig } = useContext(ConfigContext)

  const userForm = useForm({
    initialValues: {
      streamazeKey: userConfig?.streamazeKey,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setUserConfig((prev) => ({
          ...prev,
          streamazeKey: userForm.values.streamazeKey,
        }))

        // refresh the page to update the fields
        window.location.reload()
      }}
    >
      <FormSection title="Streamaze Key" subtitle="Sign in to Streamaze">
        <PasswordInput
          ref={streamazeKeyRef}
          label="Streamaze Key"
          placeholder="api-xxxxxxxxxxxx"
          defaultValue={userForm.values.streamazeKey}
          onChange={(e) => {
            userForm.setFieldValue('streamazeKey', e.target.value)
          }}
        />
        {adminConfig.role === 'admin' && (
          <Select
            label={<FieldLabel>Account Switcher</FieldLabel>}
            defaultValue={userForm.values.streamazeKey}
            value={userForm.values.streamazeKey}
            data={adminConfig?.streamers?.map((streamer) => ({
              value: streamer?.api_key,
              label: streamer?.name,
            }))}
            onChange={(e) => {
              userForm.setFieldValue('streamazeKey', e)
              streamazeKeyRef.current.value = e
            }}
          />
        )}
      </FormSection>
    </form>
  )
}

export const SettingsGrid = () => {
  const [showChatModal, setShowChatModal] = useState(false)
  const [showViewersModal, setShowViewersModal] = useState(false)
  //   const [showOthersModal, setShowOthersModal] = useState(false)
  const [showTimestampsModal, setShowTimestampsModal] = useState(false)
  const [showObsModal, setShowObsModal] = useState(false)
  const [showDonationsModal, setShowDonationsModal] = useState(false)
  const [showLanyardModal, setShowLanyardModal] = useState(false)
  const { userConfig } = useContext(ConfigContext)

  return (
    <Container my="xl">
      <ChatModal
        isOpen={showChatModal}
        onClose={() => {
          setShowChatModal(false)
        }}
      />

      <TimestampsModal
        isOpen={showTimestampsModal}
        onClose={() => {
          setShowTimestampsModal(false)
        }}
      />

      <OBSModal
        isOpen={showObsModal}
        onClose={() => {
          setShowObsModal(false)
        }}
      />

      <ViewersModal
        isOpen={showViewersModal}
        onClose={() => {
          setShowViewersModal(false)
        }}
      />

      <DonationsModal
        isOpen={showDonationsModal}
        onClose={() => {
          setShowDonationsModal(false)
        }}
      />

      <LanyardModal
        isOpen={showLanyardModal}
        onClose={() => {
          setShowLanyardModal(false)
        }}
      />

      <Container size="xs" mb="xl">
        <StreamazeKeyForm />
      </Container>

      {userConfig?.streamazeKey && (
        <SimpleGrid cols={3}>
          <SettingCell
            title="Chat"
            description="Setup multiple live-stream chats"
            onClick={() => {
              setShowChatModal(true)
            }}
          />
          <SettingCell
            title="Timestamps"
            description="Send timestamps to Discord"
            onClick={() => {
              setShowTimestampsModal(true)
            }}
          />
          <SettingCell
            title="OBS"
            description="Use Livebond to control OBS"
            onClick={() => {
              setShowObsModal(true)
            }}
          />
          <SettingCell
            title="Viewers"
            description="Display the number of viewers"
            onClick={() => {
              setShowViewersModal(true)
            }}
          />
          <SettingCell
            title="Donations"
            description="Configure Streamlabs, TikTok Gifts, and TTS"
            onClick={() => {
              setShowDonationsModal(true)
            }}
          />
          <SettingCell
            title="Lanyard"
            description="Required for OBS widgets (Recommended)"
            onClick={() => {
              setShowLanyardModal(true)
            }}
          />
        </SimpleGrid>
      )}
    </Container>
  )
}

const SettingsGridPage = () => {
  return (
    <Layout>
      <Container mt="lg">
        <Title order={1}>Settings</Title>
      </Container>
      <SettingsGrid />
    </Layout>
  )
}

export default ProvidersWrapper

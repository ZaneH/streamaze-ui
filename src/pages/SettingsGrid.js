import { Box, Container, Flex, Grid, SimpleGrid, Title } from '@mantine/core'
import ChatModal from 'components/Modals/Settings/ChatModal'
import DonationsModal from 'components/Modals/Settings/DonationsModal'
import LanyardModal from 'components/Modals/Settings/LanyardModal'
import OBSModal from 'components/Modals/Settings/OBSModal'
import TimestampsModal from 'components/Modals/Settings/TimestampsModal'
import ViewersModal from 'components/Modals/Settings/ViewersModal'
import { ProviderProvider } from 'components/Providers'
import SettingCell from 'components/Settings/SettingCell'
import { Layout } from 'components/document'
import { useState } from 'react'

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <SettingsGridPage />
    </ProviderProvider>
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
        {/* <SettingCell
          title="Other"
          description="Everything else"
          onClick={() => {
            setShowOthersModal(true)
          }}
        /> */}
      </SimpleGrid>
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

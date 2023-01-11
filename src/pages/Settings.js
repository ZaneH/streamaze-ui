import styled from '@emotion/styled'
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Layout } from '../components/document'
import TagSEO from '../components/TagSEO'

const FormSection = styled(Paper)`
  padding: 16px 12px;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  margin: 16px 24px;
`

const FieldLabel = styled(Text)`
  font-size: 15px;
  margin-bottom: 4px;
`

const SectionTitle = ({ title, subtitle }) => {
  return (
    <Box mx="xl" mt="xl" mb="md">
      <Title size="h2">{title}</Title>
      <Text>{subtitle}</Text>
    </Box>
  )
}

const Settings = () => {
  return (
    <Layout>
      <TagSEO />
      <Container size="sm" pt="lg">
        <form>
          <SectionTitle
            title="Chat Settings"
            subtitle="Merge many livestream chats into one"
          />
          <FormSection shadow="sm" padding="md">
            <Flex gap="sm" direction="column">
              <TextInput label={<FieldLabel>TikTok Username</FieldLabel>} />
              <TextInput label={<FieldLabel>YouTube Channel URL</FieldLabel>} />
              <TextInput label={<FieldLabel>Twitch Username</FieldLabel>} />
              <Button.Group mt="xs">
                <Button fullWidth color="red" variant="subtle">
                  Cancel
                </Button>
                <Button fullWidth color="blue">
                  Save
                </Button>
              </Button.Group>
            </Flex>
          </FormSection>

          <SectionTitle
            title="Clip Settings"
            subtitle="Timestamp a moment with one click"
          />
          <FormSection shadow="sm" padding="md">
            <Flex gap="sm" direction="column">
              <TextInput label={<FieldLabel>Discord Channel ID</FieldLabel>} />
              <TextInput label={<FieldLabel>YouTube Channel URL</FieldLabel>} />
              <Button.Group mt="xs">
                <Button fullWidth color="red" variant="subtle">
                  Cancel
                </Button>
                <Button fullWidth color="blue">
                  Save
                </Button>
              </Button.Group>
            </Flex>
          </FormSection>

          <SectionTitle
            title="OBS Settings"
            subtitle="Control your OBS from the dashboard"
          />
          <FormSection shadow="sm" padding="md">
            <Flex gap="sm" direction="column">
              <TextInput label={<FieldLabel>Channel ID</FieldLabel>} />
              <Button.Group mt="xs">
                <Button fullWidth color="red" variant="subtle">
                  Cancel
                </Button>
                <Button fullWidth color="blue">
                  Save
                </Button>
              </Button.Group>
            </Flex>
          </FormSection>

          <SectionTitle
            title="Stats Settings"
            subtitle="View stream stats in real-time"
          />
          <FormSection shadow="sm" padding="md">
            <Flex gap="sm" direction="column">
              <TextInput label={<FieldLabel>TikTok Username</FieldLabel>} />
              <TextInput label={<FieldLabel>YouTube Channel URL</FieldLabel>} />
              <TextInput label={<FieldLabel>Twitch Username</FieldLabel>} />
              <Button.Group mt="xs">
                <Button fullWidth color="red" variant="subtle">
                  Cancel
                </Button>
                <Button fullWidth color="blue">
                  Save
                </Button>
              </Button.Group>
            </Flex>
          </FormSection>
        </form>
      </Container>
    </Layout>
  )
}
export default Settings

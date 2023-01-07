import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconAdjustmentsHorizontal, IconHelp, IconLink } from '@tabler/icons'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import wretch from 'wretch'

const TimestampCard = () => {
  const [searchParams] = useSearchParams()
  const isUrl = searchParams.get('isDiscordUrl') === 'true'
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const { colors } = useMantineTheme()
  const [config, setConfig] = useLocalStorage({
    key: 'timestamp-config',
    getInitialValueInEffect: true,
    defaultValue: {
      buttonText: 'Clip It',
      discord: {
        channelId: '',
      },
      youtube: {
        video_id_or_url: '',
      },
    },
  })

  let discordChannelId = config.discord?.channelId || ''
  let youtubeVideoIdOrUrl = config.youtube?.video_id_or_url || ''

  if (isUrl) {
    discordChannelId = searchParams.get('discordChannelId') || ''
    youtubeVideoIdOrUrl = searchParams.get('youtubeVideoIdOrUrl') || ''
  }

  const form = useForm({
    initialValues: Object.assign({}, config),
  })

  useEffect(() => {
    form.setValues(config)
    // eslint-disable-next-line
  }, [config])

  return (
    <Card shadow="xs" p="lg" radius="md" h="min-content">
      <Flex direction="column" h="100%">
        <Group mb="xs" position="apart">
          <Text>Timestamp</Text>
          <Flex>
            <Tooltip
              withinPortal
              label={
                <Box m="sm">
                  <Text>Click to copy the link to your clipboard</Text>
                </Box>
              }
            >
              <ActionIcon
                onClick={() => {
                  const qs = new URLSearchParams()
                  qs.append('isDiscordUrl', 'true')
                  qs.append('discordChannelId', discordChannelId)
                  qs.append('youtubeVideoIdOrUrl', youtubeVideoIdOrUrl)

                  window.navigator.clipboard.writeText(
                    `${window.location.origin}/?${qs.toString()}`
                  )
                }}
              >
                <IconLink size={18} />
              </ActionIcon>
            </Tooltip>
            {!isEditing && !isUrl && (
              <ActionIcon
                onClick={() => {
                  setIsEditing(true)
                }}
              >
                <IconAdjustmentsHorizontal size={18} />
              </ActionIcon>
            )}
          </Flex>
        </Group>

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setIsEditing(false)

              setConfig(form.values)
            }}
          >
            <Flex direction="column" gap="sm">
              <TextInput
                type="password"
                defaultValue={discordChannelId}
                onChange={(event) => {
                  form.setFieldValue(
                    'discord.channelId',
                    event.currentTarget.value
                  )
                }}
                label={
                  <Tooltip
                    withinPortal={true}
                    label={
                      <Box m="sm">
                        <Text>
                          Right click the channel you want to send timestamps to
                          and click "Copy ID"
                        </Text>
                      </Box>
                    }
                  >
                    <Text size="sm" mb="6px">
                      Discord Channel ID{' '}
                      <IconHelp
                        style={{ verticalAlign: 'middle' }}
                        color={colors.gray[6]}
                        size={20}
                      />
                    </Text>
                  </Tooltip>
                }
                placeholder="1053829869293746"
              />

              <TextInput
                defaultValue={youtubeVideoIdOrUrl}
                onChange={(event) => {
                  form.setFieldValue(
                    'youtube.video_id_or_url',
                    event.currentTarget.value
                  )
                }}
                label={
                  <Tooltip
                    withinPortal={true}
                    label={
                      <Box m="sm">
                        <Text>This can be a livestream or a VOD</Text>
                      </Box>
                    }
                  >
                    <Text size="sm" mb="6px">
                      YouTube Video URL or ID{' '}
                      <IconHelp
                        style={{ verticalAlign: 'middle' }}
                        color={colors.gray[6]}
                        size={20}
                      />
                    </Text>
                  </Tooltip>
                }
                placeholder="rUxyKA_-grg"
              />

              <TextInput
                defaultValue={config.buttonText || ''}
                onChange={(event) => {
                  form.setFieldValue('buttonText', event.currentTarget.value)
                }}
                label="Button Text"
                placeholder="Clip It"
              />

              <Anchor
                underline
                align="center"
                href="https://discord.com/api/oauth2/authorize?client_id=1058511637662941335&permissions=2048&scope=bot"
                size={14}
                target="_blank"
              >
                Add Streamaze to your Discord server (Required)
              </Anchor>

              <Button.Group>
                <Button
                  fullWidth
                  color="red"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button fullWidth type="submit">
                  Save
                </Button>
              </Button.Group>
            </Flex>
          </form>
        ) : (
          <Flex direction="column" gap="sm">
            {isUrl && (
              <>
                <Text color="dimmed" size="sm">
                  Using URL for Discord settings.{' '}
                  <Anchor onClick={() => navigate('/')}>Clear URL</Anchor>
                </Text>
              </>
            )}
            <Button
              size="lg"
              fullWidth
              variant="gradient"
              color="green"
              mt="auto"
              disabled={!discordChannelId || !youtubeVideoIdOrUrl}
              onClick={async () => {
                wretch(`${process.env.REACT_APP_API_URL}/timestamp/push`)
                  .post({
                    discord_channel: discordChannelId,
                    video_id_or_url: youtubeVideoIdOrUrl,
                    timestamp: new Date().toUTCString(),
                  })
                  .res((res) => {
                    if (res.ok) {
                      showNotification({
                        title: 'Success',
                        message: 'Timestamp sent to Discord!',
                        color: 'green',
                      })
                    }
                  })
                  .catch(() => {
                    showNotification({
                      title: 'Error',
                      message:
                        'Something went wrong. Check your config and try again.',
                      color: 'red',
                    })
                  })
              }}
            >
              {config.buttonText || 'Clip It'}
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  )
}

export default TimestampCard

import {
  ActionIcon,
  Anchor,
  Button,
  Tooltip,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
  Box,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconAdjustmentsHorizontal, IconHelp } from '@tabler/icons'
import { useEffect, useState } from 'react'
import wretch from 'wretch'

const TimestampCard = () => {
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
          {!isEditing && (
            <ActionIcon
              onClick={() => {
                setIsEditing(true)
              }}
            >
              <IconAdjustmentsHorizontal size={18} />
            </ActionIcon>
          )}
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
                defaultValue={config.discord?.channelId || ''}
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
                defaultValue={config.youtube?.video_id_or_url || ''}
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
          <>
            <Button
              size="lg"
              fullWidth
              variant="gradient"
              color="green"
              mt="auto"
              disabled={!config.discord.channelId}
              onClick={async () => {
                wretch(`${process.env.REACT_APP_API_URL}/timestamp/push`)
                  .post({
                    discord_channel: config.discord.channelId,
                    video_id_or_url: 'QO0XcT2-cQU',
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
          </>
        )}
      </Flex>
    </Card>
  )
}

export default TimestampCard

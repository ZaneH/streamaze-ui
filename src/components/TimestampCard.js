import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconAdjustmentsHorizontal } from '@tabler/icons'
import { useEffect, useState } from 'react'
import wretch from 'wretch'

const TimestampCard = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [config, setConfig] = useLocalStorage({
    key: 'timestamp-config',
    getInitialValueInEffect: true,
    defaultValue: {
      buttonText: 'Clip It',
      discord: {
        channelId: '',
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
                defaultValue={config.discord.channelId || ''}
                onChange={(event) => {
                  form.setFieldValue(
                    'discord.channelId',
                    event.currentTarget.value
                  )
                }}
                label="Discord Channel ID"
                placeholder="1053829869293746"
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
                Add Streamaze to your Discord server
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
                    timestamp: new Date().toString(),
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

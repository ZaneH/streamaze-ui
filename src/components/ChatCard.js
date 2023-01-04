import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  CloseButton,
  Flex,
  Group,
  Input,
  Menu,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconPlus,
} from '@tabler/icons'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatLog from './ChatLog'
import { useNavigate } from 'react-router-dom'

const ChatCard = ({ title = 'n/a', config = {} }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isUrl = searchParams.get('isUrl') === 'true'

  const [isEditing, setIsEditing] = useState(false)
  const [pendingConfig, setPendingConfig] = useState()
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false)
  const [, setChatSources] = useLocalStorage({
    key: 'chat-sources',
    getInitialValueInEffect: true,
  })

  let twitchUsername = config['twitch']['handle']
  let tiktokUsername = config['tiktok']['handle']
  let youtubeChannel = config['youtube']['channel']

  if (isUrl) {
    twitchUsername = searchParams.get('twitchUsername')
    tiktokUsername = searchParams.get('tiktokUsername')
    youtubeChannel = searchParams.get('youtubeChannel')
  }

  const form = useForm({
    initialValues: {
      title: decodeURIComponent(title),
      twitch: twitchUsername,
      tiktok: tiktokUsername,
      youtube: youtubeChannel,
    },
  })

  return (
    <Card shadow="xs" p="lg" radius="md" h="min-content">
      <Flex direction="column" h="100%">
        <Group mb="xs" position="apart">
          <Text>{decodeURIComponent(title)}</Text>
          {!isEditing && !isUrl && (
            <ActionIcon
              onClick={() => {
                setIsEditing(true)
                setPendingConfig(config)
              }}
            >
              <IconAdjustmentsHorizontal size={18} />
            </ActionIcon>
          )}
        </Group>

        {isEditing ? (
          <>
            <Input
              type="text"
              placeholder="Chat name"
              defaultValue={decodeURIComponent(form.values.title)}
              onChange={(event) => {
                form.setFieldValue('title', event.target.value)
              }}
            />
            <Menu shadow="md" position="right" withArrow my="md">
              <Menu.Target>
                <Button rightIcon={<IconPlus size={18} />} w="min-content">
                  Add Chat
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Sources</Menu.Label>
                <Menu.Item
                  onClick={() => {
                    if (pendingConfig['twitch']['enabled']) {
                      return
                    }

                    setPendingConfig({
                      ...pendingConfig,
                      twitch: {
                        enabled: true,
                        handle: pendingConfig['twitch']['handle'],
                      },
                    })
                  }}
                >
                  Twitch
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    if (pendingConfig['tiktok']['enabled']) {
                      return
                    }

                    setPendingConfig({
                      ...pendingConfig,
                      tiktok: {
                        enabled: true,
                        handle: pendingConfig['tiktok']['handle'],
                      },
                    })
                  }}
                >
                  TikTok
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    if (pendingConfig['youtube']['enabled']) {
                      return
                    }

                    setPendingConfig({
                      ...pendingConfig,
                      youtube: {
                        enabled: true,
                        channel: pendingConfig['youtube']['channel'],
                      },
                    })
                  }}
                >
                  YouTube
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setIsEditing(false)

                // copy pendingChatSources to chatSources
                // and merge with new form values
                setChatSources({
                  [encodeURIComponent(form.values.title)]: {
                    twitch: {
                      ...pendingConfig['twitch'],
                      handle: form.values['twitch'],
                    },
                    tiktok: {
                      ...pendingConfig['tiktok'],
                      handle: form.values['tiktok'],
                    },
                    youtube: {
                      ...pendingConfig['youtube'],
                      channel: form.values['youtube'],
                    },
                  },
                })
              }}
            >
              {Object.keys(pendingConfig).map((service) => {
                if (pendingConfig[service]['enabled'] === false) {
                  return null
                }

                if (service === 'twitch') {
                  return (
                    <TextInput
                      key={service}
                      defaultValue={form.values['twitch']}
                      onChange={(event) => {
                        form.setFieldValue('twitch', event.target.value)
                      }}
                      label="Twitch Channel"
                      placeholder="sampepper"
                      mb="xs"
                      rightSection={
                        <CloseButton
                          size={18}
                          onClick={() => {
                            setPendingConfig({
                              ...pendingConfig,
                              twitch: {
                                enabled: false,
                              },
                            })
                          }}
                        />
                      }
                    />
                  )
                } else if (service === 'tiktok') {
                  return (
                    <TextInput
                      key={service}
                      defaultValue={form.values['tiktok']}
                      onChange={(event) => {
                        form.setFieldValue('tiktok', event.target.value)
                      }}
                      label="TikTok Username"
                      placeholder="sampepper"
                      mb="xs"
                      rightSection={
                        <CloseButton
                          size={18}
                          onClick={() => {
                            setPendingConfig({
                              ...pendingConfig,
                              tiktok: {
                                enabled: false,
                              },
                            })
                          }}
                        />
                      }
                    />
                  )
                } else if (service === 'youtube') {
                  return (
                    <TextInput
                      key={service}
                      defaultValue={form.values['youtube']}
                      onChange={(event) => {
                        form.setFieldValue('youtube', event.target.value)
                      }}
                      label="YouTube Channel URL"
                      placeholder="https://www.youtube.com/@LofiGirl"
                      mb="xs"
                      rightSection={
                        <CloseButton
                          size={18}
                          onClick={() => {
                            setPendingConfig({
                              ...pendingConfig,
                              youtube: {
                                enabled: false,
                              },
                            })
                          }}
                        />
                      }
                    />
                  )
                }

                return null
              })}

              <Button.Group mt="md">
                <Button
                  fullWidth
                  color="red"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setPendingConfig()
                  }}
                >
                  Cancel
                </Button>
                <Button fullWidth type="submit">
                  Save
                </Button>
              </Button.Group>
            </form>
          </>
        ) : (
          <>
            <Text color="dimmed" size="sm" mb="md">
              {isUrl ? (
                <>
                  <Text color="dimmed" size="sm">
                    Using URL for chat settings.{' '}
                    <Anchor onClick={() => navigate('/')}>Clear URL</Anchor>
                  </Text>
                </>
              ) : (
                Object.keys(config).map((service, index) => {
                  if (config[service]['enabled'] === false) {
                    return null
                  }

                  return (
                    <Text key={index} color="dimmed" size="sm">
                      {service === 'twitch' && (
                        <>
                          Twitch:{' '}
                          <Anchor
                            href={`https://twitch.tv/${config[service]['handle']}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {config[service]['handle']}
                          </Anchor>
                        </>
                      )}
                      {service === 'tiktok' && (
                        <>
                          TikTok:{' '}
                          <Anchor
                            href={`https://tiktok.com/@${config[service]['handle']}/live`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {config[service]['handle']}
                          </Anchor>
                        </>
                      )}
                      {service === 'youtube' && (
                        <>
                          YouTube:{' '}
                          <Anchor
                            href={`${config[service]['channel']}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {config[service]['channel']}
                          </Anchor>
                        </>
                      )}
                    </Text>
                  )
                })
              )}
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="auto"
              radius="md"
              rightIcon={<IconExternalLink size={18} />}
              onClick={() => {
                const qs = new URLSearchParams()

                // if isUrl = true, use the URL params for the Open Chat box
                // otherwise, use the config values from the edit menu
                if (isUrl) {
                  qs.append('isUrl', 'true')

                  if (twitchUsername) {
                    qs.append('twitchUsername', twitchUsername)
                  }

                  if (tiktokUsername) {
                    qs.append('tiktokUsername', tiktokUsername)
                  }

                  if (youtubeChannel) {
                    qs.append('youtubeChannel', youtubeChannel)
                  }
                } else {
                  if (config['twitch']['enabled']) {
                    qs.append('twitchUsername', twitchUsername)
                  }

                  if (config['tiktok']['enabled']) {
                    qs.append('tiktokUsername', tiktokUsername)
                  }

                  if (config['youtube']['enabled']) {
                    qs.append('youtubeChannel', youtubeChannel)
                  }
                }

                window.open(
                  `/chat?${qs.toString()}`,
                  'sharer',
                  'toolbar=0,status=0,width=350,height=550'
                )
              }}
            >
              Open Chat
            </Button>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              rightIcon={
                isChatDropdownOpen ? (
                  <IconChevronUp size={18} />
                ) : (
                  <IconChevronDown size={18} />
                )
              }
              onClick={() => {
                setIsChatDropdownOpen((prev) => !prev)
              }}
            >
              {isChatDropdownOpen ? 'Close' : 'Expand Below'}
            </Button>

            {isChatDropdownOpen && (
              <Box mt="lg">
                <ChatLog
                  height="300px"
                  twitchUsername={
                    config['twitch']['enabled']
                      ? config['twitch']['handle']
                      : null
                  }
                  tiktokUsername={
                    config['tiktok']['enabled']
                      ? config['tiktok']['handle']
                      : null
                  }
                  youtubeChannel={
                    config['youtube']['enabled']
                      ? config['youtube']['channel']
                      : null
                  }
                  isDark={true}
                  isBig={false}
                />
              </Box>
            )}
          </>
        )}
      </Flex>
    </Card>
  )
}

export default ChatCard

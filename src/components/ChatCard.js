import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  CloseButton,
  Divider,
  Flex,
  Group,
  Input,
  Menu,
  Select,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
  IconHelp,
  IconPlus,
} from '@tabler/icons'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatLog from './ChatLog'
import { useNavigate } from 'react-router-dom'

const ChatCard = ({ title = 'n/a', config = {} }) => {
  const [searchParams] = useSearchParams()
  const { colors } = useMantineTheme()
  const navigate = useNavigate()

  const isUrl = searchParams.get('isUrl') === 'true'

  const [isEditing, setIsEditing] = useState(false)
  const [pendingConfig, setPendingConfig] = useState()
  const [isChatDropdownOpen, setIsChatDropdownOpen] = useState(false)
  const [, setChatSources] = useLocalStorage({
    key: 'chat-sources',
    getInitialValueInEffect: true,
  })

  const [, setActiveTheme] = useLocalStorage({
    key: 'active-theme',
    getInitialValueInEffect: true,
  })

  let twitchUsername = config['twitch']['handle']
  let tiktokUsername = config['tiktok']['handle']
  let youtubeChannel = config['youtube']['channel']
  let themeName = config['theme']['name']

  if (isUrl) {
    twitchUsername = searchParams.get('twitchUsername')
    tiktokUsername = searchParams.get('tiktokUsername')
    youtubeChannel = searchParams.get('youtubeChannel')
    themeName = searchParams.get('theme')
  }

  const decodedTitle = decodeURIComponent(title)

  const form = useForm({
    initialValues: {
      title: decodedTitle,
      theme: themeName,
      twitch: twitchUsername,
      tiktok: tiktokUsername,
      youtube: youtubeChannel,
    },
  })

  return (
    <Card shadow="xs" p="lg" radius="md" h="min-content">
      <Flex direction="column" h="100%">
        <Group mb="xs" position="apart">
          <Text>{decodedTitle}</Text>
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
          <Flex direction="column" gap="md">
            <Text size="md" weight={500}>
              Display Settings
            </Text>
            <Input
              type="text"
              placeholder="Chat name"
              defaultValue={decodeURIComponent(form.values.title)}
              onChange={(event) => {
                form.setFieldValue('title', event.target.value)
              }}
            />
            <Flex direction="column">
              <Select
                onChange={(value) => form.setFieldValue('theme', value)}
                value={form.values.theme}
                label={
                  <Tooltip
                    label={
                      <Box m="sm">
                        <Text>
                          Customize the chat font and background
                          <ul>
                            <li>
                              Default theme: Plain chat on white background
                            </li>
                            <li>Dark theme: Light text on dark background</li>
                            <li>
                              Overlay Impact theme: Larger text with outline.
                              <br />
                              Good for overlays.
                            </li>
                          </ul>
                        </Text>
                      </Box>
                    }
                  >
                    <Text size="sm" mb="6px">
                      Theme{' '}
                      <IconHelp
                        style={{ verticalAlign: 'middle' }}
                        color={colors.gray[6]}
                        size={20}
                      />
                    </Text>
                  </Tooltip>
                }
                data={[
                  {
                    value: 'default',
                    label: 'Default',
                  },
                  {
                    value: 'dark',
                    label: 'Dark',
                  },
                  {
                    value: 'overlay-impact',
                    label: 'Overlay Impact',
                  },
                ]}
              />
            </Flex>
            <Divider />
            <Text size="md" weight={500}>
              Chat Settings
            </Text>
            <Menu shadow="md" position="right" withArrow>
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

                setActiveTheme({
                  name: form.values.theme,
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
          </Flex>
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
                qs.append('isUrl', 'true')

                // if isUrl = true on the current page, reuse the URL params
                // for the popout chat window too
                // otherwise, use the config values from local storage
                if (isUrl) {
                  if (twitchUsername) {
                    qs.append('twitchUsername', twitchUsername)
                  }

                  if (tiktokUsername) {
                    qs.append('tiktokUsername', tiktokUsername)
                  }

                  if (youtubeChannel) {
                    qs.append('youtubeChannel', youtubeChannel)
                  }

                  if (themeName) {
                    qs.append('theme', themeName)
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

                  if (config['theme']['name']) {
                    qs.append('theme', config['theme']['name'])
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

import { useLocalStorage } from '@mantine/hooks'
import { createContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
export const ConfigContext = createContext()

const isPositiveString = (string) => {
  if (string === 'true') return true
  if (string === '1') return true
  return false
}

const ConfigProvider = ({ children }) => {
  // Chat config
  const [chatConfig, setChatConfig] = useLocalStorage({
    key: 'chat-sources',
    getInitialValueInEffect: false,
    defaultValue: {
      configName: 'example',
      twitch: {
        enabled: false,
        channel: '',
      },
      tiktok: {
        enabled: false,
        username: '',
      },
      youtube: {
        enabled: false,
        channel: '',
      },
      kick: {
        enabled: false,
        channelId: '',
        chatroomId: '',
        channelName: '',
      },
    },
  })

  // OBS config
  const [obsConfig, setObsConfig] = useLocalStorage({
    key: 'obs-config',
    getInitialValueInEffect: false,
    defaultValue: {
      streamChannelId: '',
    },
  })

  // StatCard config
  const [statsConfig, setStatsConfig] = useLocalStorage({
    key: 'stats-config',
    getInitialValueInEffect: false,
    defaultValue: {
      tiktokUsername: '',
      twitchUsername: '',
      youtubeChannel: '',
      kickChannelName: '',
    },
  })

  // Timestamp config
  const [timestampConfig, setTimestampConfig] = useLocalStorage({
    key: 'timestamp-config',
    getInitialValueInEffect: false,
    defaultValue: {
      discordChannelId: '',
      youtubeChannel: '',
    },
  })

  // Donations config
  const [slobsConfig, setSlobsConfig] = useLocalStorage({
    key: 'streamlabs-config',
    getInitialValueInEffect: false,
    defaultValue: {
      streamToken: '',
      ttsService: 'streamlabs',
      streamlabsVoice: 'Ivy',
      elevenlabsVoice: '',
      elevenlabsKey: '',
      tiktokUsername: '',
      silentAudioInterval: '10',
      ttsDollarMin: '0',
      excludeFromProfits: false,
    },
  })

  // Keypad config
  const [keypadConfig, setKeypadConfig] = useLocalStorage({
    key: 'keypad-config',
    getInitialValueInEffect: false,
    defaultValue: {
      code: '',
    },
  })

  // Lanyard config
  const [lanyardConfig, setLanyardConfig] = useLocalStorage({
    key: 'lanyard-config',
    getInitialValueInEffect: false,
    defaultValue: {
      discordUserId: '',
      apiKey: '',
    },
  })

  // Currency config
  const [currencyConfig, setCurrencyConfig] = useLocalStorage({
    key: 'currency-config',
    getInitialValueInEffect: false,
    defaultValue: {
      currency: 'usd',
    },
  })

  // Subathon config
  const [subathonConfig, setSubathonConfig] = useLocalStorage({
    key: 'subathon-config',
    getInitialValueInEffect: false,
    defaultValue: {
      timeUnitBase: 1,
      isSubathonActive: false,
    },
  })

  // User config
  const [userConfig, setUserConfig] = useLocalStorage({
    key: 'user-config',
    getInitialValueInEffect: false,
    defaultValue: {
      streamerId: '',
      streamazeKey: '',
    },
  })

  // GPS config
  const [gpsConfig, setGpsConfig] = useLocalStorage({
    key: 'gps-config',
    getInitialValueInEffect: false,
    defaultValue: {
      isGpsEnabled: false,
    },
  })

  // Theme config
  const [themeConfig, setThemeConfig] = useLocalStorage({
    key: 'theme-config',
    getInitialValueInEffect: false,
    defaultValue: {
      theme: 'dark',
    },
  })

  // Layout config
  const [layoutConfig, setLayoutConfig] = useLocalStorage({
    key: 'layout-config',
    getInitialValueInEffect: false,
    defaultValue: {
      isDonationPanelOpen: true,
      isToggleInfoModalOpen: false,
      hiddenInfo: [],
    },
  })

  // Admin config
  const [adminConfig, setAdminConfig] = useLocalStorage({
    key: 'admin-config',
    getInitialValueInEffect: false,
    defaultValue: {
      role: '',
      streamers: [],
      obs_key: '',
    },
  })

  const [searchParams] = useSearchParams()
  const isChat = isPositiveString(searchParams.get('isChat'))
  const isObs = isPositiveString(searchParams.get('isObs'))
  const isStats = isPositiveString(searchParams.get('isStats'))
  const isClip = isPositiveString(searchParams.get('isClip'))
  const isSlobs = isPositiveString(searchParams.get('isSlobs'))
  const isKeypad = isPositiveString(searchParams.get('isKeypad'))
  const isLanyard = isPositiveString(searchParams.get('isLanyard'))
  const isUser = isPositiveString(searchParams.get('isUser'))
  const isGps = isPositiveString(searchParams.get('isGps'))
  const isTheme = isPositiveString(searchParams.get('isTheme'))

  // Load chat config from URLs
  let tiktokChat = ''
  let youtubeChat = ''
  let twitchChat = ''
  let kickChat = ''
  if (isChat) {
    if (searchParams.get('tiktokChat')) {
      tiktokChat = searchParams.get('tiktokChat')
    }

    if (searchParams.get('youtubeChat')) {
      youtubeChat = searchParams.get('youtubeChat')
    }

    if (searchParams.get('twitchChat')) {
      twitchChat = searchParams.get('twitchChat')
    }

    if (searchParams.get('kickChat')) {
      kickChat = searchParams.get('kickChat')
    }
  }

  // Load OBS config from URLs
  let obsChannel = ''
  if (isObs) {
    if (searchParams.get('obsChannel')) {
      obsChannel = searchParams.get('obsChannel')
    }
  }

  // Load stats config from URLs
  let tiktokStats = ''
  let youtubeStats = ''
  // let twitchStats = ''
  let kickStats = ''
  if (isStats) {
    if (searchParams.get('tiktokStats')) {
      tiktokStats = searchParams.get('tiktokStats')
    }

    if (searchParams.get('youtubeStats')) {
      youtubeStats = searchParams.get('youtubeStats')
    }

    // TODO: Add Twitch viewer count
    // if (searchParams.get('twitchStats')) {
    //   twitchStats = searchParams.get('twitchStats')
    // }

    if (searchParams.get('kickStats')) {
      kickStats = searchParams.get('kickStats')
    }
  }

  // Load timestamp config from URLs
  let discordTimestamp = ''
  let youtubeTimestamp = ''
  if (isClip) {
    if (searchParams.get('clipDiscord')) {
      discordTimestamp = searchParams.get('clipDiscord')
    }

    if (searchParams.get('clipYT')) {
      youtubeTimestamp = searchParams.get('clipYT')
    }
  }

  // Load Streamlabs config from URLs
  let streamToken = ''
  let ttsVoice = ''
  let tiktokDonos = ''
  let ttsDollarMin = ''
  if (isSlobs) {
    if (searchParams.get('streamToken')) {
      streamToken = searchParams.get('streamToken')
    }

    if (searchParams.get('ttsVoice')) {
      ttsVoice = searchParams.get('ttsVoice')
    }

    if (searchParams.get('tiktokDonos')) {
      tiktokDonos = searchParams.get('tiktokDonos')
    }

    if (searchParams.get('ttsDollarMin')) {
      ttsDollarMin = searchParams.get('ttsDollarMin')
    }
  }

  // Load Keypad config from URL
  let keypadCode = ''
  if (isKeypad) {
    if (searchParams.get('keypadCode')) {
      keypadCode = searchParams.get('keypadCode')
    }
  }

  // Load Lanyard config from URL
  let discordUserId = ''
  let apiKey = ''
  if (isLanyard) {
    if (searchParams.get('discordUserId')) {
      discordUserId = searchParams.get('discordUserId')
    }

    if (searchParams.get('apiKey')) {
      apiKey = searchParams.get('apiKey')
    }
  }

  // Load User config from URL
  let streamazeKey = ''
  let streamerId = ''
  if (isUser) {
    if (searchParams.get('streamazeKey')) {
      streamazeKey = searchParams.get('streamazeKey')
    }

    if (searchParams.get('streamerId')) {
      streamerId = searchParams.get('streamerId')
    }
  }

  // Load GPS config from URL
  let isGpsEnabled = ''
  if (isGps) {
    if (searchParams.get('isGpsEnabled')) {
      isGpsEnabled = searchParams.get('isGpsEnabled')
    }
  }

  // Load Theme config from URL
  let theme = ''
  if (isTheme) {
    if (searchParams.get('theme')) {
      theme = searchParams.get('theme')
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        chatConfig: {
          ...chatConfig,
          tiktok: {
            ...chatConfig.tiktok,
            username: tiktokChat ? tiktokChat : chatConfig.tiktok.username,
          },
          youtube: {
            ...chatConfig.youtube,
            channel: youtubeChat ? youtubeChat : chatConfig.youtube.channel,
          },
          twitch: {
            ...chatConfig.twitch,
            username: twitchChat ? twitchChat : chatConfig.twitch.username,
          },
          kick: {
            ...chatConfig.kick,
            channelName: kickChat ? kickChat : chatConfig.kick.channelName,
          },
        },
        setChatConfig,
        obsConfig: {
          ...obsConfig,
          streamChannelId: obsChannel ? obsChannel : obsConfig.streamChannelId,
        },
        setObsConfig,
        statsConfig: {
          ...statsConfig,
          tiktokUsername: tiktokStats
            ? tiktokStats
            : statsConfig.tiktokUsername,
          youtubeChannel: youtubeStats
            ? youtubeStats
            : statsConfig.youtubeChannel,
          // twitchUsername: twitchStats
          //   ? twitchStats : statsConfig.twitchUsername,
          kickChannelName: kickStats ? kickStats : statsConfig.kickChannelName,
        },
        setStatsConfig,
        timestampConfig: {
          ...timestampConfig,
          discordChannelId: discordTimestamp
            ? discordTimestamp
            : timestampConfig.discordChannelId,
          youtubeChannel: youtubeTimestamp
            ? youtubeTimestamp
            : timestampConfig.youtubeChannel,
        },
        setTimestampConfig,
        slobsConfig: {
          ...slobsConfig,
          streamToken: streamToken ? streamToken : slobsConfig.streamToken,
          ttsVoice: ttsVoice ? ttsVoice : slobsConfig.ttsVoice,
          tiktokUsername: tiktokDonos
            ? tiktokDonos
            : slobsConfig.tiktokUsername,
          silentAudioInterval: slobsConfig.silentAudioInterval,
          ttsDollarMin: ttsDollarMin ? ttsDollarMin : slobsConfig.ttsDollarMin,
        },
        setSlobsConfig,
        keypadConfig: {
          ...keypadConfig,
          code: keypadCode ? keypadCode : keypadConfig.code,
        },
        setKeypadConfig,
        lanyardConfig: {
          ...lanyardConfig,
          discordUserId: discordUserId
            ? discordUserId
            : lanyardConfig.discordUserId,
          apiKey: apiKey ? apiKey : lanyardConfig.apiKey,
        },
        setLanyardConfig,
        currencyConfig,
        setCurrencyConfig,
        subathonConfig,
        setSubathonConfig,
        userConfig: {
          ...userConfig,
          streamerId: streamerId ? streamerId : userConfig.streamerId,
          streamazeKey: streamazeKey ? streamazeKey : userConfig.streamazeKey,
        },
        setUserConfig,
        gpsConfig: {
          ...gpsConfig,
          isGpsEnabled: isGpsEnabled ? isGpsEnabled : gpsConfig.isGpsEnabled,
        },
        setGpsConfig,
        themeConfig: {
          ...themeConfig,
          theme: theme ? theme : themeConfig.theme,
        },
        setThemeConfig,
        layoutConfig,
        setLayoutConfig,
        // don't load admin config from URL
        adminConfig,
        setAdminConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider

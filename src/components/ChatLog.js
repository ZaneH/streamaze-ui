import styled from '@emotion/styled'
import {
  Box,
  Burger,
  Center,
  Loader,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { IconArrowRight, IconSettings } from '@tabler/icons'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'
import { ConfigContext } from './Providers/ConfigProvider'

const Item = styled.div`
  margin: 0;
  padding: 3px 0;
`

const ItemContent = styled.div`
  font-size: ${({ isBig }) => (isBig ? '2.1em' : '1.25em')};
  color: ${({ isBig }) => (isBig ? '#efeff1' : '#000')};

  .chat-outline,
    display: inline-block;
    position: relative;
    background: transparent;
    z-index: 0;
  }

  .chat-outline:before {
    line-height: ${({ isBig }) => (isBig ? '1.7em' : 'initial')};
    text-indent: ${({ isBig }) => (isBig ? '40px' : '33pt')};
    content: ${({ isBig }) => (isBig ? 'attr(data-outline)' : 'none')};
    position: absolute;
    -webkit-text-stroke: 7px #000;
    word-break: break-all;
    left: 16px;
    right: 16px;
    top: 1px;
    z-index: -1;
    vertical-align: middle;
  }

  svg {
    min-width: fit-content;
  }
`

const List = styled.div`
  padding: 0;
`

const Footer = styled.div`
  padding-top: 18px;
`

const SenderText = styled(Text)`
  display: inline;
  vertical-align: middle;
  margin-left: 12px;
  word-break: break-all;
}`

const MessageText = styled(Text)`
  display: inline;
  vertical-align: middle;
  word-break: break-all;
`

const { REACT_APP_API_WS_URL } = process.env

const ChatLog = ({
  twitchUsername,
  tiktokUsername,
  youtubeChannel,
  fullHeight,
  height = '300px',
  isDark = undefined,
  isBig = undefined,
  ...props
}) => {
  const [searchParams] = useSearchParams()
  const [chatData, setChatData] = useState([])
  const virtuosoRef = useRef(null)
  const { colors } = useMantineTheme()
  const { chatConfig } = useContext(ConfigContext)

  const _tiktokUsername = tiktokUsername || chatConfig?.tiktok?.username
  const _youtubeChannel = youtubeChannel || chatConfig?.youtube?.channel
  const _twitchUsername = twitchUsername || chatConfig?.twitch?.username

  if (isBig === undefined) {
    isBig = searchParams.get('theme') === 'overlay-impact'
  }

  if (isDark === undefined) {
    isDark = searchParams.get('theme') === 'dark'
  }

  const { lastMessage: tiktokWSLastMessage, sendMessage: tiktokWSSendMessage } =
    useWebSocket(
      `${REACT_APP_API_WS_URL}/tiktok/chat?username=${_tiktokUsername || 'L'}`
    )

  const {
    lastMessage: youtubeWSLastMessage,
    sendMessage: youtubeWSSendMessage,
  } = useWebSocket(
    `${REACT_APP_API_WS_URL}/youtube/chat?channelUrl=${_youtubeChannel || 'L'}`
  )

  const { lastMessage: twitchWSLastMessage, sendMessage: twitchWSSendMessage } =
    useWebSocket(
      `${REACT_APP_API_WS_URL}/twitch/chat?channel=${_twitchUsername || 'L'}`
    )

  useEffect(() => {
    if (twitchWSLastMessage !== null) {
      const payload = JSON.parse(twitchWSLastMessage.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
          emotes: [],
        },
      ])
    }
  }, [twitchWSLastMessage])

  useEffect(() => {
    if (tiktokWSLastMessage !== null) {
      const payload = JSON.parse(tiktokWSLastMessage.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
          emotes: [],
        },
      ])
    }
  }, [tiktokWSLastMessage])

  useEffect(() => {
    if (youtubeWSLastMessage !== null) {
      const payload = JSON.parse(youtubeWSLastMessage.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
          emotes: payload.emotes,
        },
      ])
    }
  }, [youtubeWSLastMessage])

  // send message to websocket every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      if (_twitchUsername) {
        twitchWSSendMessage('ping')
      }

      if (_tiktokUsername) {
        tiktokWSSendMessage('ping')
      }

      if (_youtubeChannel) {
        youtubeWSSendMessage('ping')
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [
    _twitchUsername,
    _tiktokUsername,
    _youtubeChannel,
    twitchWSSendMessage,
    tiktokWSSendMessage,
    youtubeWSSendMessage,
  ])

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: chatData.length - 1,
      })
    }
  }, [chatData])

  if (!_twitchUsername && !_tiktokUsername && !_youtubeChannel) {
    return (
      <Box {...props} py="xl">
        <Text align="center">
          No chat specified
          <br />
          <Text size={14} color="dimmed">
            Add one by going to your settings
            <br />
            <Burger
              size={18}
              style={{ verticalAlign: 'middle', cursor: 'default' }}
              color={colors.gray[6]}
            />
            <IconArrowRight
              size={18}
              style={{ verticalAlign: 'middle', margin: '0 4px' }}
              color={colors.gray[6]}
            />
            <IconSettings
              size={24}
              style={{ verticalAlign: 'middle' }}
              color={colors.gray[6]}
            />
          </Text>
        </Text>
      </Box>
    )
  }

  if (chatData.length === 0) {
    return (
      <Center mih={fullHeight ? '100%' : height} {...props}>
        <Loader />
      </Center>
    )
  }

  return (
    <Box
      style={{
        background: isDark ? '#18181C' : 'transparent',
        height: fullHeight ? '100%' : height,
      }}
    >
      <Virtuoso
        style={{
          minHeight: fullHeight ? '100%' : height,
          overflowX: 'hidden',
        }}
        ref={virtuosoRef}
        initialTopMostItemIndex={999}
        data={chatData}
        followOutput={true}
        totalCount={chatData.length}
        components={{
          Item,
          List,
          Footer,
        }}
        itemContent={(_, chatEvent) => {
          const { sender, message, origin, emotes = [] } = chatEvent
          const iconSize = isBig ? 28 : 26

          // escape any html tags (<>) in message
          let newMessageString =
            message?.replaceAll('<', '&lt;')?.replaceAll('>', '&gt;') || ''

          // replace emotes with img tag using url
          emotes.forEach((emote) => {
            const keys = emote?.keys // shortcodes for emote
            const url = emote?.url // svg url
            keys.forEach((key) => {
              newMessageString = newMessageString.replaceAll(
                key,
                isBig // if big, don't show emotes
                  ? ''
                  : `<img src="${url}" style="height: 22px; vertical-align: middle;" referrerpolicy="no-referrer" />`
              )
            })
          })

          return (
            <ItemContent isBig={isBig}>
              <Box style={{ whiteSpace: 'nowrap' }} px="16px" {...props}>
                <div
                  style={{
                    verticalAlign: 'middle',
                    whiteSpace: 'break-spaces',
                    width: '100%',
                    color: isDark ? '#efeff1' : 'inherit',
                  }}
                >
                  {origin === 'twitch' && (
                    <SocialIcon
                      network="twitch"
                      fgColor="#fff"
                      style={{
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                  )}
                  {origin === 'tiktok' && (
                    <SocialIcon
                      fgColor="#fff"
                      network="tiktok"
                      style={{
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                  )}
                  {origin === 'youtube' && (
                    <SocialIcon
                      fgColor="#fff"
                      network="youtube"
                      style={{
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                  )}
                  <SenderText
                    ff={isBig ? 'Impact' : undefined}
                    fw={isBig ? undefined : '700'}
                    lh={isBig ? '1.64em' : '1em'}
                    data-outline={`${sender}: ${newMessageString}`}
                    className={isBig ? 'chat-outline' : undefined}
                  >{`${sender}: `}</SenderText>
                  <MessageText
                    ff={isBig ? 'Impact' : undefined}
                    lh={isBig ? '1.64em' : '1em'}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: newMessageString }}
                    />
                  </MessageText>
                </div>
              </Box>
            </ItemContent>
          )
        }}
      />
    </Box>
  )
}

export default ChatLog

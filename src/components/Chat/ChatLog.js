import styled from '@emotion/styled'
import {
  Avatar,
  Box,
  Burger,
  Center,
  Flex,
  Loader,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { IconArrowRight, IconSettings } from '@tabler/icons'
import { useContext, useEffect, useRef, useState } from 'react'
import { ReactComponent as ModChatIcon } from '../../mod-chat-icon.svg'
import { ReactComponent as VerifiedChatIcon } from '../../verified-chat-icon.svg'
import { useSearchParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'
import { ConfigContext } from '../Providers/ConfigProvider'
import { showNotification } from '@mantine/notifications'

const Item = styled.div`
  margin: 4px 0;
  padding: 3px 0;
`

const ItemContent = styled.div`
  font-size: ${({ isbig }) => (isbig ? '2.1em' : '1.12em')};
  color: ${({ isbig }) => (isbig ? '#efeff1' : '#000')};

  .chat-outline,
    display: inline-block;
    position: relative;
    background: transparent;
    z-index: 0;
  }

  .chat-outline:before {
    line-height: ${({ isbig }) => (isbig ? '1.7em' : 'initial')};
    content: ${({ isbig }) => (isbig ? 'attr(data-outline)' : 'none')};
    position: absolute;
    -webkit-text-stroke: 7px #000;
    word-break: break-all;
    top: 1px;
    z-index: -1;
    left: ${({ compact }) => (compact ? `24px` : `32px`)};
    right: ${({ compact }) => (compact ? `24px` : `32px`)};
    ${({ fluid }) => fluid && 'left: 0; right: 0;'}

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

// TODO: word-break: break-all; will not work with isBig
const SenderText = styled(Text)`
  display: inline;
  vertical-align: middle;
  word-break: break-word;
  color: ${({ isbig }) => (isbig ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  ${({ ismember }) => ismember && 'color: #2ba640;'}
  ${({ ismod }) => ismod && 'color: #5e84f1;'}
}`

const MessageText = styled(Text)`
  display: inline;
  vertical-align: middle;
  word-break: break-word;
  color: white;
`

const { REACT_APP_API_2_WS_URL } = process.env

const ChatLog = ({
  twitchUsername,
  tiktokUsername,
  youtubeChannel,
  fullHeight,
  compact = false,
  fluid = false,
  showProfilePicture = true,
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

  const { lastMessage: lastChatJsonMessage, sendJsonMessage: chatSendMessage } =
    useWebSocket(
      `${REACT_APP_API_2_WS_URL}`,
      {
        retryOnError: true,
        reconnectInterval: 10000,
        shouldReconnect: () => true,
        onError: () => {
          showNotification({
            title: 'Chat Error',
            message: "Couldn't connect to the chat.",
            color: 'red',
          })
        },
        onOpen: () => {
          const params = {}
          if (_tiktokUsername) {
            params['tiktokChat'] = _tiktokUsername
          }

          if (_youtubeChannel) {
            params['youtubeChat'] = _youtubeChannel
          }

          // TODO: Not implemented in the new API yet
          // if (_twitchUsername) {
          //   params['twitchChat'] = _twitchUsername
          // }

          chatSendMessage(params)
        },
      },
      !!_tiktokUsername || !!_youtubeChannel || !!_twitchUsername
    )

  useEffect(() => {
    if (lastChatJsonMessage !== null) {
      const payload = JSON.parse(lastChatJsonMessage.data)
      if (payload?.origin === 'tiktok') {
        setChatData((prev) => [
          ...prev,
          {
            message: payload.message,
            sender: payload.sender,
            origin: payload.origin,
            emotes: [],
            pfp: payload.pfp,
          },
        ])
      } else if (payload?.origin === 'youtube') {
        setChatData((prev) => [
          ...prev,
          {
            message: payload.message,
            sender: payload.sender,
            origin: payload.origin,
            emotes: payload.emotes,
            pfp: payload.pfp,
            isMod: payload.is_mod,
            isVerified: payload.is_verified,
            isMember: payload.is_member,
            memberBadge: payload.member_badge,
          },
        ])
      } else if (payload?.origin === 'twitch') {
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
    }
  }, [lastChatJsonMessage])

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: chatData.length - 1,
      })
    }
  }, [chatData.length])

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
        followOutput="smooth"
        totalCount={chatData.length}
        components={{
          Item,
          List,
          Footer,
        }}
        itemContent={(_, chatEvent) => {
          const {
            sender,
            message,
            emotes,
            pfp,
            isMod,
            isVerified,
            isMember,
            memberBadge,
          } = chatEvent

          let newMessageString = message || ''

          // replace emotes with img tag using url
          emotes?.forEach((emote) => {
            const key = emote?.keys // shortcode for emote
            const url = emote?.url // svg url

            if (!key || !url) {
              return
            }

            newMessageString = newMessageString.replaceAll(
              key,
              isBig // if big, don't show emotes
                ? ''
                : `<img src="${url}" alt="${key.replaceAll(
                    ':',
                    ''
                  )}" style="height: 22px; vertical-align: middle;" referrerpolicy="no-referrer" />`
            )
          })

          return (
            <ItemContent
              isbig={isBig ? 'true' : undefined}
              compact={compact}
              fluid={fluid}
            >
              <Flex gap="16px" style={{ whiteSpace: 'nowrap' }} {...props}>
                {showProfilePicture && !isBig && (
                  <Avatar
                    size="32px"
                    style={{
                      display: 'inline-block',
                    }}
                    radius="xl"
                    src={pfp}
                    color="blue"
                  >
                    {sender?.[0] || '?'}
                  </Avatar>
                )}
                <div
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    whiteSpace: 'break-spaces',
                    width: '100%',
                    color: isDark ? '#efeff1' : 'inherit',
                  }}
                >
                  <SenderText
                    ff={isBig ? 'Impact' : 'Roboto'}
                    fw={isBig ? undefined : '700'}
                    lh={isBig ? '1.64em' : '1em'}
                    data-outline={`${sender}:  ${newMessageString}`}
                    className={isBig ? 'chat-outline' : undefined}
                    isbig={isBig ? 'true' : undefined}
                    ismod={isMod ? 'true' : undefined}
                    ismember={isMember ? 'true' : undefined}
                  >
                    {`${sender}${isBig ? ':' : ''}`}
                    {isMod && !isBig && (
                      <ModChatIcon
                        fill="#5e84f1"
                        style={{
                          width: '16px',
                          height: '16px',
                          verticalAlign: 'middle',
                          marginLeft: '4px',
                        }}
                      />
                    )}
                    {isMember && !isBig && (
                      <img
                        alt="Member Badge"
                        src={memberBadge}
                        style={{
                          height: '16px',
                          width: '16px',
                          verticalAlign: 'middle',
                          marginLeft: '4px',
                        }}
                      />
                    )}
                    {isVerified && !isBig && (
                      <VerifiedChatIcon
                        fill="#999"
                        style={{
                          width: '16px',
                          height: '16px',
                          verticalAlign: 'middle',
                          marginLeft: '4px',
                        }}
                      />
                    )}
                    {`  `}
                  </SenderText>
                  <MessageText
                    ff={isBig ? 'Impact' : 'Roboto'}
                    lh={isBig ? '1.64em' : '1em'}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: newMessageString }}
                    />
                  </MessageText>
                </div>
              </Flex>
            </ItemContent>
          )
        }}
      />
    </Box>
  )
}

export default ChatLog

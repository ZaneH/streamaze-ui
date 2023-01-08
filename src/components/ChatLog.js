import styled from '@emotion/styled'
import { Box, Center, Loader, Text } from '@mantine/core'
import { IconAdjustmentsHorizontal } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'

const Item = styled.div`
  margin: 0;
`

const ItemContent = styled.div`
  font-size: ${({ isBig }) => (isBig ? '2.1em' : '1.12em')};
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
}) => {
  const [searchParams] = useSearchParams()
  const [chatData, setChatData] = useState([])
  const virtuosoRef = useRef(null)

  if (isBig === undefined || isDark === undefined) {
    isBig = searchParams.get('theme') === 'overlay-impact'
    isDark = searchParams.get('theme') === 'dark'
  }

  const isUrl = searchParams.get('isUrl') === 'true'
  let _twitchUsername = twitchUsername
  let _tiktokUsername = tiktokUsername
  let _youtubeChannel = youtubeChannel

  if (isUrl) {
    _twitchUsername = searchParams.get('twitchUsername')
    _tiktokUsername = searchParams.get('tiktokUsername')
    _youtubeChannel = searchParams.get('youtubeChannel')
  }

  const { lastMessage: twitchWSLastMessage } = useWebSocket(
    `${REACT_APP_API_WS_URL}/twitch/chat?channel=${_twitchUsername || 'L'}`
  )

  const { lastMessage: tiktokWSLastMessage } = useWebSocket(
    `${REACT_APP_API_WS_URL}/tiktok/chat?username=${_tiktokUsername || 'L'}`
  )

  const { lastMessage: youtubeWSLastMessage } = useWebSocket(
    `${REACT_APP_API_WS_URL}/youtube/chat?channelUrl=${_youtubeChannel || 'L'}`
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
        },
      ])
    }

    if (tiktokWSLastMessage !== null) {
      const payload = JSON.parse(tiktokWSLastMessage.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
        },
      ])
    }

    if (youtubeWSLastMessage !== null) {
      const payload = JSON.parse(youtubeWSLastMessage.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
        },
      ])
    }
  }, [twitchWSLastMessage, tiktokWSLastMessage, youtubeWSLastMessage])

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: chatData.length - 1,
      })
    }
  }, [chatData])

  if (!_twitchUsername && !_tiktokUsername && !_youtubeChannel) {
    return (
      <Text align="center" my="xl">
        No chat specified
        <br />
        <Text size={14} color="dimmed">
          Add one using the{' '}
          <IconAdjustmentsHorizontal
            size={18}
            style={{ verticalAlign: 'sub' }}
          />{' '}
          menu
        </Text>
      </Text>
    )
  }

  if (chatData.length === 0) {
    return (
      <Center mih={fullHeight ? '100vh' : height}>
        <Loader />
      </Center>
    )
  }

  return (
    <Box style={{ background: isDark ? '#18181C' : 'transparent' }}>
      <Virtuoso
        style={{
          minHeight: fullHeight ? '100vh' : height,
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
          const { sender, message, origin } = chatEvent
          const iconSize = isBig ? 28 : 22

          return (
            <ItemContent isBig={isBig}>
              <Box style={{ whiteSpace: 'nowrap' }} px="16px">
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
                    data-outline={`${sender}: ${message}`}
                    className={isBig ? 'chat-outline' : undefined}
                  >{`${sender}: `}</SenderText>
                  <MessageText
                    ff={isBig ? 'Impact' : undefined}
                    lh={isBig ? '1.64em' : '1em'}
                  >
                    {message}
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

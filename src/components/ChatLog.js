import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Text } from '@mantine/core'
import {
  useEventSource,
  useEventSourceListener,
} from '@react-nano/use-event-source'
import { IconAdjustmentsHorizontal } from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import { Virtuoso } from 'react-virtuoso'

const Item = styled.div`
  margin: 0;
`

const ItemContent = styled.div`
  font-size: ${({ isBig }) => (isBig ? '2.1em' : '1.12em')};
  // ${({ isBig }) => (isBig ? 'font-weight: 700;' : '')};
  color: ${({ isBig }) => (isBig ? '#efeff1' : '#000')};

  .chat-outline,
    display: inline-block;
    position: relative;
    background: transparent;
    z-index: 0;
  }

  .chat-outline:before {
    line-height: ${({ isBig }) => (isBig ? '1.6em' : '1em')};
    text-indent: ${({ isBig }) => (isBig ? '36px' : '33pt')};
    content: ${({ isBig }) => (isBig ? 'attr(data-outline)' : 'none')};
    position: absolute;
    -webkit-text-stroke: 7px #000;
    left: 16px;
    right: 16px;
    top: 5px;
    z-index: -1;
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
  font-weight: 700;
  vertical-align: middle;
  margin-left: 8px;
}`

const MessageText = styled(Text)`
  display: inline;
  vertical-align: middle;
`

const { REACT_APP_API_URL } = process.env

const ChatLog = ({
  twitchUsername,
  tiktokUsername,
  youtubeChannel,
  fullHeight,
  height = '300px',
  isDark = false,
  isBig = false,
}) => {
  const [searchParams] = useSearchParams()
  const [chatData, setChatData] = useState([])
  const virtuosoRef = useRef(null)

  isBig = searchParams.get('theme') === 'overlay-impact'

  const isUrl = searchParams.get('isUrl') === 'true'
  let _twitchUsername = twitchUsername
  let _tiktokUsername = tiktokUsername
  let _youtubeChannel = youtubeChannel

  if (isUrl) {
    _twitchUsername = searchParams.get('twitchUsername')
    _tiktokUsername = searchParams.get('tiktokUsername')
    _youtubeChannel = searchParams.get('youtubeChannel')
  }

  const [twitchEventSource, twitchStatus] = useEventSource(
    `${REACT_APP_API_URL}/twitch/chat?channel=${_twitchUsername || 'L'}`
  )

  const [tiktokEventSource, tiktokStatus] = useEventSource(
    `${REACT_APP_API_URL}/tiktok/chat?username=${_tiktokUsername || 'L'}`
  )

  const [youtubeEventSource, youtubeStatus] = useEventSource(
    `${REACT_APP_API_URL}/youtube/chat?channelUrl=${_youtubeChannel || 'L'}`
  )

  useEffect(() => {
    let isError = false
    if (twitchStatus === 'error' && _twitchUsername) {
      isError = true
    } else if (tiktokStatus === 'error' && _tiktokUsername) {
      isError = true
    } else if (youtubeStatus === 'error' && _youtubeChannel) {
      isError = true
    }

    if (isError) {
      setTimeout(() => {
        window.location.reload()
      }, 5000)
    }
  }, [
    twitchStatus,
    tiktokStatus,
    youtubeStatus,
    _twitchUsername,
    _tiktokUsername,
    _youtubeChannel,
  ])

  useEventSourceListener(twitchEventSource, ['twitch'], (evt) => {
    if (evt.data) {
      const payload = JSON.parse(evt.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
        },
      ])
    }
  })

  useEventSourceListener(tiktokEventSource, ['tiktok'], (evt) => {
    if (evt.data) {
      const payload = JSON.parse(evt.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
        },
      ])
    }
  })

  useEventSourceListener(youtubeEventSource, ['youtube'], (evt) => {
    if (evt.data) {
      const payload = JSON.parse(evt.data)
      setChatData((prev) => [
        ...prev,
        {
          message: payload.message,
          sender: payload.sender,
          origin: payload.origin,
        },
      ])
    }
  })

  useEffect(() => {
    return () => {
      if (twitchEventSource) {
        twitchEventSource.close()
      }

      if (tiktokEventSource) {
        tiktokEventSource.close()
      }

      if (youtubeEventSource) {
        youtubeEventSource.close()
      }
    }
  }, [twitchEventSource, tiktokEventSource, youtubeEventSource])

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

  return (
    <Box style={{ background: 'transparent' }}>
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
              <Box style={{ whiteSpace: 'nowrap' }} px="md">
                <span
                  style={{
                    verticalAlign: 'middle',
                    whiteSpace: 'break-spaces',
                    width: '100%',
                  }}
                >
                  {origin === 'twitch' && (
                    <SocialIcon
                      network="twitch"
                      style={{
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                  )}
                  {origin === 'tiktok' && (
                    <SocialIcon
                      network="tiktok"
                      style={{
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                  )}
                  {origin === 'youtube' && (
                    <SocialIcon
                      network="youtube"
                      style={{
                        height: iconSize,
                        width: iconSize,
                      }}
                    />
                  )}
                  <SenderText
                    ff={isBig ? 'Impact' : undefined}
                    lh={isBig ? '1.6em' : '1em'}
                    data-outline={`${sender}: ${message}`}
                    className="chat-outline"
                  >{`${sender}: `}</SenderText>
                  <MessageText
                    ff={isBig ? 'Impact' : undefined}
                    data-outline={`${sender}: ${message}`}
                    className="chat-outline"
                  >
                    {message}
                  </MessageText>
                </span>
              </Box>
            </ItemContent>
          )
        }}
      />
    </Box>
  )
}

export default ChatLog

import styled from '@emotion/styled'
import { Box, Text } from '@mantine/core'
import {
  useEventSource,
  useEventSourceListener,
} from '@react-nano/use-event-source'
import {
  IconAdjustmentsHorizontal,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
} from '@tabler/icons'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import { Virtuoso } from 'react-virtuoso'

const Item = styled.div`
  margin: 0;
  font-size: ${({ isBig }) => (isBig ? '2.1em' : '1.12em')};
  line-height: ${({ isBig }) => (isBig ? '2.1em' : '1em')};
  font-family: ${({ isBig }) => (isBig ? 'Impact' : 'Arial')};
  color: ${({ isBig }) => (isBig ? '#efeff1' : '#000')};

  .chat-sender,
  .chat-message {
    display: inline-block;
    position: relative;
    background: transparent;
    z-index: 0;
  }

  .chat-sender:before,
  .chat-message:before {
    content: ${({ isBig }) => (isBig ? 'attr(data-outline);' : 'none')}
    position: absolute;
    -webkit-text-stroke: 7px #000;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .chat-sender:before {
    text-indent: 33pt;
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

          return (
            <Box className="chat-item">
              <Box style={{ whiteSpace: 'nowrap' }}>
                <span
                  className="chat-sender"
                  data-outline={`${sender}: ${message}`}
                  style={{
                    verticalAlign: 'middle',
                    whiteSpace: 'break-spaces',
                    width: '100%',
                  }}
                >
                  {origin === 'twitch' && <SocialIcon network="twitch" />}
                  {origin === 'tiktok' && <SocialIcon network="tiktok" />}
                  {origin === 'youtube' && (
                    <SocialIcon
                      network="youtube"
                      style={{
                        transform: 'scale(0.5)',
                      }}
                    />
                  )}
                  <Text
                    style={{ display: 'inline-block', fontWeight: '700' }}
                  >{`${sender}: `}</Text>
                  {message}
                </span>
              </Box>
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default ChatLog

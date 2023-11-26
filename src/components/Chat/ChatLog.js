/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import {
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Flex,
  Loader,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { IconArrowRight, IconSettings } from '@tabler/icons'
import { ReactComponent as ArrowReplyIcon } from 'assets/arrow-reply-icon.svg'
import IceBadge from 'assets/ice-badge.png'
import { ReactComponent as KickBroadcasterBadge } from 'assets/kick-broadcaster-badge.svg'
import { ReactComponent as KickFoundersBadge } from 'assets/kick-founders-badge.svg'
import { ReactComponent as KickGifted100Badge } from 'assets/kick-gifted-100-badge.svg'
import { ReactComponent as KickGifted200Badge } from 'assets/kick-gifted-200-badge.svg'
import { ReactComponent as KickGifted25Badge } from 'assets/kick-gifted-25-badge.svg'
import { ReactComponent as KickGifted50Badge } from 'assets/kick-gifted-50-badge.svg'
import { ReactComponent as KickGiftedBadge } from 'assets/kick-gifted-badge.svg'
import { ReactComponent as KickModBadge } from 'assets/kick-mod-badge.svg'
import { ReactComponent as KickOGBadge } from 'assets/kick-og-badge.svg'
import { ReactComponent as KickStaffBadge } from 'assets/kick-staff-badge.svg'
import { ReactComponent as KickVerifiedBadge } from 'assets/kick-verified-badge.svg'
import { ReactComponent as KickVIPBadge } from 'assets/kick-vip-badge.svg'
import { ReactComponent as ModChatIcon } from 'assets/mod-chat-icon.svg'
import { ReactComponent as VerifiedChatIcon } from 'assets/verified-chat-icon.svg'
import { NextUpContext } from 'components/Providers/NextUpProvider'
import { PollContext } from 'components/Providers/PollProvider'
import { WordRankContext } from 'components/Providers/WordRankProvider'
import useStreamer from 'hooks/useStreamer'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import { Virtuoso } from 'react-virtuoso'
import { ConfigContext } from '../Providers/ConfigProvider'
import { MazeContext } from 'components/Providers/MazeProvider'

const Item = styled.div`
  margin: 0;
  padding: 0;
  padding-top: 4px;
  padding-bottom: 6px;
`

const ItemContent = styled.div`
  font-size: ${({ isbig }) => (isbig ? '2.1em' : '1.12em')};
  color: ${({ isbig }) => (isbig ? '#efeff1' : '#000')};
  padding-left: ${({ paddingX }) => paddingX || '0'};
  padding-right: ${({ paddingX }) => paddingX || '0'};

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

const SenderText = styled(Text)`
  display: inline-flex;
  vertical-align: middle;
  word-break: break-word;
  color: ${({ isbig }) => (isbig ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  ${({ origin }) => origin === 'kick' && 'color: rgba(255, 255, 255, 0.7);'}
  ${({ origin }) => origin === 'youtube' && 'color: #E62117;'}
  ${({ ismember }) => ismember && 'color: #2ba640;'}
  ${({ ismod }) => ismod && 'color: #5e84f1;'}
  ${({ shadow }) => shadow && 'text-shadow: 0px 0px 4px #000;'}
  ${({ origin, ismember }) =>
    origin === 'kick' && ismember && 'color: #FF6C37;'}
  ${({ origin, ismod }) => origin === 'kick' && ismod && 'color: #5e84f1;'}
  ${({ isverified }) => isverified && 'color: #5BFE2E;'}
`

const MessageText = styled(Text)`
  display: inline;
  vertical-align: middle;
  word-break: break-word;
  color: white;
  ${({ shadow }) => shadow && 'text-shadow: 0px 0px 4px #000'}
  margin-bottom: auto;
  margin-top: auto;
`

const { REACT_APP_API_2_WS_URL } = process.env

const PX_BEFORE_AUTOSCROLL = 100

const ChatLog = ({
  twitchChannel,
  tiktokUsername,
  youtubeChannel,
  kickChannelId,
  kickChatroomId,
  kickChannelName,
  fullHeight,
  compact = false,
  fluid = false,
  showProfilePicture = true,
  height = '300px',
  isDark = undefined,
  isBig = undefined,
  autorefresh = -1,
  hideIceButton = false,
  paddingX,
  isFiltered = false,
  usernameFilter,
  ...props
}) => {
  const [searchParams] = useSearchParams()
  const [chatData, setChatData] = useState([])
  const [isChatBottom, setIsChatBottom] = useState(true)
  const virtuosoRef = useRef(null)
  const { colors } = useMantineTheme()
  const { chatConfig, userConfig } = useContext(ConfigContext)
  const { handlePollResponse } = useContext(PollContext) || {}
  const { handleIncomingWord: handleWordRankMessage } =
    useContext(WordRankContext) || {}
  const { handleMazeResponse } = useContext(MazeContext) || {}
  const streamer = useStreamer(userConfig?.streamazeKey)
  const [isConnected, setIsConnected] = useState(false)
  const { handleNextUpMessage } = useContext(NextUpContext) || {}
  const [pinnedMessageId, setPinnedMessageId] = useState()
  const [pinnedMessageTimeout, setPinnedMessageTimeout] = useState()
  const [pinDuration, setPinDuration] = useState(20)

  const _tiktokUsername = tiktokUsername || chatConfig?.tiktok?.username
  const _youtubeChannel = youtubeChannel || chatConfig?.youtube?.channel
  const _twitchChannel = twitchChannel || chatConfig?.twitch?.channel
  const _kickChannelId = kickChannelId || chatConfig?.kick?.channelId
  const _kickChatroomId = kickChatroomId || chatConfig?.kick?.chatroomId
  const _kickChannelName = kickChannelName || chatConfig?.kick?.channelName

  if (isBig === undefined) {
    isBig = searchParams.get('theme') === 'impact'
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
        reconnectAttempts: Infinity,
        shouldReconnect: () => true,
      },
      !!_tiktokUsername ||
        !!_youtubeChannel ||
        !!_twitchChannel ||
        !!_kickChannelName ||
        !!streamer
    )

  const autorefreshInterval = useInterval(() => {
    console.log('Reloading chat...')
    window.location.reload()
  }, autorefresh)

  useEffect(() => {
    if (isConnected) return

    const params = {}
    if (_tiktokUsername) {
      params['tiktokChat'] = _tiktokUsername
    }

    if (_youtubeChannel) {
      params['youtubeChat'] = _youtubeChannel
    }

    if (_twitchChannel) {
      params['twitchChannelName'] = _twitchChannel
    }

    if (_kickChannelId) {
      params['kickChannelId'] = _kickChannelId
    }

    if (_kickChatroomId) {
      params['kickChatroomId'] = _kickChatroomId
    }

    if (_kickChannelName) {
      params['kickChannelName'] = _kickChannelName
    }

    if (streamer) {
      params['streamerId'] = streamer?.id
    }

    if (userConfig?.streamazeKey) {
      params['streamazeKey'] = userConfig?.streamazeKey
    }

    if (_kickChannelId && _kickChatroomId && _kickChannelName && !streamer) {
      // TODO: Perform this check on the server-side instead
      return
    }

    chatSendMessage(params)
    setIsConnected(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _kickChannelId,
    _kickChatroomId,
    _kickChannelName,
    _twitchChannel,
    streamer,
    isConnected,
  ])

  // Useful for testing the Poll functionality
  // const [fakeInterval, setFakeInterval] = useState(null)
  // useEffect(() => {
  //   if (fakeInterval) {
  //     clearInterval(fakeInterval)
  //   } else {
  //     const interval = setInterval(() => {
  //       const payload = {
  //         origin: 'youtube',
  //         // random number between 1 and 5
  //         message: `${Math.floor(Math.random() * 5) + 1}`,
  //         sender: `Test User ${Math.floor(Math.random() * 100) + 1}`,
  //       }

  //       setChatData((prev) => [
  //         ...prev,
  //         {
  //           message: payload.message,
  //           sender: payload.sender,
  //           origin: payload.origin,
  //           emotes: [],
  //         },
  //       ])

  //       handlePollResponse?.({
  //         userId: payload.sender,
  //         content: payload.message,
  //       })
  //     }, 2000)

  //     setFakeInterval(interval)
  //   }

  //   return () => {
  //     if (fakeInterval) {
  //       clearInterval(fakeInterval)
  //     }
  //   }
  // }, [fakeInterval])

  useEffect(() => {
    if (pinnedMessageId) {
      const timer = setTimeout(() => {
        if (chatData?.length > 0) {
          setPinnedMessageId(undefined)
        }
      }, pinDuration)

      setPinnedMessageTimeout(timer)
    }

    return () => {
      clearTimeout(pinnedMessageTimeout)
    }
  }, [pinnedMessageId])

  useEffect(() => {
    if (lastChatJsonMessage !== null) {
      const payload = JSON.parse(lastChatJsonMessage.data)

      // Non-chat events
      if (payload?.type === 'kickPin') {
        const { data } = payload || {}
        const { messageId, duration } = data || {}

        if (duration > 0) {
          setPinDuration(duration * 1000)
        } else {
          setPinDuration(20_000)
        }

        setPinnedMessageId(messageId)

        return
      } else if (payload?.type === 'kickPinDeleted') {
        setPinnedMessageId(undefined)

        return
      }

      // Chat messages
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

        handlePollResponse?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleWordRankMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleNextUpMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleMazeResponse?.({
          userId: payload.sender,
          content: payload.message,
        })
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

        handlePollResponse?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleWordRankMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleNextUpMessage?.({
          userId: payload.sender,
          content: payload.message,
        })
      } else if (payload?.origin === 'twitch') {
        setChatData((prev) => [
          ...prev,
          {
            message: payload.message,
            sender: payload.sender,
            origin: payload.origin,
            isMember: payload.is_member,
            isMod: payload.is_mod,
          },
        ])

        handlePollResponse?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleWordRankMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleNextUpMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleMazeResponse?.({
          userId: payload.sender,
          content: payload.message,
        })
      } else if (payload?.origin === 'kick') {
        if (isFiltered && payload.sender !== usernameFilter) {
          return
        }

        setChatData((prev) => [
          ...prev,
          {
            id: payload.id,
            message: payload.message,
            sender: payload.sender,
            type: payload.type,
            origin: payload.origin,
            pfp: payload.pfp,
            isOwner: payload.is_owner,
            isMod: payload.is_mod || payload.is_owner,
            isVerified: payload.is_verified,
            isMember: payload.is_member,
            emotes: payload.emotes,
            badges: payload.badges,
            giftedCount: payload.gifted_count,
            metadata: payload?.metadata,
            chatroomId: payload?.chatroomId,
          },
        ])

        handlePollResponse?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleWordRankMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleNextUpMessage?.({
          userId: payload.sender,
          content: payload.message,
        })

        handleMazeResponse?.({
          userId: payload.sender,
          content: payload.message,
        })
      }
    }
  }, [
    lastChatJsonMessage,
    handlePollResponse,
    handleWordRankMessage,
    handleNextUpMessage,
    usernameFilter,
  ])

  useEffect(() => {
    if (autorefresh > 0) {
      autorefreshInterval.start()
    }
  }, [autorefresh, autorefreshInterval])

  useEffect(() => {
    return () => autorefreshInterval.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to end
  useEffect(() => {
    if (virtuosoRef.current && isChatBottom) {
      virtuosoRef.current.scrollToIndex({
        index: chatData.length - 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData.length])

  if (
    !_twitchChannel &&
    !_tiktokUsername &&
    !_youtubeChannel &&
    (!_kickChannelId || !_kickChatroomId || !_kickChannelName)
  ) {
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

  if (!isConnected) {
    if (fluid) {
      return
    }

    return (
      <Center mih={fullHeight ? '100%' : height} {...props}>
        <Loader />
      </Center>
    )
  }

  const isStreamerId1 = `${streamer?.id}` === '1'

  const ChatItem = ({ data, isPinned }) => {
    const {
      sender,
      type = 'message',
      message,
      emotes,
      pfp,
      origin,
      isOwner,
      isMod,
      isVerified,
      isMember,
      memberBadge,
      badges = [],
      giftedCount,
      metadata = {},
      chatroomId,
    } = data || {}

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
        paddingX={paddingX}
        style={
          isPinned && {
            paddingTop: '8px',
            paddingBottom: '8px',
            backgroundColor: '#24272C',
          }
        }
      >
        <Flex direction="column" {...props} gap="4px">
          {type === 'reply' && (
            <Flex
              direction="row"
              align="center"
              gap="4px"
              onClick={() => {
                virtuosoRef.current.scrollToIndex({
                  index: chatData.findIndex(
                    (c) => c.id === metadata?.original_message?.id
                  ),
                })
              }}
            >
              <ArrowReplyIcon
                style={{ width: 16, height: 16 }}
                color={colors.gray[6]}
              />
              <Text
                color="dimmed"
                size="md"
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                Replying to @{metadata?.original_sender?.username}:{' '}
                {metadata?.original_message?.content}
              </Text>
            </Flex>
          )}
          <Flex gap="16px" style={{ whiteSpace: 'nowrap' }}>
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
                {sender?.[0]?.toUpperCase() || '?'}
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
                isverified={
                  isVerified && sender !== 'BotRix' ? 'true' : undefined
                }
                shadow={fluid ? 'true' : undefined}
                origin={origin}
              >
                {chatroomId === 145222 && (
                  <img
                    src={IceBadge}
                    alt="Ice Badge"
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {badges.includes('og') && (
                  <KickOGBadge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {badges.includes('vip') && (
                  <KickVIPBadge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {badges.includes('founder') && (
                  <KickFoundersBadge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {badges.includes('staff') && (
                  <KickStaffBadge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {giftedCount > 0 && giftedCount < 25 && (
                  <KickGiftedBadge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {giftedCount >= 25 && giftedCount < 50 && (
                  <KickGifted25Badge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {giftedCount >= 50 && giftedCount < 100 && (
                  <KickGifted50Badge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {giftedCount >= 100 && giftedCount < 200 && (
                  <KickGifted100Badge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {giftedCount >= 200 && (
                  <KickGifted200Badge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {isOwner && (
                  <KickBroadcasterBadge
                    style={{
                      width: '16px',
                      height: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {origin === 'kick'
                  ? isMod &&
                    !isBig &&
                    !isOwner && (
                      <KickModBadge
                        style={{
                          width: '16px',
                          height: '16px',
                          verticalAlign: 'middle',
                          marginRight: '4px',
                        }}
                      />
                    )
                  : isMod &&
                    !isBig && (
                      <ModChatIcon
                        fill="#5e84f1"
                        style={{
                          width: '16px',
                          height: '16px',
                          verticalAlign: 'middle',
                          marginRight: '4px',
                        }}
                      />
                    )}
                {isMember && !isBig && memberBadge && (
                  <img
                    alt="Member Badge"
                    src={memberBadge}
                    style={{
                      height: '16px',
                      width: '16px',
                      verticalAlign: 'middle',
                      marginRight: '4px',
                    }}
                  />
                )}
                {origin === 'kick'
                  ? isVerified &&
                    !isBig && (
                      <KickVerifiedBadge
                        fill="#999"
                        style={{
                          width: '16px',
                          height: '16px',
                          verticalAlign: 'middle',
                          marginRight: '4px',
                        }}
                      />
                    )
                  : isVerified &&
                    !isBig && (
                      <VerifiedChatIcon
                        fill="#999"
                        style={{
                          width: '16px',
                          height: '16px',
                          verticalAlign: 'middle',
                          marginRight: '4px',
                        }}
                      />
                    )}
                {`${sender}${isBig ? ':' : ''}`}
                {`  `}
              </SenderText>
              <MessageText
                ff={isBig ? 'Impact' : 'Roboto'}
                lh={isBig ? '1.64em' : '1em'}
                shadow={fluid ? 'true' : undefined}
              >
                <span dangerouslySetInnerHTML={{ __html: newMessageString }} />
              </MessageText>
            </div>
          </Flex>
        </Flex>
      </ItemContent>
    )
  }

  const pinnedItem = chatData?.find((d) => d?.id === pinnedMessageId)

  return (
    <Box
      style={{
        background: isDark ? '#18181C' : 'transparent',
        height: fullHeight ? '100%' : height,
        width: props?.width || '100%',
      }}
    >
      {isStreamerId1 && !hideIceButton && (
        <Box px="md" py="sm">
          <Button
            onClick={() => {
              chatSendMessage({
                addChannelId: '145224',
                addChatroomId: '145222',
                kickChannelName: _kickChannelName,
              })
            }}
          >
            Merge Ice's chat
          </Button>
        </Box>
      )}
      {pinnedItem && <ChatItem data={pinnedItem} isPinned={true} />}
      <Virtuoso
        style={{
          minHeight: fullHeight ? '100%' : height,
          overflowX: 'hidden',
          overscrollBehavior: 'none',
          backgroundColor: colors.dark[9],
        }}
        ref={virtuosoRef}
        data={chatData}
        alignToBottom={true}
        onScroll={(e) => {
          const bottomOffset = e.target.scrollHeight - e.target.scrollTop

          if (
            !fluid &&
            bottomOffset < e.target.clientHeight + PX_BEFORE_AUTOSCROLL
          ) {
            setIsChatBottom(false)
          }
        }}
        endReached={() => {
          if (!fluid) {
            setIsChatBottom(true)
          }
        }}
        atBottomThreshold={PX_BEFORE_AUTOSCROLL}
        followOutput={'auto'}
        totalCount={chatData.length}
        components={{
          Item,
          List,
        }}
        itemContent={(_, chatEvent) => {
          return <ChatItem data={chatEvent} />
        }}
      />
    </Box>
  )
}

export default ChatLog

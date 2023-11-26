/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Button, Divider, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications, showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { FieldLabel, FormSection } from 'components/Settings'
import { useContext, useRef } from 'react'
import wretch from 'wretch'

const ChatModal = ({ isOpen, onClose }) => {
  const kickChannelNameRef = useRef(null)
  const kickChannelIdRef = useRef(null)
  const kickChatroomIdRef = useRef(null)

  const { chatConfig, setChatConfig } = useContext(ConfigContext)
  const { currentStreamer } = useContext(PhoenixContext)
  const chatForm = useForm({
    initialValues: {
      tiktok: chatConfig?.tiktok?.username,
      youtube: chatConfig?.youtube?.channel,
      twitch: chatConfig?.twitch?.channel,
      kickChannelName: chatConfig?.kick?.channelName,
      kickChannelId: chatConfig?.kick?.channelId,
      kickChatroomId: chatConfig?.kick?.chatroomId,
    },
  })

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      size="lg"
      withCloseButton={false}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()

          setChatConfig((prev) => ({
            ...prev,
            tiktok: {
              ...prev.tiktok,
              username: chatForm.values.tiktok,
            },
            youtube: {
              ...prev.youtube,
              channel: chatForm.values.youtube,
            },
            kick: {
              ...prev.kick,
              channelId: chatForm.values.kickChannelId,
              chatroomId: chatForm.values.kickChatroomId,
              channelName: chatForm.values.kickChannelName,
            },
            twitch: {
              ...prev.twitch,
              channel: chatForm.values.twitch,
            },
          }))

          wretch(
            `${process.env.REACT_APP_API_3_URL}/api/streamers/${currentStreamer.id}`
          )
            .patch({
              chat_config: {
                tiktok_username: chatForm.values.tiktok,
                youtube_channel: chatForm.values.youtube,
                kick_channel_id: chatForm.values.kickChannelId,
                kick_chatroom_id: chatForm.values.kickChatroomId,
                kick_channel_name: chatForm.values.kickChannelName,
                twitch_channel: chatForm.values.twitch,
              },
            })
            .res((res) => {
              if (res.ok) {
                showNotification({
                  title: 'Chat Settings saved!',
                  color: 'teal',
                })
              }
            })
            .catch(() => {
              showNotification({
                title: 'Error saving Chat Settings',
                color: 'red',
              })
            })
        }}
      >
        <FormSection
          title="Chat Settings"
          subtitle="Merge many livestream chats into one"
        >
          <TextInput
            label={<FieldLabel>TikTok Username</FieldLabel>}
            placeholder="john.smith"
            defaultValue={chatForm.values.tiktok}
            onChange={(e) => {
              chatForm.setFieldValue('tiktok', e.target.value)
            }}
          />
          <TextInput
            label={<FieldLabel>YouTube Channel URL</FieldLabel>}
            placeholder="https://youtube.com/c/john.smith"
            defaultValue={chatForm.values.youtube}
            onChange={(e) => {
              chatForm.setFieldValue('youtube', e.target.value)
            }}
          />
          <TextInput
            label={<FieldLabel>Twitch Channel Name</FieldLabel>}
            placeholder="johnsmith"
            defaultValue={chatForm.values.twitch}
            onChange={(e) => {
              chatForm.setFieldValue('twitch', e.target.value)
            }}
          />
          <Divider />
          <TextInput
            ref={kickChannelNameRef}
            label={<FieldLabel>Kick Channel Name</FieldLabel>}
            placeholder="johnsmith"
            defaultValue={chatForm.values.kickChannelName}
            onChange={(e) => {
              chatForm.setFieldValue('kickChannelName', e.target.value)
            }}
          />
          <Button
            w="min-content"
            variant="outline"
            mb="sm"
            onClick={() => {
              showNotification({
                loading: true,
                title: 'Fetching Kick IDs...',
                message: 'This may take a few seconds',
                color: 'blue',
                id: 'kick-id-loading',
              })

              wretch(
                `${process.env.REACT_APP_API_2_URL}/kick/ids/${kickChannelNameRef.current.value}`
              )
                .post()
                .json()
                .then((res) => {
                  const { ids } = res || {}
                  const { channel, chatrooms } = ids || {}

                  if (channel) {
                    kickChannelIdRef.current.value = channel
                    chatForm.setFieldValue('kickChannelId', channel)
                  }

                  if (chatrooms) {
                    kickChatroomIdRef.current.value = chatrooms
                    chatForm.setFieldValue('kickChatroomId', chatrooms)
                  }

                  notifications.hide('kick-id-loading')
                  showNotification({
                    title: 'Kick IDs fetched!',
                    color: 'teal',
                  })
                })
                .catch((err) => {
                  showNotification({
                    title: 'Error fetching Kick IDs',
                    message: err.message,
                    color: 'red',
                  })
                })
            }}
          >
            Fetch IDs from Channel Name
          </Button>
          <TextInput
            ref={kickChannelIdRef}
            label={<FieldLabel>Kick Channel ID</FieldLabel>}
            placeholder="123456"
            defaultValue={chatForm.values.kickChannelId}
            onChange={(e) => {
              chatForm.setFieldValue('kickChannelId', e.target.value)
            }}
          />
          <TextInput
            ref={kickChatroomIdRef}
            label={<FieldLabel>Kick Chatroom ID</FieldLabel>}
            placeholder="123459"
            defaultValue={chatForm.values.kickChatroomId}
            onChange={(e) => {
              chatForm.setFieldValue('kickChatroomId', e.target.value)
            }}
          />
        </FormSection>
      </form>
    </Modal>
  )
}

export default ChatModal

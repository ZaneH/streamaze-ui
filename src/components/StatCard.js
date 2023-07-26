import styled from '@emotion/styled'
import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
  Button,
  Center,
  Loader,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useInterval } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconAdjustmentsHorizontal } from '@tabler/icons'
import { useCallback, useContext, useEffect, useState } from 'react'
import { SocialIcon } from 'react-social-icons'
import { ReactComponent as KickIcon } from 'assets/kick-logo-icon.svg'
import wretch from 'wretch'
import { SidebarContext } from './SidebarProvider'

const { REACT_APP_API_URL } = process.env

const SocialStat = styled(Flex)`
  align-items: center;
  gap: 12px;
`

const StatCard = () => {
  const [ytViewers, setYtViewers] = useState()
  const [tiktokViewers, setTiktokViewers] = useState()
  const [kickViewers, setKickViewers] = useState()

  const [isEditing, setIsEditing] = useState(false)
  const { statsConfig, setStatsConfig } = useContext(SidebarContext)

  const [isYTLoading, setIsYTLoading] = useState(true)
  const [isTikTokLoading, setIsTikTokLoading] = useState(true)
  const [isKickLoading, setIsKickLoading] = useState(true)

  const form = useForm({
    initialValues: Object.assign({}, statsConfig),
  })

  const ytInterval = useInterval(() => {
    wretch(
      `${REACT_APP_API_URL}/youtube/viewers?channelUrl=${statsConfig?.youtubeChannel}`
    )
      .get()
      .json((res) => {
        if (res?.viewers) {
          setYtViewers(res.viewers)
        } else if (res?.error) {
          showNotification({
            color: 'red',
            title: 'YouTube Viewers Error',
            message: res.error,
          })
        }

        setIsYTLoading(false)
      })
  }, 60 * 1000) // 1 minute

  const tiktokInterval = useInterval(() => {
    wretch(
      `${REACT_APP_API_URL}/tiktok/viewers?username=${statsConfig?.tiktokUsername}`
    )
      .get()
      .json((res) => {
        if (res?.viewers) {
          setTiktokViewers(res.viewers)
        } else if (res?.error) {
          showNotification({
            color: 'red',
            title: 'TikTok Viewers Error',
            message: res.error,
          })
        }

        setIsTikTokLoading(false)
      })
  }, 60 * 1000) // 1 minute

  const kickInterval = useInterval(() => {
    wretch(
      `${REACT_APP_API_3_URL}/kick/viewers/${statsConfig?.kickChannelName}`
    )
      .get()
      .json((res) => {
        if (res?.viewers) {
          setKickViewers(res.viewers)
        } else if (res?.error) {
          showNotification({
            color: 'red',
            title: 'Kick Viewers Error',
            message: res.error,
          })
        }
      })
  }, 240 * 1000) // 4 minutes

  useEffect(() => {
    setIsYTLoading(true)
    setIsTikTokLoading(true)
    setIsKickLoading(true)

    // reset the viewers
    setYtViewers()
    setTiktokViewers()
    setKickViewers()

    // refresh the intervals (after config change)
    ytInterval.stop()
    tiktokInterval.stop()
    kickInterval.stop()

    if (statsConfig?.youtubeChannel) {
      ytInterval.start()
    } else {
      setIsYTLoading(false)
    }

    if (statsConfig?.tiktokUsername) {
      tiktokInterval.start()
    } else {
      setIsTikTokLoading(false)
    }

    if (statsConfig?.kickChannelName) {
      kickInterval.start()
    } else {
      setIsKickLoading(false)
    }

    // eslint-disable-next-line
  }, [statsConfig])

  useEffect(() => {
    // kick off intervals (first time)
    if (statsConfig?.youtubeChannel) {
      ytInterval.start()
    } else {
      ytInterval.stop()
      setIsYTLoading(false)
    }

    if (statsConfig?.tiktokUsername) {
      tiktokInterval.start()
    } else {
      tiktokInterval.stop()
      setIsTikTokLoading(false)
    }

    if (statsConfig?.kickChannelName) {
      kickInterval.start()
    } else {
      kickInterval.stop()
      setIsKickLoading(false)
    }

    return () => {
      ytInterval.stop()
      tiktokInterval.stop()
      kickInterval.stop()
    }

    // eslint-disable-next-line
  }, [])

  const socialStats = useCallback(() => {
    const data = [
      {
        network: 'youtube',
        count: ytViewers,
        name: statsConfig?.youtubeChannel,
      },
      {
        network: 'tiktok',
        count: tiktokViewers,
        name: statsConfig?.tiktokUsername,
      },
      {
        network: 'kick',
        count: kickViewers,
        name: statsConfig?.kickChannelName,
      },
    ].filter((o) => o?.count && o?.name)

    const elements = data.map((o, i) => {
      if (o?.network === 'kick') {
        return (
          <SocialStat key={i}>
            <KickIcon style={{ height: 36, width: 36 }} />
            <Flex direction="column">
              <Text weight={600} lh="1em">
                {o?.count}
              </Text>
              <Text size="sm" color="dimmed">
                {o?.name}
              </Text>
            </Flex>
          </SocialStat>
        )
      }

      return (
        <SocialStat key={i}>
          <SocialIcon
            network={o?.network}
            style={{
              height: 36,
              width: 36,
            }}
          />
          <Flex direction="column">
            <Text weight={600} lh="1em">
              {o?.count}
            </Text>
            <Text size="sm" color="dimmed">
              {o?.name}
            </Text>
          </Flex>
        </SocialStat>
      )
    })

    if (elements.length === 0) {
      return (
        <Text size="sm" color="dimmed">
          No social stats to show
        </Text>
      )
    } else {
      return elements
    }
  }, [statsConfig, ytViewers, tiktokViewers])

  return (
    <Card shadow="xs" p="lg" radius="md" h="min-content">
      <Group position="apart">
        <Text>Stream Viewers</Text>
        {!isEditing && (
          <ActionIcon
            onClick={() => {
              setIsEditing(true)
            }}
          >
            <IconAdjustmentsHorizontal size={18} />
          </ActionIcon>
        )}
      </Group>
      <Flex direction="column" gap="md" py="md" px="sm">
        {!isEditing ? (
          isYTLoading || isTikTokLoading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            socialStats()
          )
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStatsConfig(form.values)
              setIsEditing(false)
            }}
          >
            <Flex direction="column" gap="md">
              {/* <TextInput
                defaultValue={statsConfig.twitchUsername}
                label="Twitch Username"
                placeholder="sampepper"
                onChange={(e) => {
                  form.setFieldValue('twitchUsername', e.target.value)
                }}
              /> */}
              <TextInput
                defaultValue={statsConfig.tiktokUsername}
                label="TikTok Username"
                placeholder="sampepper"
                onChange={(e) => {
                  form.setFieldValue('tiktokUsername', e.target.value)
                }}
              />
              <TextInput
                defaultValue={statsConfig.youtubeChannel}
                label="YouTube Channel"
                placeholder="https://youtube.com/c/LofiGirl"
                onChange={(e) => {
                  form.setFieldValue('youtubeChannel', e.target.value)
                }}
              />
              <Button.Group>
                <Button
                  fullWidth
                  color="red"
                  variant="outline"
                  onClick={() => {
                    form.setValues(Object.assign({}, statsConfig))
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button fullWidth type="submit">
                  Save
                </Button>
              </Button.Group>
            </Flex>
          </form>
        )}
      </Flex>
    </Card>
  )
}

export default StatCard

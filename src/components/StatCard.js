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
import { showNotification } from '@mantine/notifications'
import { IconAdjustmentsHorizontal } from '@tabler/icons'
import { useCallback, useContext, useEffect, useState } from 'react'
import { SocialIcon } from 'react-social-icons'
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
  const [isEditing, setIsEditing] = useState(false)
  const { statsConfig, setStatsConfig } = useContext(SidebarContext)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm({
    initialValues: Object.assign({}, statsConfig),
  })

  useEffect(() => {
    const ytInterval = setInterval(async () => {
      if (!statsConfig?.youtubeChannel) {
        setIsLoading(false)
        return
      }

      const res = await wretch(
        `${REACT_APP_API_URL}/youtube/viewers?channelUrl=${statsConfig?.youtubeChannel}`
      )
        .get()
        .json()

      if (res?.viewers) {
        setYtViewers(res.viewers)
      } else if (res?.error) {
        clearInterval(ytInterval)
        setYtViewers()
        showNotification({
          color: 'red',
          title: 'YouTube Viewers Error',
          message: res.error,
        })
      }

      setIsLoading(false)
    }, 12 * 1000)

    const tiktokInterval = setInterval(async () => {
      if (!statsConfig?.tiktokUsername) {
        setIsLoading(false)
        return
      }

      const res = await wretch(
        `${REACT_APP_API_URL}/tiktok/viewers?username=${statsConfig?.tiktokUsername}`
      )
        .get()
        .json()

      if (res?.viewers) {
        setTiktokViewers(res.viewers)
      } else if (res?.error) {
        clearInterval(tiktokInterval)
        setTiktokViewers()
        showNotification({
          color: 'red',
          title: 'TikTok Viewers Error',
          message: res.error,
        })
      }

      setIsLoading(false)
    }, 12 * 1000)

    return () => {
      clearInterval(ytInterval)
      clearInterval(tiktokInterval)
    }
  }, [statsConfig])

  useEffect(() => {
    setIsLoading(true)
  }, [statsConfig])

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
    ].filter((o) => o?.count)

    const elements = data.map((o, i) => (
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
    ))

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
        <ActionIcon
          onClick={() => {
            setIsEditing(true)
          }}
        >
          <IconAdjustmentsHorizontal size={18} />
        </ActionIcon>
      </Group>
      <Flex direction="column" gap="md" py="md" px="sm">
        {!isEditing ? (
          isLoading ? (
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

import { showNotification } from '@mantine/notifications'
import { createContext, useContext, useState, useEffect } from 'react'
import { ConfigContext } from './ConfigProvider'
import wretch from 'wretch'
import { useInterval } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'

export const StatContext = createContext()

const { REACT_APP_API_URL } = process.env

const StatProvider = ({ children }) => {
  const { statsConfig } = useContext(ConfigContext)
  const [ytViewers, setYtViewers] = useState()
  const [tiktokViewers, setTiktokViewers] = useState()
  const [kickViewers, setKickViewers] = useState()
  const [isYTLoading, setIsYTLoading] = useState(true)
  const [isTikTokLoading, setIsTikTokLoading] = useState(true)
  const [isKickLoading, setIsKickLoading] = useState(true)
  const [netProfit, setNetProfit] = useState(0)
  const [streamStartTime, setStreamStartTime] = useState()
  const { pathname } = useLocation()

  const ytInterval = useInterval(() => {
    if (pathname !== '/home') {
      return
    }

    wretch(
      `${REACT_APP_API_URL}/youtube/viewers?channelUrl=${statsConfig?.youtubeChannel}`
    )
      .get()
      .json((res) => {
        if (res?.viewers) {
          setYtViewers(res.viewers)
        } else if (res?.error) {
          throw new Error(res.error)
        }

        setIsYTLoading(false)
      })
      .catch((err) => {
        setIsYTLoading(false)
        ytInterval.stop()

        showNotification({
          color: 'red',
          title: 'YouTube Viewers Error',
          message: err?.message,
        })
      })
  }, 60 * 1000) // 1 minute

  const tiktokInterval = useInterval(() => {
    if (pathname !== '/home') {
      return
    }

    wretch(
      `${REACT_APP_API_URL}/tiktok/viewers?username=${statsConfig?.tiktokUsername}`
    )
      .get()
      .json((res) => {
        if (parseInt(res?.viewers) === 0) {
          throw new Error(
            'Stopping live updates while viewers are at 0. Sorry!'
          )
        }

        if (res?.viewers && res?.viewers > 1) {
          setTiktokViewers(res.viewers)
        } else if (res?.error) {
          throw new Error(res.error)
        }

        setIsTikTokLoading(false)
      })
      .catch((err) => {
        setIsTikTokLoading(false)
        tiktokInterval.stop()

        showNotification({
          color: 'red',
          title: 'TikTok Viewers Error',
          message: err?.message,
        })
      })
  }, 60 * 1000) // 1 minute

  const kickInterval = useInterval(() => {
    if (pathname !== '/home') {
      return
    }

    wretch(
      `${REACT_APP_API_URL}/kick/viewers?channelName=${statsConfig?.kickChannelName}`
    )
      .get()
      .json((res) => {
        if (parseInt(res?.viewers) === 0) {
          throw new Error(
            'Stopping live updates while viewers are at 0. Sorry!'
          )
        }

        if (res?.viewers) {
          setKickViewers(res.viewers)
        } else if (res?.error) {
          throw new Error(res.error)
        }

        setIsKickLoading(false)
      })
      .catch((err) => {
        setIsKickLoading(false)
        kickInterval.stop()

        showNotification({
          color: 'red',
          title: 'Kick Viewers Error',
          message: err?.message,
        })
      })
  }, 240 * 1000) // 4 minutes

  useEffect(() => {
    setIsYTLoading(true)
    setIsTikTokLoading(true)
    setIsKickLoading(true)

    // reset the viewers
    setYtViewers()
    setTiktokViewers()
    setIsKickLoading()

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

  return (
    <StatContext.Provider
      value={{
        ytViewers,
        tiktokViewers,
        kickViewers,
        isYTLoading,
        isTikTokLoading,
        isKickLoading,
        netProfit,
        setNetProfit,
        streamStartTime,
        setStreamStartTime,
      }}
    >
      {children}
    </StatContext.Provider>
  )
}

export default StatProvider

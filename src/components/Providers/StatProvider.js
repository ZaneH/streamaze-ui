import { showNotification } from '@mantine/notifications'
import { createContext, useContext, useState, useEffect } from 'react'
import { ConfigContext } from './ConfigProvider'
import wretch from 'wretch'
import { useInterval } from '@mantine/hooks'

export const StatContext = createContext()

const { REACT_APP_API_URL } = process.env

const StatProvider = ({ children }) => {
  const { statsConfig } = useContext(ConfigContext)
  const [ytViewers, setYtViewers] = useState()
  const [tiktokViewers, setTiktokViewers] = useState()
  const [isYTLoading, setIsYTLoading] = useState(true)
  const [isTikTokLoading, setIsTikTokLoading] = useState(true)

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
  }, 12 * 1000)

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
  }, 12 * 1000)

  useEffect(() => {
    setIsYTLoading(true)
    setIsTikTokLoading(true)

    // reset the viewers
    setYtViewers()
    setTiktokViewers()

    // refresh the intervals (after config change)
    ytInterval.stop()
    tiktokInterval.stop()

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

    return () => {
      ytInterval.stop()
      tiktokInterval.stop()
    }

    // eslint-disable-next-line
  }, [])

  return (
    <StatContext.Provider
      value={{
        ytViewers,
        tiktokViewers,
        isYTLoading,
        isTikTokLoading,
      }}
    >
      {children}
    </StatContext.Provider>
  )
}

export default StatProvider

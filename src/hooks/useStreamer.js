import wretch from 'wretch'
import { useEffect, useState } from 'react'
import { showNotification } from '@mantine/notifications'

const useStreamer = (apiKey) => {
  const [streamer, setStreamer] = useState(null)
  useEffect(() => {
    const fetchStreamer = async () => {
      const data = await wretch(
        `${process.env.REACT_APP_API_3_URL}/api/streamers?api_key=${apiKey}`
      )
        .get()
        .json()
        .catch((err) => {
          console.error(err)
          showNotification({
            title: 'Error',
            message: 'Error fetching streamer data. Check your Streamaze key.',
            color: 'red',
          })
        })

      setStreamer(data)
    }

    if (apiKey) {
      fetchStreamer()
    }
  }, [apiKey, setStreamer])

  return streamer
}

export default useStreamer

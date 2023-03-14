import wretch from 'wretch'
import { useEffect, useState } from 'react'

const useStreamer = (apiKey) => {
  const [streamer, setStreamer] = useState(null)
  useEffect(() => {
    const fetchStreamer = async () => {
      const data = await wretch(
        `${process.env.REACT_APP_API_3_URL}/api/streamers?api_key=${apiKey}`
      )
        .get()
        .json()

      setStreamer(data)
    }

    if (apiKey) {
      fetchStreamer()
    }
  }, [apiKey, setStreamer])

  return streamer
}

export default useStreamer

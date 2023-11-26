/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import wretch from 'wretch'
import { useEffect, useState } from 'react'
import { showNotification } from '@mantine/notifications'

const useElevenLabs = (apiKey) => {
  const [allVoices, setAllVoices] = useState(null)

  useEffect(() => {
    const fetchVoices = async () => {
      const data = await wretch(
        `${process.env.REACT_APP_API_3_URL}/api/tts?api_key=${apiKey}`
      )
        .get()
        .json()
        .catch((err) => {
          console.error(err)
          showNotification({
            title: 'Error',
            message: 'Error fetching voice data. Check your ElevenLabs key.',
            color: 'red',
          })
        })

      setAllVoices(data?.data)
    }

    if (apiKey) {
      fetchVoices()
    }
  }, [apiKey, setAllVoices])

  return { allVoices }
}

export default useElevenLabs

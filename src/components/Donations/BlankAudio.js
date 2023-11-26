/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { useInterval } from '@mantine/hooks'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { DonationContext } from 'components/Providers/DonationProvider'
import { useContext, useEffect } from 'react'

const BlankAudio = () => {
  const { slobsConfig } = useContext(ConfigContext)
  const { silentAudioInterval } = slobsConfig
  const { blankAudio } = useContext(DonationContext)

  const blankInterval = useInterval(() => {
    if (!parseFloat(silentAudioInterval) > 0) return

    blankAudio.src =
      'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

    blankAudio
      .play()
      .then(() => {
        console.log('Playing blank audio')
      })
      .catch((err) => {
        console.log(err)
      })
  }, parseFloat(silentAudioInterval) * 1000 * 60)

  useEffect(() => {
    blankInterval.stop()
    blankInterval.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [silentAudioInterval])

  useEffect(() => {
    return () => {
      blankInterval.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default BlankAudio

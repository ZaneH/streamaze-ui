import { useInterval } from '@mantine/hooks'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { useContext, useEffect } from 'react'
import Silence250ms from 'assets/250ms-silence.mp3'

const BlankAudio = () => {
  const { slobsConfig } = useContext(ConfigContext)
  const { silentAudioInterval } = slobsConfig

  const blankInterval = useInterval(() => {
    if (!parseFloat(silentAudioInterval) > 0) return

    const audio = new Audio(Silence250ms)
    audio.play()
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

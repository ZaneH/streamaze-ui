import { Button, Modal, Space, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import { FieldLabel } from 'components/Settings'
import moment from 'moment'
import { useContext, useRef } from 'react'
import wretch from 'wretch'

const { REACT_APP_API_3_URL } = process.env

const SubathonModal = ({ isOpen = false, onClose }) => {
  const { currentStreamer } = useContext(PhoenixContext)
  const { secondsInterval } = useContext(SubathonContext)
  const initialTime = useRef(null)
  const minutesPerDollar = useRef(null)

  return (
    <Modal
      title="Start Your Subathon"
      opened={isOpen}
      centered
      onClose={onClose}
    >
      <TextInput
        label={<FieldLabel>Initial Clock Time (in minutes)</FieldLabel>}
        placeholder="30"
        defaultValue={'30'}
        ref={initialTime}
      />
      <Space h="sm" />
      <TextInput
        label={<FieldLabel>Minutes Per Dollar</FieldLabel>}
        placeholder="1"
        defaultValue={'1'}
        ref={minutesPerDollar}
      />
      <Space h="sm" />
      <Button
        color="green"
        mt="md"
        fullWidth
        onClick={() => {
          wretch(
            `${REACT_APP_API_3_URL}/api/live_streams/${currentStreamer.id}`
          )
            .patch({
              subathon_start_time: moment().utc(false).format(),
              subathon_ended_time: null,
              subathon_start_minutes: initialTime.current.value,
              subathon_minutes_per_dollar: minutesPerDollar.current.value,
              subathon_seconds_added: 0,
            })
            .res(() => {
              showNotification({
                title: 'Subathon Started',
                message: 'Your subathon has been started!',
                color: 'green',
              })

              secondsInterval.start()

              onClose()
            })
            .catch((e) => {
              showNotification({
                title: 'Error',
                message: 'There was an error starting your subathon.',
                color: 'red',
              })
            })
        }}
      >
        Start Subathon
      </Button>
    </Modal>
  )
}

export default SubathonModal

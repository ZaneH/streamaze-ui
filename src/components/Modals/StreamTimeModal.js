import { Button, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { StatContext } from 'components/Providers/StatProvider'
import { SubathonContext } from 'components/Providers/SubathonProvider'
import moment from 'moment'
import { useContext } from 'react'
import wretch from 'wretch'

const StreamTimeModal = ({ isOpen = false, onClose }) => {
  const { activeStreamId } = useContext(SubathonContext)
  const { setStreamStartTime } = useContext(StatContext)

  return (
    <Modal opened={isOpen} onClose={onClose} title="Stream Time" centered>
      <Button
        fullWidth
        color="red"
        variant="outline"
        onClick={() => {
          wretch(
            `${process.env.REACT_APP_API_3_URL}/api/live_streams/${activeStreamId}`
          )
            .patch({
              // 2023-03-14T22:59:43Z format
              start_time: moment().utc(false).format(),
            })
            .json((res) => {
              if (res?.success) {
                setStreamStartTime(moment(res?.data?.start_time))
                showNotification({
                  color: 'green',
                  title: 'Stream Time Reset',
                  message: 'Stream time has been reset',
                })
              } else if (res?.success === false) {
                showNotification({
                  color: 'red',
                  title: 'Stream Time Reset Error',
                  message: "Couldn't reset stream time",
                })
              }
            })
        }}
      >
        Reset Stream Time
      </Button>
    </Modal>
  )
}

export default StreamTimeModal

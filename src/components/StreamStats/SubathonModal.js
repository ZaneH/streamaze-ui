import { Button, Modal, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ConfigContext } from 'components/Providers/ConfigProvider'
import { FieldLabel } from 'components/Settings'
import { useContext, useRef } from 'react'
import wretch from 'wretch'

const { REACT_APP_API_2_URL } = process.env

const SubathonModal = ({ isOpen = false, onClose }) => {
  const { lanyardConfig, subathonConfig } = useContext(ConfigContext)
  const { discordUserId, apiKey } = lanyardConfig
  const { timeUnitBase } = subathonConfig
  const initialTime = useRef(null)

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
      <Button
        color="green"
        mt="md"
        fullWidth
        onClick={() => {
          if (!discordUserId || !apiKey) {
            showNotification({
              title: 'Subathon',
              message:
                'Set your Discord user ID and API key in the settings page',
              color: 'red',
            })
            return
          }

          wretch(`${REACT_APP_API_2_URL}/kv/set`)
            .post({
              discordUserId,
              key: 'stream_start_time',
              value: (
                Date.now() / 1000 +
                initialTime.current.value * 60
              ).toFixed(0),
              apiKey,
            })
            .res((_r) => {
              wretch(`${REACT_APP_API_2_URL}/kv/set`)
                .post({
                  discordUserId,
                  key: 'time_unit_base',
                  value: timeUnitBase,
                  apiKey,
                })
                .res((_r) => {
                  wretch(`${REACT_APP_API_2_URL}/kv/set`)
                    .post({
                      discordUserId,
                      key: 'donation_amount',
                      value: '0',
                      apiKey,
                    })
                    .res((_r) => {
                      showNotification({
                        title: 'Subathon',
                        message: 'Subathon has started',
                        color: 'teal',
                      })

                      onClose()
                    })
                    .catch((e) => {
                      console.error(e)
                      showNotification({
                        title: 'Subathon',
                        message: 'Something went wrong',
                        color: 'red',
                      })
                    })
                })
                .catch((e) => {
                  console.error(e)
                  showNotification({
                    title: 'Subathon',
                    message: 'Something went wrong',
                    color: 'red',
                  })
                })
            })
            .catch((e) => {
              console.error(e)
              showNotification({
                title: 'Subathon',
                message: 'Something went wrong',
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

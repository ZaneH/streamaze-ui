import { createContext, useContext, useEffect, useState } from 'react'
import { Socket } from 'phoenix'
import { DonationContext } from './DonationProvider'
import { SubathonContext } from './SubathonProvider'
import moment from 'moment'

const PhoenixContext = createContext()

const PhoenixProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { setDonations } = useContext(DonationContext)
  const { setTimeRemaining } = useContext(SubathonContext)

  useEffect(() => {
    setSocket(
      new Socket('ws://localhost:4000/socket', {
        heartbeatIntervalMs: 30000,
      })
    )

    return () => {
      if (socket) {
        socket.off()
        socket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.connect()

      const streamerChannel = socket.channel('streamer:1', {
        userToken: 'abcdefg',
      })

      streamerChannel.on('expense', (payload) => {
        console.log('new expense', payload)
      })

      streamerChannel.on('subathon', (payload) => {
        const {
          subathon_seconds_added,
          subathon_start_time,
          subathon_start_minutes,
        } = payload || {}
        setTimeRemaining(() => {
          const startTimeUnix =
            moment(subathon_start_time).unix() + subathon_start_minutes * 60
          const currentTimeUnix = moment().utc(true).unix()

          const seconds =
            startTimeUnix - currentTimeUnix + subathon_seconds_added

          return seconds
        })
      })

      streamerChannel.on('donation', (payload) => {
        setDonations((prev) => [
          ...prev,
          {
            type: payload.type,
            data: {
              id: payload.id,
              name: payload.sender,
              message: payload.message,
              displayString: payload.displayString,
              amount: payload.value.amount,
              currency: payload.value.currency,
            },
          },
        ])
      })

      streamerChannel.join()
    }
  }, [socket])

  return (
    <PhoenixContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </PhoenixContext.Provider>
  )
}

export default PhoenixProvider

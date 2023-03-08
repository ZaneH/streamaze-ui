import { createContext, useContext, useEffect, useState } from 'react'
import { Socket } from 'phoenix'
import { DonationContext } from './DonationProvider'
import { SubathonContext } from './SubathonProvider'
import { calculateTimeRemaining } from 'utils/time'
import { StatContext } from './StatProvider'

export const PhoenixContext = createContext()

const PhoenixProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [streamerChannel, setStreamerChannel] = useState(null)
  const { setDonations, setDonationIndex } = useContext(DonationContext)
  const { setTimeRemaining, setSubathonStreamId, setIsSubathonActive } =
    useContext(SubathonContext)
  const { setNetProfit } = useContext(StatContext)

  useEffect(() => {
    const streamerSocket = new Socket('ws://localhost:4000/socket', {
      heartbeatIntervalMs: 30000,
    })

    setSocket(streamerSocket)

    return () => {
      if (socket) {
        socket.disconnect()
        streamerChannel.leave()
        setSocket(null)
        setStreamerChannel(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (streamerChannel) {
      streamerChannel.off('expense')
      streamerChannel.off('subathon')
      streamerChannel.off('donation')
      streamerChannel.off('initial_state')
    }

    if (socket && !socket.isConnected()) {
      socket.connect()

      const ch = socket.channel('streamer:1', {
        userToken: 'api-asdfasdf',
      })

      ch.join().receive('ok', (_resp) => {
        setStreamerChannel(ch)
      })

      ch.on('expense', (payload) => {
        const { net_profit } = payload || {}
        setNetProfit(net_profit)
      })

      ch.on('subathon', (payload) => {
        const {
          subathon_seconds_added,
          subathon_start_time,
          subathon_start_minutes,
        } = payload || {}
        setTimeRemaining(() => {
          return calculateTimeRemaining(
            subathon_seconds_added,
            subathon_start_time,
            subathon_start_minutes
          )
        })
      })

      ch.on('donation', (payload) => {
        const { donation, net_profit } = payload || {}
        setNetProfit(net_profit)
        setDonations((prev) => [
          ...prev,
          {
            type: donation.type,
            data: {
              id: donation.id,
              name: donation.sender,
              message: donation.message,
              displayString: donation.displayString,
              amount: donation.value.amount,
              currency: donation.value.currency,
            },
          },
        ])
      })

      ch.on('initial_state', (payload) => {
        const {
          active_stream: currentStream,
          net_profit: streamerNetProfit,
          last_10_donations: last10Donations,
        } = payload || {}
        const seconds = calculateTimeRemaining(
          currentStream.subathon_seconds_added,
          currentStream.subathon_start_time,
          currentStream.subathon_start_minutes
        )

        setSubathonStreamId(currentStream.id)

        if (currentStream.subathon_ended_time === null) {
          setIsSubathonActive(true)
          setTimeRemaining(seconds)
        }

        setNetProfit(streamerNetProfit)
        setDonationIndex(last10Donations.length)
        setSubathonStreamId(currentStream.id)
        setDonations(
          last10Donations.map((donation) => {
            return {
              type: donation.type,
              data: {
                id: donation.id,
                name: donation.sender,
                message: donation.message,
                displayString: donation.displayString,
                amount: donation.value.amount,
                currency: donation.value.currency,
              },
            }
          })
        )
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  return (
    <PhoenixContext.Provider
      value={{
        socket,
        streamerChannel,
      }}
    >
      {children}
    </PhoenixContext.Provider>
  )
}

export default PhoenixProvider

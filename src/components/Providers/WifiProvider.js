import { createContext, useContext, useState } from 'react'
import moment from 'moment'
import { HopContext } from './HopProvider'
export const WifiContext = createContext()

const WifiProvider = ({ children }) => {
  const { bondState } = useContext(HopContext)

  const wifiNetworks = bondState?.wifi_networks
  const lastScannedAt = wifiNetworks?.last_scanned // ex: 2023-09-11T04:41:53.595Z
  const networks = wifiNetworks?.networks || []
  const [connectingNetwork, setConnectingNetwork] = useState(null)

  const needsToScan = moment(lastScannedAt).add(5, 'minute').isBefore(moment())

  return (
    <WifiContext.Provider
      value={{
        needsToScan,
        wifiNetworks,
        lastScannedAt,
        networks,
        connectingNetwork,
        setConnectingNetwork,
      }}
    >
      {children}
    </WifiContext.Provider>
  )
}

export default WifiProvider

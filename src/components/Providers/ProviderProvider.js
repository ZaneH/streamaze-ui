import DonationProvider from './DonationProvider'
import HopProvider from './HopProvider'
import PhoenixProvider from './PhoenixProvider'
import StatProvider from './StatProvider'
import SubathonProvider from './SubathonProvider'

const ProviderProvider = ({ children }) => {
  return (
    <DonationProvider>
      <HopProvider>
        <SubathonProvider>
          <StatProvider>
            <PhoenixProvider>{children}</PhoenixProvider>
          </StatProvider>
        </SubathonProvider>
      </HopProvider>
    </DonationProvider>
  )
}

export default ProviderProvider

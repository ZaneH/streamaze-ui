import DonationProvider from './DonationProvider'
import HopProvider from './HopProvider'
import LanyardProvider from './LanyardProvider'
import PhoenixProvider from './PhoenixProvider'
import StatProvider from './StatProvider'
import SubathonProvider from './SubathonProvider'

const ProviderProvider = ({ children }) => {
  return (
    <LanyardProvider>
      <DonationProvider>
        <HopProvider>
          <SubathonProvider>
            <StatProvider>
              <PhoenixProvider>{children}</PhoenixProvider>
            </StatProvider>
          </SubathonProvider>
        </HopProvider>
      </DonationProvider>
    </LanyardProvider>
  )
}

export default ProviderProvider

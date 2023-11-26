/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import DonationProvider from './DonationProvider'
import HopProvider from './HopProvider'
import LanyardProvider from './LanyardProvider'
import PhoenixProvider from './PhoenixProvider'
import StatProvider from './StatProvider'
import SubathonProvider from './SubathonProvider'

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

const ProviderProvider = ({ children, hasHop = true }) => {
  return (
    <LanyardProvider>
      <DonationProvider>
        <ConditionalWrapper
          condition={hasHop}
          wrapper={(child) => <HopProvider>{child}</HopProvider>}
        >
          <SubathonProvider>
            <StatProvider>
              <PhoenixProvider>{children}</PhoenixProvider>
            </StatProvider>
          </SubathonProvider>
        </ConditionalWrapper>
      </DonationProvider>
    </LanyardProvider>
  )
}

export default ProviderProvider

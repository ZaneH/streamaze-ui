import { createContext, useState } from 'react'

export const StatContext = createContext()

const StatProvider = ({ children }) => {
  const [ytViewers, setYtViewers] = useState()
  const [tiktokViewers, setTiktokViewers] = useState()
  const [kickViewers, setKickViewers] = useState()
  const [netProfit, setNetProfit] = useState(0)
  const [streamStartTime, setStreamStartTime] = useState()
  const [allSubs, setAllSubs] = useState(0)
  const [kickSubs, setKickSubs] = useState(0)
  const [youtubeSubs, setYoutubeSubs] = useState(0)
  const [statsOffset, setStatsOffset] = useState(null)

  return (
    <StatContext.Provider
      value={{
        ytViewers,
        tiktokViewers,
        kickViewers,
        setKickViewers,
        netProfit,
        setNetProfit,
        streamStartTime,
        setStreamStartTime,
        allSubs,
        setAllSubs,
        kickSubs,
        setKickSubs,
        youtubeSubs,
        setYoutubeSubs,
        statsOffset,
        setStatsOffset,
      }}
    >
      {children}
    </StatContext.Provider>
  )
}

export default StatProvider

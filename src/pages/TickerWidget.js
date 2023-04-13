import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import { useParams } from 'react-router-dom'
import { useLanyardWS } from 'use-lanyard'

const TickerContainer = styled.div`
  height: 100px;
  width: 100%;
  color: white;
  font-size: 3em;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
`

const TickerWidget = () => {
  const { id } = useParams()
  const data = useLanyardWS(id)
  const kv = data?.kv

  const [tickerData, setTickerData] = useState(null)

  useEffect(() => {
    try {
      if (!kv?.ticker) {
        return
      }

      setTickerData(kv?.ticker)
    } catch (error) {
      console.error(error)
    }
  }, [kv, setTickerData])

  if (!tickerData) {
    return null
  }

  return (
    <TickerContainer>
      <Marquee gradient={false} speed={80}>
        {tickerData}
      </Marquee>
    </TickerContainer>
  )
}

export default TickerWidget

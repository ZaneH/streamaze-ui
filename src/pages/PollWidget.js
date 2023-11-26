/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { ProviderProvider } from 'components/Providers'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanyardWS } from 'use-lanyard'

const PollLabel = styled.div`
  font-size: 2rem;
  font-family: 'Inter';
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-shadow: 0 0 10px #000;
  white-space: pre-wrap;
`

const ProvidersWrapper = () => {
  return (
    <ProviderProvider>
      <PollWidget />
    </ProviderProvider>
  )
}

const formatPollAsText = (poll) => {
  // Input: { <choice>: <count>, <choice2>: <count2> }
  // Output: "<choice> = <count> votes\n<choice2> = <count2> votes"
  const pollText = Object.entries(poll)
    .map(
      ([choice, count]) => `${choice}: ${count} vote${count === 1 ? '' : 's'}`
    )
    .join('\n')
  return pollText
}

const PollWidget = () => {
  const { id } = useParams()
  const data = useLanyardWS(id)
  const kv = data?.kv

  const [pollData, setPollData] = useState(null)

  useEffect(() => {
    try {
      if (!kv?.poll) {
        return
      }

      const poll = JSON.parse(kv?.poll)
      setPollData(poll)
    } catch (error) {
      console.error(error)
    }
  }, [kv, setPollData])

  if (!pollData) {
    return null
  }

  return <PollLabel>{formatPollAsText(pollData)}</PollLabel>
}

export default ProvidersWrapper

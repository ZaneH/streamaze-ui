/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Flex } from '@mantine/core'
import { DonationContext } from 'components/Providers/DonationProvider'
import { useContext, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'

const AnimatedDiv = styled.div`
  opacity: 1;
  border-radius: 3px;
  border: 5px solid #dee2e6;
  padding: 18px 24px;
  color: white;

  ${({ isAnimated }) =>
    isAnimated &&
    css`
      animation-name: fadeIn;
      animation-duration: 0.5s;
      animation-timing-function: ease-in;
      animation-iteration-count: 1;

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}
`

export default function MediaCard({
  children,
  url,
  donationId,
  duration,
  isAnimated,
  startTime,
}) {
  const { playingMediaId, setIsPlaying, setPlayingMediaId } =
    useContext(DonationContext)

  const videoRef = useRef(null)

  return (
    <AnimatedDiv
      isAnimated={isAnimated}
      onClick={() => {
        setIsPlaying(true)
        setPlayingMediaId(donationId)

        videoRef.current.seekTo(startTime, 'seconds')
      }}
    >
      <Flex direction="column" justify="space-between" gap="lg">
        <Box>{children}</Box>
        <Box style={{ display: 'none' }}>
          {donationId === playingMediaId && (
            <ReactPlayer
              ref={videoRef}
              url={url}
              width="100%"
              height="180px"
              controls
              playing={donationId === playingMediaId}
              playsinline
              onProgress={({ playedSeconds }) => {
                if (playedSeconds >= startTime + duration / 1000) {
                  setIsPlaying(false)
                  setPlayingMediaId(null)
                }
              }}
            />
          )}
        </Box>
      </Flex>
    </AnimatedDiv>
  )
}

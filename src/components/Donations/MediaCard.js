import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, Flex } from '@mantine/core'
import { DonationContext } from 'components/Providers/DonationProvider'
import { useContext } from 'react'
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
}) {
  const { playingMediaId, setIsPlaying, setPlayingMediaId } =
    useContext(DonationContext)

  return (
    <AnimatedDiv isAnimated={isAnimated}>
      <Flex direction="column" justify="space-between" gap="lg">
        <Box>{children}</Box>
        <Box style={{ display: 'none' }}>
          {donationId === playingMediaId && (
            <ReactPlayer
              url={url}
              width="100%"
              height="180px"
              controls
              playing={donationId === playingMediaId}
              onProgress={({ playedSeconds }) => {
                console.log(playedSeconds, duration)
                if (playedSeconds * 1000 >= duration) {
                  setPlayingMediaId(null)
                  setIsPlaying(false)
                }
              }}
            />
          )}
        </Box>
      </Flex>
    </AnimatedDiv>
  )
}

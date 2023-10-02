import { Box, Button, Input, createStyles, keyframes } from '@mantine/core'
import useMaze from 'hooks/useMaze'
import { useEffect, useState } from 'react'

const revealAnimation = ({ width, height }) => keyframes`
  from {
    transform: scale(1,1) translate(${(width - 1) * 100}%, ${
  (height - 1) * 100
}%);
    transform-origin: ${width * 100}% ${height * 100}%;
  }
  50% {
    transform: scale(${width},${height}) translate(${(width - 1) * 100}%, ${
  (height - 1) * 100
}%);
    transform-origin: ${width * 100}% ${height * 100}%;
  }
  50.001% {
    transform: scale(${width},${height}) translate(0,0);
    transform-origin: 0 0;
  }
  to {
    transform: scale(1,1) translate(0,0);
    transform-origin: 0 0;
  }
`

function Revealer({ size }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: `calc(100% / ${size.width})`,
        height: `calc(100% / ${size.height})`,
        background: 'hsla(var(--hsl-primary), 1)',

        animation: `${revealAnimation(size)} 1000ms alternate forwards`,
      }}
    />
  )
}

const useStyles = createStyles(
  (
    theme,
    {
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = {},
    getRef
  ) => ({
    mazeCell: {
      position: 'relative',

      '&::before': {
        content: '""',
        display: 'block',
        paddingBottom: '100%',
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        margin: 'calc(var(--border-width) * -0.5)',
        border: 'var(--border-width) solid var(--color-primary)',
        borderTopWidth: borderTopWidth ? borderTopWidth : 0,
        borderRightWidth: borderRightWidth ? borderRightWidth : 0,
        borderBottomWidth: borderBottomWidth ? borderBottomWidth : 0,
        borderLeftWidth: borderLeftWidth ? borderLeftWidth : 0,
      },
    },
  })
)

const MazeCell = ({
  borderTopWidth,
  borderRightWidth,
  borderBottomWidth,
  borderLeftWidth,
  style,
}) => {
  const { classes } = useStyles({
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
  })

  return <li className={classes.mazeCell} style={style} />
}

const Maze = ({ maze = [], size = {}, setSize, cursorIdx, setCursorIdx }) => {
  const [isTransition, setIsTransition] = useState(false)

  useEffect(() => {
    if (cursorIdx === size.width * size.height - 1) {
      setIsTransition(true)
      setTimeout(() => {
        setCursorIdx(0)
      }, 500)
      setTimeout(() => {
        setIsTransition(false)
      }, 1000)
    }
  }, [cursorIdx, size])

  return (
    <Box
      style={{
        maxHeight: '80vh',
        maxWidth: '80vh',
      }}
    >
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gridGap: '2rem',
        }}
      >
        <ul
          style={{
            display: 'grid',
            listStyle: 'none',
            gridTemplateColumns: `repeat(${size.width}, 1fr)`,

            position: 'relative',
            margin: '0',
            padding: '0',

            '--border-width': '4px',
          }}
        >
          {maze?.map(({ top, right, bottom, left }, idx) => {
            function getBackgroundColor() {
              if (cursorIdx === idx) return 'hsla(var(--hsl-primary), 0.5)'
              if (idx === maze.length - 1)
                return 'hsla(var(--hsl-success),0.25)'
              return null
            }

            return (
              <MazeCell
                key={idx}
                borderTopWidth={top ? 'var(--border-width)' : 0}
                borderRightWidth={right ? 'var(--border-width)' : 0}
                borderBottomWidth={bottom ? 'var(--border-width)' : 0}
                borderLeftWidth={left ? 'var(--border-width)' : 0}
                style={{
                  position: `relative`,
                  background: `${getBackgroundColor()}`,
                  zIndex: `${cursorIdx === idx && '-1'}`,
                }}
              />
            )
          })}
          {isTransition && <Revealer size={size} />}
        </ul>
      </Box>
    </Box>
  )
}

export default Maze

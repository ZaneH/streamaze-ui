import { Box, Container, Text, createStyles, px, rem } from '@mantine/core'
import { useParallax } from 'react-scroll-parallax'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
  },

  inner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: px(24),
  },

  title: {
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.white,
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18),
    },
  },

  controls: {
    justifyContent: 'center',

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontWeight: 500,
    borderRadius: theme.radius.lg,
    color: theme.colors.dark[8],

    [theme.fn.smallerThan('sm')]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },

  subtleContainer: {
    borderRadius: px(18),
    background: theme.colors.dark[7],
    width: '100%',
    paddingTop: px(32),
    paddingBottom: px(56),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: theme.white,
    '& > *': {
      marginRight: 'auto',
      marginLeft: 'auto',
      width: '75%',
    },
  },

  chatContainer: {
    borderRadius: px(18),
    background: theme.colors.dark[7],
    border: '1px solid rgba(255, 255, 255, 0.4)',
    marginTop: '24px',
    overflow: 'hidden',
    height: '220px',
  },
}))

export const NextGenChatSection = () => {
  const { classes } = useStyles()
  const parallax = useParallax({
    speed: -10,
    translateY: [100, -300],
  })

  return (
    <div className={classes.wrapper}>
      <Container className={classes.inner}>
        <Box className={classes.subtleContainer}>
          <h1 className={classes.title}>Next-Gen Chat</h1>
          <Box className={classes.chatContainer}>
            <Box ref={parallax.ref} px={30}>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
              <Text>This will be parallex'd</Text>
            </Box>
          </Box>
          <Box opacity={0.66} mt={18}>
            Combine live stream chats from your favorite platforms into one.
          </Box>
        </Box>
      </Container>
    </div>
  )
}

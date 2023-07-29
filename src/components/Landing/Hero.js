import { Box, Button, Group, createStyles, px, rem } from '@mantine/core'
import { motion } from 'framer-motion'
import { ReactComponent as BasicIllustration } from 'assets/streamaze-basic-illustration.svg'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    paddingLeft: '18px',
    paddingRight: '18px',
  },

  inner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: px(24),
    marginTop: '40px',
    [theme.fn.largerThan('sm')]: {
      marginTop: '80px',
    },
  },

  title: {
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 500,
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

  subtitle: {
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontSize: rem(24),
    fontWeight: 500,
    margin: 0,
    padding: 0,
    color: theme.white,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: theme.spacing.xs,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18),
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
  },

  illustration: {
    marginBottom: '0',
    width: '100%',
    [theme.fn.largerThan('xs')]: {
      marginTop: '12px',
      paddingTop: '18px',
      marginBottom: '54px',
    },
    alignSelf: 'center',
    paddingLeft: '18px',
    paddingRight: '18px',
  },
}))

export const Hero = () => {
  const { classes } = useStyles()
  return (
    <div className={classes.wrapper}>
      <Box size={700} className={classes.inner}>
        <Box>
          <h1 className={classes.title}>The Ultimate Live Stream Dashboard</h1>
          <h2 className={classes.subtitle}>
            Control all of your live streams in one place
          </h2>
        </Box>

        <Group className={classes.controls}>
          <motion.div
            whileHover={{
              scale: 1.035,
            }}
          >
            <Button
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{
                from: '#0634D6',
                to: '#062282',
                deg: 160,
              }}
              style={{ color: 'white' }}
            >
              Sign Up
            </Button>
          </motion.div>

          <Button
            component="a"
            href="https://docs.streamaze.live/"
            size="xl"
            variant="white"
            className={classes.control}
          >
            FAQ
          </Button>
        </Group>

        <BasicIllustration className={classes.illustration} />
      </Box>
    </div>
  )
}

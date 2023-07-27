import { Box, Button, Group, createStyles, px, rem } from '@mantine/core'
import { motion } from 'framer-motion'
import { ReactComponent as BasicIllustration } from 'assets/streamaze-basic-illustration.svg'

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
}))

export const Hero = () => {
  const { classes } = useStyles()
  return (
    <div className={classes.wrapper}>
      <Box size={700} className={classes.inner}>
        <h1 className={classes.title}>The Ultimate Live Stream Dashboard</h1>

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
            href="https://github.com/mantinedev/mantine"
            size="xl"
            variant="white"
            className={classes.control}
          >
            Docs
          </Button>
        </Group>

        <BasicIllustration
          style={{
            paddingTop: '34px',
            marginBottom: '54px',
            marginTop: '12px',
            alignSelf: 'center',
          }}
        />
      </Box>
    </div>
  )
}

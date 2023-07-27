import { Box, Container, Grid, createStyles, px, rem } from '@mantine/core'
import { SuperChatCard } from 'components/Donations'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { motion } from 'framer-motion'

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

  donationLog: {
    display: 'flex',
    flexDirection: 'column',
    gap: px(12),
  },

  donationBlurbs: {
    display: 'flex',
    flexDirection: 'column',
    gap: px(32),
    color: theme.white,
    fontFamily: `IBM Plex Sans, ${theme.fontFamily}`,
    fontSize: px(20),
    fontWeight: 500,
    lineHeight: 'normal',
    '& h3': {
      fontSize: px(32),
      fontWeight: 700,
      margin: 0,
      padding: 0,
    },
  },
}))

const DONATIONS = [
  {
    type: 'superchat',
    data: {
      amount: 2.0,
      displayString: '$3.00',
      message: 'Nice',
      name: 'John Doe',
      metadata: {
        pfp: 'https://i.imgur.com/2x2f6VJ.png',
      },
    },
  },
  {
    type: 'kick_subscription',
    data: {
      amount: 9.99,
      name: 'John Doe',
      metadata: {
        pfp: 'https://i.imgur.com/2x2f6VJ.png',
        months: 5,
      },
    },
  },
  {
    type: 'superchat',
    data: {
      amount: 10,
      displayString: '$10.00',
      message: 'Thanks for the India stream! Hope you do more!',
      name: 'John Doe',
      metadata: {
        pfp: 'https://i.imgur.com/2x2f6VJ.png',
      },
    },
  },
  {
    type: 'superchat',
    data: {
      amount: 200,
      displayString: '$200.00',
      message: 'Thanks for the India stream! Hope you do more!',
      name: 'John Doe',
      metadata: {
        pfp: 'https://i.imgur.com/2x2f6VJ.png',
      },
    },
  },
]

const DONATION_BLURBS = [
  {
    title: 'Text-to-Speech',
    description:
      'Pick voices from Elevenlabs or Streamlabs to read out donations.',
  },
  {
    title: 'OBS widgets',
    description: 'Have a sub goal? Add our widget to your OBS scene!',
  },
  {
    title: 'Media donos',
    description:
      'Play YouTube media donations straight from the browser.\n\nInteract with your stream in new and exciting ways!',
  },
]

const PopupText = ({ children }) => {
  const ref = useRef()
  const isInView = useInView(ref, {
    amount: 'all',
    margin: '0px 0px -100px 0px',
  })

  return (
    <Box
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transition: 'opacity 0.7s',
      }}
    >
      {children}
    </Box>
  )
}

export const DonationSection = () => {
  const { classes } = useStyles()

  return (
    <div className={classes.wrapper}>
      <Container className={classes.inner}>
        <h1 className={classes.title}>Make Donations Fun!</h1>

        <Grid gutter={px(45)} grow>
          <Grid.Col xs={12} sm={4}>
            <Box className={classes.donationLog}>
              {DONATIONS.map((d, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    scale: 1.08,
                    transition: {
                      duration: 0.4,
                      ease: 'backOut',
                    },
                  }}
                >
                  <SuperChatCard donation={d} />
                </motion.div>
              ))}
            </Box>
          </Grid.Col>

          <Grid.Col xs={12} sm={1}>
            <Box className={classes.donationBlurbs}>
              {DONATION_BLURBS.map((b, i) => (
                <PopupText key={i}>
                  <Box className={classes.donationBlurb}>
                    <h3>{b.title}</h3>
                    <Box
                      pt={6}
                      opacity={0.66}
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {b.description}
                    </Box>
                  </Box>
                </PopupText>
              ))}
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  )
}

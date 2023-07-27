import {
  Box,
  Container,
  Flex,
  Grid,
  createStyles,
  px,
  rem,
} from '@mantine/core'

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
    height: '100%',
    background:
      'linear-gradient(170deg, rgba(10, 10, 11, 0.75) 0%, #0A0A0B 100%)',
    width: '100%',
    paddingTop: px(32),
    paddingBottom: px(32),
    paddingRight: px(24),
    paddingLeft: px(24),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: `IBM Plex Sans, ${theme.fontFamily}`,
    color: theme.white,
    fontSize: px(18),
  },

  featureTitle: {
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontSize: rem(24),
    fontWeight: 800,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.white,
    marginBottom: px(8),
  },

  featureSubtext: {
    opacity: 0.66,
    fontSize: px(16),
    fontWeight: 400,
    fontFamily: `IBM Plex Sans, ${theme.fontFamily}`,
    marginTop: px(8),
  },
}))

const FeatureCol = ({ title, description, subtext }) => {
  const { classes } = useStyles()

  return (
    <Grid.Col sm={6} md={3}>
      <Box className={classes.subtleContainer}>
        <Flex direction="column" justify="space-between" gap={8} h="100%">
          <h4 className={classes.featureTitle}>{title}</h4>
          <Box mb="auto">{description}</Box>
          {subtext ? subtext : null}
        </Flex>
      </Box>
    </Grid.Col>
  )
}

export const FeaturesSection = () => {
  const { classes } = useStyles()

  return (
    <div className={classes.wrapper}>
      <Container className={classes.inner}>
        <h1 className={classes.title}>The Highlights</h1>

        <Grid grow>
          <FeatureCol
            title="Polls"
            description="Press 1 if you’ve ever ran a poll. View every response to your poll here."
            subtext={
              <Box className={classes.featureSubtext}>
                (OBS widget provided)
              </Box>
            }
          />
          <FeatureCol
            title="GPS"
            description="Turn on the GPS to share your live location on stream."
            subtext={
              <Box className={classes.featureSubtext}>
                (OBS widget provided)
              </Box>
            }
          />
          <FeatureCol
            title="OBS Ctrl"
            description="Switch OBS scenes, start your stream and end it straight from the dashboard."
            subtext={
              <Box className={classes.featureSubtext}>
                (OBS plugin provided)
              </Box>
            }
          />
          <FeatureCol
            title="Stats"
            description="See how many viewers are watching on each platform."
          />
          <FeatureCol
            title="Giveaways"
            description="Type !enter in chat and spin the wheel! We also provide a Stake.com plugin to make affiliate giveaways easier."
            subtext={
              <Box className={classes.featureSubtext}>Read more &rarr;</Box>
            }
          />
          <FeatureCol
            title="Track Profits"
            description="Keep track of every donation (or expense) and add it to the stream overlay automagically."
            subtext={
              <Box className={classes.featureSubtext}>
                (OBS plugin provided)
              </Box>
            }
          />
          <FeatureCol
            title="Subathons"
            description="Built for one of the greatest subathons of all time. We have everything you need to keep the clock going!"
            subtext={
              <Box className={classes.featureSubtext}>
                (OBS plugin provided)
              </Box>
            }
          />
        </Grid>
      </Container>
    </div>
  )
}

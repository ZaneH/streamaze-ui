/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import {
  Box,
  Container,
  Flex,
  Grid,
  Text,
  createStyles,
  px,
  rem,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'

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
    fontSize: px(18),
    fontWeight: 500,
    fontFamily: `IBM Plex Sans, ${theme.fontFamily}`,
    marginTop: px(18),
  },
}))

const PricingCol = ({ title, includes, subtext }) => {
  const { classes } = useStyles()

  return (
    <Grid.Col xs={12} sm={4}>
      <Box className={classes.subtleContainer}>
        <Flex direction="column" justify="space-between" gap={8} h="100%">
          <h4 className={classes.featureTitle}>{title}</h4>
          <Box mb="auto">
            <Flex direction="column" gap={7}>
              {includes.map((include, i) => (
                <Box key={i}>
                  <Flex gap={6} align="center">
                    <IconCheck size={18} color="white" opacity={0.66} />
                    {include}
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
          {subtext && <Text className={classes.featureSubtext}>{subtext}</Text>}
        </Flex>
      </Box>
    </Grid.Col>
  )
}

export const PricingSection = () => {
  const { classes } = useStyles()

  return (
    <div className={classes.wrapper}>
      <Container className={classes.inner}>
        <h2 className={classes.title}>Pricing</h2>

        <Grid grow>
          <PricingCol
            title="Free"
            subtext={
              <a
                href="https://my.streamaze.xyz/account/settings"
                target="_blank"
                rel="noreferrer"
              >
                Create an account &rarr;
              </a>
            }
            includes={['Chat features']}
          />
          <PricingCol
            title="Subscriber"
            subtext={
              <a
                href="https://my.streamaze.xyz/account/upgrade"
                target="_blank"
                rel="noreferrer"
              >
                $8.99/mo. &rarr;
              </a>
            }
            includes={[
              'Chat features',
              'Donation + TTS features',
              'Viewer statistics',
              'OBS widgets',
              'Support',
            ]}
          />
          <PricingCol
            title="Premium"
            subtext={
              <a
                href="https://my.streamaze.xyz/account/upgrade"
                target="_blank"
                rel="noreferrer"
              >
                $14.99/mo. &rarr;
              </a>
            }
            includes={[
              'Everything',
              'OBS plugins',
              'Giveaways',
              'Priority support',
            ]}
          />
        </Grid>
      </Container>
    </div>
  )
}

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Text,
  createStyles,
  px,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons'
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

  disclaimer: {
    textAlign: 'center',
    color: theme.white,
    opacity: 0.66,
    fontSize: px(20),
    fontWeight: 400,
  },
}))

const FeatureCol = ({ title, includes, subtext }) => {
  const { classes } = useStyles()

  return (
    <Grid.Col span={4}>
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

export const NewsletterSection = () => {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  return (
    <div className={classes.wrapper}>
      <Container className={classes.inner}>
        <h1 className={classes.title}>Sign Up for Updates</h1>

        <Flex
          w="100%"
          align="center"
          gap={18}
          maw={550}
          style={{ alignSelf: 'center' }}
        >
          <Input
            w="100%"
            type="email"
            placeholder="example@email.com"
            size="lg"
            radius="lg"
          />
          <Button
            size="xl"
            className={classes.control}
            style={{
              color: theme.colors.dark[8],
              backgroundColor: '#F1D302',
            }}
          >
            Submit
          </Button>
        </Flex>

        <Box className={classes.disclaimer}>
          We will not spam or sell your information.
        </Box>
      </Container>
    </div>
  )
}

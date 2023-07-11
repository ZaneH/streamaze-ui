import {
  Container,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  createStyles,
  rem,
} from '@mantine/core'
import {
  IconArrowMerge,
  IconBroadcast,
  IconCellSignal2,
  IconDeviceSpeaker,
  IconDragDrop,
  IconFlag,
  IconGift,
  IconMoneybag,
  IconSpeakerphone,
} from '@tabler/icons'

export const FEATURES_DATA = [
  {
    icon: IconArrowMerge,
    title: 'Real-time chat merging',
    description:
      'Chat messages from all platforms are merged into one feed. No more switching between tabs!',
  },
  {
    icon: IconBroadcast,
    title: 'Control OBS from anywhere',
    description:
      'Switch between scenes, start/stop your stream, and more, all from the browser.',
  },
  {
    icon: IconSpeakerphone,
    title: 'TTS (Text-to-speech)',
    description:
      'Choose a voice from Streamlab or ElevenLabs AI to hear donations straight from the dashboard.',
  },
  {
    icon: IconMoneybag,
    title: 'Viewer donations',
    description:
      'List subscriptions, media donations, bits, raids and more all in one place. We can provide analytics too!',
  },
  {
    icon: IconDeviceSpeaker,
    title: 'Keep your bluetooth speakers on',
    description:
      'By playing silent audio in the background, the Streamaze dashboard can keep your bluetooth speakers on at all times.',
  },
  {
    icon: IconCellSignal2,
    title: 'Low latency and low bandwidth',
    description:
      'Streamaze uses a lightweight connection for real-time data. This makes it perfect for mobile devices with bad connection.',
  },
  {
    icon: IconGift,
    title: 'Viewer giveaways',
    description:
      "Want to raffle prizes to your viewers? We've got you covered! Viewers can enter with our chat integration.",
  },
  {
    icon: IconFlag,
    title: 'Built-in subathons',
    description:
      'Automatically increase your subathon timer when viewers donate/subscribe to your channel.',
  },
  {
    icon: IconDragDrop,
    title: 'Ready-made widgets',
    description:
      'We have a variety of widgets to choose from, including a chat box, subathon timer, and more!',
  },
]

export function Feature({ icon: Icon, title, description }) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon size="1.1rem" stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </div>
  )
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      textAlign: 'left',
    },
  },
}))

export function FeaturesGrid({ title, description, data = FEATURES_DATA }) {
  const { classes } = useStyles()
  const features = data.map((feature, index) => (
    <Feature {...feature} key={index} />
  ))

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>{title}</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          {description}
        </Text>
      </Container>

      <SimpleGrid
        mt={80}
        cols={3}
        spacing={50}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'xl' },
          { maxWidth: 755, cols: 1, spacing: 'xl' },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  )
}

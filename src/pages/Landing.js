import {
  Box,
  Burger,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Header,
  Menu,
  Paper,
  SimpleGrid,
  Transition,
  createStyles,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown } from '@tabler/icons'
import {
  DonationSection,
  FeaturesSection,
  Hero,
  NewsletterSection,
  NextGenChatSection,
  PricingSection,
} from 'components/Landing'
import { ParallaxProvider } from 'react-scroll-parallax'

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    color: theme.white,
  },

  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colors.dark[0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colors.dark[6],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },

  dropdown: {
    marginTop: rem(8),
    padding: `${rem(10)} ${rem(12)}`,
    '*': {
      padding: `${rem(10)} ${rem(12)}`,
    },
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
  },

  footer: {
    fontWeight: 500,
    color: 'white',
    fontFamily: `IBM Plex Sans, ${theme.fontFamily}`,
  },

  footerLink: {
    textAlign: 'right',
  },

  verticalDivide: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}))

const HeaderMenu = ({ links }) => {
  const [opened, { toggle }] = useDisclosure(false)
  const { classes } = useStyles()

  const items = links.map((link, i) => {
    if (link === null) {
      return (
        <Divider
          key={i}
          orientation="vertical"
          className={classes.verticalDivide}
        />
      )
    }

    const menuItems = link.links?.map((item, j) => (
      <Menu.Item key={j}>{item.label}</Menu.Item>
    ))

    if (menuItems) {
      return (
        <Menu
          key={i}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      )
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    )
  })

  return (
    <Header height={56} style={{ position: 'relative' }}>
      <Container>
        <div className={classes.inner}>
          <Box className={classes.title}>Streamaze</Box>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        </div>
        <Transition transition="pop" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  )
}

const Footer = () => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return (
    <Box
      mt={80}
      style={{ backgroundColor: theme.colors.dark[9] }}
      pt={40}
      pb={80}
    >
      <Container size="md">
        <SimpleGrid cols={2} className={classes.footer}>
          <Box>Streamaze &copy; 2023</Box>
          <Flex direction="column" gap={8} className={classes.footerLink}>
            <Box>Visit the docs</Box>
            <Box>Forgot password?</Box>
            <Box>Contact</Box>
            <Box>About us</Box>
          </Flex>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

const Landing = () => {
  const theme = useMantineTheme()

  return (
    <Box
      style={{
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      }}
    >
      <HeaderMenu
        links={[
          { label: 'Stats', link: '/stats' },
          { label: 'Contact', link: '/contact' },
          { label: 'Pricing', link: '/pricing' },
          null,
          { label: 'Login', link: '/login' },
          { label: 'Register', link: '/register' },
        ]}
      />
      <Flex direction="column" gap={80}>
        <ParallaxProvider>
          <Hero />
          <DonationSection />
          <NextGenChatSection />
          <FeaturesSection />
          <PricingSection />
          <NewsletterSection />
        </ParallaxProvider>
      </Flex>
      <Footer />
    </Box>
  )
}

export default Landing

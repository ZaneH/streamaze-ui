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
  Title,
  Transition,
  createStyles,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown } from '@tabler/icons'
import { DonationSection, FeaturesGrid, Hero } from 'components/Landing'

const useStyles = createStyles((theme) => ({
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
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
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
  },

  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
}))

const HeaderMenu = ({ links }) => {
  const [opened, { toggle }] = useDisclosure(false)
  const { classes } = useStyles()

  const items = links.map((link) => {
    if (link === null) {
      return <Divider orientation="vertical" />
    }

    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ))

    if (menuItems) {
      return (
        <Menu
          key={link.label}
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
    <Header height={56}>
      <Container>
        <div className={classes.inner}>
          <Title order={3}>Streamaze</Title>
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
      <Flex direction="column" gap={80} mt={80}>
        <Hero />
        <DonationSection />
      </Flex>
      {/* <FeaturesGrid /> */}
    </Box>
  )
}

export default Landing

import { SimpleGrid } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import ChatCard from '../components/ChatCard'
import Layout from '../components/Layout'
import TimestampCard from '../components/TimestampCard'

const Home = () => {
  const [chatSources] = useLocalStorage({
    key: 'chat-sources',
    getInitialValueInEffect: false,
    defaultValue: {
      example: {
        twitch: {
          enabled: false,
          handle: '',
        },
        tiktok: {
          enabled: false,
          handle: '',
        },
        youtube: {
          enabled: false,
          channel: '',
        },
      },
    },
  })

  const [activeTheme] = useLocalStorage({
    key: 'active-theme',
    getInitialValueInEffect: false,
    defaultValue: {
      name: 'default',
    },
  })

  return (
    <Layout>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 2000, cols: 2 },
          { maxWidth: 1600, cols: 2 },
          { maxWidth: 980, cols: 1 },
        ]}
      >
        {Object.keys(chatSources).map((key, i) => (
          <ChatCard
            title={key}
            key={i}
            config={{
              ...chatSources[key],
              theme: activeTheme,
            }}
          />
        ))}
        <TimestampCard />
      </SimpleGrid>
    </Layout>
  )
}

export default Home

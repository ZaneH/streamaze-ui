import { SimpleGrid } from '@mantine/core'
import { useContext } from 'react'
import ChatCard from '../components/ChatCard'
import Layout from '../components/Layout'
import { SidebarContext } from '../components/SidebarProvider'
import TimestampCard from '../components/TimestampCard'

const Home = () => {
  const { chatConfig, themeConfig } = useContext(SidebarContext)

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
        {Object.keys(chatConfig).map((key, i) => (
          <ChatCard
            title={key}
            key={i}
            config={{
              ...chatConfig[key],
              theme: themeConfig,
            }}
          />
        ))}
        <TimestampCard />
      </SimpleGrid>
    </Layout>
  )
}

export default Home

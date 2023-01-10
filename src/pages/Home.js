import { Container, SimpleGrid } from '@mantine/core'
import { useContext } from 'react'
import ChatCard from '../components/ChatCard'
import Layout from '../components/Layout'
import OBSCard from '../components/OBSCard'
import { SidebarContext } from '../components/SidebarProvider'
import StatCard from '../components/StatCard'
import TagSEO from '../components/TagSEO'
import TimestampCard from '../components/TimestampCard'

const Home = () => {
  const { chatConfig, themeConfig } = useContext(SidebarContext)

  return (
    <Layout>
      <TagSEO />
      <Container maw="1200px">
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 960, cols: 1 }]}>
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
          <OBSCard />
          <StatCard />
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Home

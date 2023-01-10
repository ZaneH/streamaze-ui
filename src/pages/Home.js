import { Container } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useContext } from 'react'
import Masonry from 'react-responsive-masonry'
import ChatCard from '../components/ChatCard'
import Layout from '../components/Layout'
import OBSCard from '../components/OBSCard'
import { SidebarContext } from '../components/SidebarProvider'
import StatCard from '../components/StatCard'
import TagSEO from '../components/TagSEO'
import TimestampCard from '../components/TimestampCard'

const Home = () => {
  const { chatConfig, themeConfig } = useContext(SidebarContext)
  const maxWidthMq = useMediaQuery('(max-width: 960px)')

  return (
    <Layout>
      <TagSEO />
      <Container maw="1200px">
        <Masonry
          columnsCount={maxWidthMq ? 1 : 2}
          gutter={maxWidthMq ? '14px' : '18px'}
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
          <OBSCard />
          <StatCard />
        </Masonry>
      </Container>
    </Layout>
  )
}

export default Home

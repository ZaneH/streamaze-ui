/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import {
  AppShell,
  Box,
  Burger,
  Button,
  ColorSwatch,
  Flex,
  MediaQuery,
  Space,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { HopContext } from '../Providers/HopProvider'
import { SidebarContext } from '../Providers/SidebarProvider'
import Sidebar from './Sidebar'
import TagSEO from 'components/TagSEO'
import { PhoenixContext } from 'components/Providers/PhoenixProvider'

const SplitHeader = () => {
  const { colors } = useMantineTheme()
  const { setIsSidebarOpen } = useContext(SidebarContext)
  const { currentStreamer } = useContext(PhoenixContext)
  const { isLive } = useContext(HopContext) || {}
  const navigate = useNavigate()

  const isUpgraded = currentStreamer?.has_valid_subscription ?? false

  return (
    <Box height={78}>
      <Flex align="start" gap="sm">
        <Flex align="center" px="20px" w={'100%'} bg={colors.dark[7]} py="md">
          <Burger
            mr="xl"
            onClick={() => {
              setIsSidebarOpen(true)
            }}
          />
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Flex align="center">
              {isLive && (
                <>
                  <ColorSwatch color={colors.red[7]} />
                  <Space w="md" />
                </>
              )}
              <Title
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate('/')
                }}
              >
                Streamaze
              </Title>
            </Flex>
          </MediaQuery>
          <Space w="lg" />
          {!isUpgraded && (
            <Button
              variant="gradient"
              style={{ alignSelf: 'center' }}
              onClick={() => {
                window.open('https://my.streamerdash.com/account/upgrade')
              }}
            >
              Upgrade
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

const Layout = ({ children, showStats = false }) => {
  return (
    <AppShell
      padding="16px"
      header={<SplitHeader showStats={showStats} />}
      navbar={<Sidebar />}
      styles={{
        root: {
          color: 'white',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        main: {
          paddingLeft: '28px',
          padding: 0,
          minHeight: 'inherit',
          height: '100%',
        },
        body: {
          alignItems: 'stretch',
          flex: '1 1 auto',
          height: '100%',
        },
      }}
    >
      <TagSEO />
      {children}
    </AppShell>
  )
}

export default Layout

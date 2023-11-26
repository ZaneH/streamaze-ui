/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { Box, Button, Container, Flex, SimpleGrid, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconLock } from '@tabler/icons'
import { useContext, useState } from 'react'
import { Layout } from '../components/document'
import { ConfigContext } from '../components/Providers/ConfigProvider'

const KeyButton = ({ children, ...props }) => {
  return (
    <Box
      p="xs"
      bg="gray"
      color="white"
      shadow="sm"
      style={{
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

const Keypad = () => {
  const { setKeypadConfig } = useContext(ConfigContext)
  const isSmall = useMediaQuery('(max-width: 600px)')
  const [code, setCode] = useState('')

  return (
    <Layout>
      <Flex direction="column" h="70%" justify="center">
        <Container miw={isSmall ? '80%' : '400px'}>
          <Flex gap="md" direction="column">
            <Title size="1.5em" color="dimmed" align="center" ff="monospace">
              {code ? code : '<code>'}
            </Title>
            <SimpleGrid cols="3" rows="4">
              {[...Array(9)].map((_, i) => (
                <KeyButton
                  key={i}
                  p="xs"
                  onClick={() => {
                    setCode((prev) => prev.concat((i + 1).toString()))
                  }}
                >
                  {i + 1}
                </KeyButton>
              ))}
            </SimpleGrid>
            <Button
              size="lg"
              color="green"
              leftIcon={<IconLock />}
              onClick={() => {
                setKeypadConfig((prev) => ({
                  ...prev,
                  code,
                }))

                setCode('')
              }}
            >
              Unlock
            </Button>
          </Flex>
        </Container>
      </Flex>
    </Layout>
  )
}

export default Keypad

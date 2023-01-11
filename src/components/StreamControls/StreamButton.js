import styled from '@emotion/styled'
import {
  Box,
  Container,
  Flex,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useCallback } from 'react'

const getBackgroundGradient = (color) => {
  if (color === 'red') {
    return 'linear-gradient(180deg, #F03E3E 0%, #C92A2A 100%);'
  } else if (color === 'purple') {
    return 'linear-gradient(180deg, #7950F2 0%, #6741D9 100%);'
  } else if (color === 'orange') {
    return 'linear-gradient(180deg, #FF922B 0%, #E67700 100%);'
  } else if (color === 'green') {
    return 'linear-gradient(180deg, #2F9E44 0%, #2B8A3E 100%);'
  } else if (color === 'blue') {
    return 'linear-gradient(180deg, #1C7ED6 0%, #1864AB 100%);'
  }
}

const LargeButton = styled(UnstyledButton)`
  width: 100%;
  padding: 28px 0;
  text-transform: uppercase;
`

const StreamButton = ({ color = 'red', label, icon, children }) => {
  return (
    <LargeButton bg={getBackgroundGradient(color)}>
      {!icon && (
        <Title size={32} weight={800} color="white" align="center">
          {label ?? children}
        </Title>
      )}
      {icon && <Flex justify="center">{icon}</Flex>}
    </LargeButton>
  )
}

export default StreamButton

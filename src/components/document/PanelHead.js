import { Box, Title, useMantineTheme } from '@mantine/core'

const PanelHead = ({ children }) => {
  const { colors } = useMantineTheme()
  return (
    <Box px="32px" pt="16px" pb="28px" bg={colors.dark[7]}>
      <Title>{children}</Title>
    </Box>
  )
}

export default PanelHead

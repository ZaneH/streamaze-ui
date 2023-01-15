import { Box, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const PanelHead = ({ children, ...props }) => {
  const { colors } = useMantineTheme()
  const isSmall = useMediaQuery('(max-width: 767px)')
  const isMedium = useMediaQuery('(max-width: 768px)')

  return (
    <Box
      px={isMedium ? '24px' : '32px'}
      pt="16px"
      pb="28px"
      bg={colors.dark[7]}
      {...props}
    >
      <Title size={isSmall ? 'h3' : 'h1'}>{children}</Title>
    </Box>
  )
}

export default PanelHead

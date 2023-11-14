import { Flex, Text, Title } from '@mantine/core'

const Container = ({ children, onClick }) => {
  return (
    <Flex
      direction="column"
      align="center"
      px="xl"
      py="xl"
      onClick={onClick}
      style={{
        backgroundColor: '#191B1E',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      {children}
    </Flex>
  )
}

const SettingCell = ({
  title = 'Section',
  description = 'Description',
  onClick,
}) => {
  return (
    <Container onClick={onClick}>
      <Title order={3} pb="sm">
        {title}
      </Title>
      <Text opacity={0.4} align="center">
        {description}
      </Text>
    </Container>
  )
}

export default SettingCell

import styled from '@emotion/styled'
import { Box, Button, Flex, Paper, Text, Title } from '@mantine/core'

const FormBox = styled(Paper)`
  padding: 16px 12px;
  border-radius: 8px;
  border: 1px solid #495057;
  margin: 16px 24px;
`

const SectionTitle = ({ title, subtitle }) => {
  return (
    <Box mx="xl" mt="xl" mb="md">
      <Title size="h2">{title}</Title>
      <Text>{subtitle}</Text>
    </Box>
  )
}

const FormSection = ({ title, subtitle, children, onCancel }) => {
  return (
    <>
      <SectionTitle title={title} subtitle={subtitle} />
      <FormBox shadow="sm" padding="md">
        <Flex gap="sm" direction="column">
          {children}
          <Button.Group mt="xs">
            {/* TODO: Add Cancel button */}
            {/* <Button fullWidth color="red" variant="subtle" onClick={onCancel}>
              Cancel
            </Button> */}
            <Button
              fullWidth
              color="blue"
              type="submit"
              style={{
                borderRadius: '4px',
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Flex>
      </FormBox>
    </>
  )
}

export default FormSection

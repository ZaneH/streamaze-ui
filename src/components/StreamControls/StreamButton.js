/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, Flex, Modal, Text, Title, UnstyledButton } from '@mantine/core'
import { useState } from 'react'

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
  } else {
    // dark gray gradient
    return 'linear-gradient(180deg, #2D2D2D 0%, #1F1F1F 100%);'
  }
}

const LargeButton = styled(UnstyledButton)`
  width: 100%;
  padding: 18px 0;
  text-transform: uppercase;
  ${({ disabled }) =>
    disabled
      ? css`
          filter: brightness(30%);
          cursor: not-allowed;
        `
      : ''}
`

const StreamButton = ({
  color = 'red',
  label,
  icon,
  disabled = false,
  onClick,
  children,
  requireConfirmation,
  style,
}) => {
  const [isConfirmationOpened, setIsConfirmationOpened] = useState(false)

  return (
    <>
      {requireConfirmation ? (
        <Modal
          centered
          opened={isConfirmationOpened}
          onClose={() => setIsConfirmationOpened(false)}
          title="Confirm Action"
        >
          <Flex direction="column" gap="md">
            <Text>Tap "Confirm" to switch scenes.</Text>
            <Button.Group>
              <Button
                fullWidth
                h="48px"
                variant="filled"
                color="red"
                onClick={() => setIsConfirmationOpened(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                h="48px"
                onClick={onClick}
                variant="filled"
                color="green"
              >
                Confirm
              </Button>
            </Button.Group>
          </Flex>
        </Modal>
      ) : null}

      <LargeButton
        bg={getBackgroundGradient(color)}
        disabled={disabled}
        onClick={
          requireConfirmation ? () => setIsConfirmationOpened(true) : onClick
        }
        style={style}
      >
        {!icon && (
          <Title size="2.5vw" weight={800} color="white" align="center" px="sm">
            {label ?? children}
          </Title>
        )}
        {icon && <Flex justify="center">{icon}</Flex>}
      </LargeButton>
    </>
  )
}

export default StreamButton

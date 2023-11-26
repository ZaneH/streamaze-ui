/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { Box, Modal, Text } from '@mantine/core'
import { WordRankContext } from 'components/Providers/WordRankProvider'
import { motion } from 'framer-motion'
import { useContext } from 'react'

export const WordRankCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.35em 12px;
  margin: 0.25em 0;
  text-transform: capitalize;
`

const WordRankModal = ({ isOpen = false, onClose }) => {
  const { wordRankData } = useContext(WordRankContext)

  return (
    <Modal
      title="Word Rank"
      opened={isOpen}
      onClose={onClose}
      centered
      size="sm"
    >
      <Text size="lg" weight={500} align="center" mb="sm">
        Total Words: {Object.values(wordRankData).reduce((a, b) => a + b, 0)}
      </Text>
      <motion.div layout>
        {Object.entries(wordRankData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([word, count], i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              layout
            >
              <Box
                sx={(theme) => ({
                  backgroundImage: theme.fn.gradient({
                    from: theme.colors.red[Math.max(9 - i, 3)],
                    to: theme.colors.red[Math.max(9 - i, 3)],
                    deg: 45,
                  }),
                  color: theme.colors.gray[0],
                  borderRadius: theme.radius.sm,
                })}
              >
                <WordRankCard>
                  <Text size="lg" weight={800}>
                    {word.replace(/emote\d+/g, '(Emote) ')}
                  </Text>
                  <Text size="lg" weight={500}>
                    {count}
                  </Text>
                </WordRankCard>
              </Box>
            </motion.div>
          ))}
      </motion.div>
    </Modal>
  )
}

export default WordRankModal

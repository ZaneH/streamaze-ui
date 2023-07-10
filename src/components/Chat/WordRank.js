import { Box, Button, Flex, Text } from '@mantine/core'
import { WordRankCard } from 'components/Modals/WordRankModal/WordRankModal'
import { WordRankContext } from 'components/Providers/WordRankProvider'
import { motion } from 'framer-motion'
import { useContext } from 'react'

const WordRank = () => {
  const { wordRankData, setWordRankData } = useContext(WordRankContext)

  return (
    <motion.div
      layout
      style={{
        height: '40%',
        padding: '12px 24px',
        overflowY: 'auto',
      }}
    >
      <Flex justify="space-between" align="center">
        <Text size="lg" weight={500} align="center" mb="sm">
          Total Words: {Object.values(wordRankData).reduce((a, b) => a + b, 0)}
        </Text>
        <Button
          variant="subtle"
          color="gray"
          onClick={() => setWordRankData({})}
        >
          Reset
        </Button>
      </Flex>
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
  )
}

export default WordRank

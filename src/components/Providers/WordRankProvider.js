import debounce from 'lodash.debounce'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { LanyardContext } from './LanyardProvider'
import { FILLER_WORDS } from 'utils/strings'
export const WordRankContext = createContext()

const WordRankProvider = ({ children }) => {
  const { updateKV } = useContext(LanyardContext)
  const [isWordRankActive, setIsWordRankActive] = useState(true)
  // formatted: {"test": 2, "test2": 15, ...}
  const [wordRankData, setWordRankData] = useState({})
  const [showWordRankPanel, setShowWordRankPanel] = useState(false)

  useEffect(() => {
    setIsWordRankActive(showWordRankPanel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWordRankPanel])

  useEffect(() => {
    if (!showWordRankPanel) {
      updateKV('word_ranks', '[]')
    } else {
      updateKVWithDebounce(
        Object.entries(wordRankData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordRankData, showWordRankPanel])

  const updateWordRankKV = useCallback(
    (wordData) => {
      updateKV('word_ranks', JSON.stringify(wordData))
    },
    [updateKV]
  )

  const updateKVWithDebounce = useMemo(() => {
    return debounce(updateWordRankKV, 4000)
  }, [updateWordRankKV])

  // 1. Check if word rank is active
  // 2. Split the message into words, and remove any punctuation
  // 3. Remove filler words "the", "a", "and" etc.
  // 4. Check if the word is in the word rank data
  // 5. If it is, increment the count
  // 6. If it isn't, add it to the word rank data
  // 7. Update the word rank KV
  const handleIncomingWord = useCallback(
    (message) => {
      if (isWordRankActive) {
        try {
          const strippedMessage = String(message.content)
            .trim()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .toLowerCase()

          const words = [...new Set(strippedMessage.split(' '))].filter(
            (word) => !FILLER_WORDS.includes(word)
          )

          setWordRankData((prev) => {
            const newValue = Object.assign({}, prev)
            for (const word of words) {
              if (word in newValue) {
                newValue[word] += 1
              } else {
                if (word.trim().length === 0) continue
                newValue[word] = 1
              }
            }

            return newValue
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
    [isWordRankActive]
  )

  return (
    <WordRankContext.Provider
      value={{
        isWordRankActive,
        setIsWordRankActive,
        wordRankData,
        setWordRankData,
        handleIncomingWord,
        showWordRankPanel,
        setShowWordRankPanel,
      }}
    >
      {children}
    </WordRankContext.Provider>
  )
}

export default WordRankProvider

import { SimpleGrid, Button } from '@mantine/core'
const SceneSwitcher = ({ scenes, activeScene }) => {
  return (
    <SimpleGrid mih="64px" cols="3" breakpoints={[{ maxWidth: 600, cols: 1 }]}>
      {scenes.map((scene, i) => (
        <Button
          fullWidth
          h="100%"
          mih="52px"
          variant="light"
          color={scene === activeScene ? 'blue' : 'gray'}
          key={i}
          onClick={() => {
            console.log('clicked', scene)
          }}
        >
          {scene}
        </Button>
      ))}
    </SimpleGrid>
  )
}

export default SceneSwitcher

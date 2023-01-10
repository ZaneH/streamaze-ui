import wretch from 'wretch'
import { SimpleGrid, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

const { REACT_APP_API_URL } = process.env

const SceneSwitcher = ({ scenes, activeScene }) => {
  return (
    <SimpleGrid mih="64px" cols="3" breakpoints={[{ maxWidth: 600, cols: 1 }]}>
      {scenes.map((scene, i) => (
        <Button
          disabled={true}
          fullWidth
          h="100%"
          mih="52px"
          variant="light"
          color={scene === activeScene ? 'blue' : 'gray'}
          key={i}
          onClick={() => {
            wretch(`${REACT_APP_API_URL}/obs/switch-scene`)
              .post({
                scene_name: scene,
              })
              .res()
              .catch(() => {
                showNotification({
                  title: "Couldn't switch scenes",
                  message:
                    'There was an error switching scenes. Please check your config.',
                })
              })
          }}
        >
          {scene}
        </Button>
      ))}
    </SimpleGrid>
  )
}

export default SceneSwitcher

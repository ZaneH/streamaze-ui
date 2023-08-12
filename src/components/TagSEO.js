import { Helmet } from 'react-helmet-async'

const TagSEO = ({
  title = 'Streamaze | Live Stream Dashboard',
  description = 'The ultimate live streamer dashboard. Interact with all of your live stream chats in one place. Play games, track profits, add OBS overlays, and so much more. Supports Twitch, YouTube, Kick and TikTok.',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}

export default TagSEO

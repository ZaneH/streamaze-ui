import { Helmet } from 'react-helmet-async'

const TagSEO = ({
  title = 'Streamaze | Live streaming dashboard',
  description = 'Utilize Streamaze to monitor your live chats on multiple platforms simultaniously. Are you interested in TTS? Streamaze integrats with ElevenLabs and Streamlabs to provide the best TTS voices to you. You can use our OBS plugins to remotely control OBS or our OBS widgets for on-screen info.',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}

export default TagSEO

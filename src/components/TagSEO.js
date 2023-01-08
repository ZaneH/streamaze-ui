import { Helmet } from 'react-helmet'

const TagSEO = ({
  title = 'Streamaze | Your streaming buddy',
  description = 'Streamaze is a tool to enhance your livestreaming experience.',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}

export default TagSEO

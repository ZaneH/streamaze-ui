/**
 * Copyright 2023, Zane Helton, All rights reserved.
 */

import styled from '@emotion/styled'
import { Box, Container, Text, createStyles, px, rem } from '@mantine/core'
import { useParallax } from 'react-scroll-parallax'
import { ReactComponent as VerifiedChatIcon } from 'assets/verified-chat-icon.svg'
import { ReactComponent as ModChatIcon } from 'assets/mod-chat-icon.svg'
import { ReactComponent as KickGifted50Badge } from 'assets/kick-gifted-50-badge.svg'
import { ReactComponent as KickGifted200Badge } from 'assets/kick-gifted-200-badge.svg'
import { ReactComponent as KickOGBadge } from 'assets/kick-og-badge.svg'
import { ReactComponent as KickVIPBadge } from 'assets/kick-vip-badge.svg'

const SenderText = styled(Text)`
  display: inline;
  vertical-align: middle;
  word-break: break-word;
  color: ${({ isbig }) => (isbig ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  ${({ origin }) => origin === 'kick' && 'color: rgba(255, 255, 255, 0.7);'}
  ${({ origin }) => origin === 'youtube' && 'color: #E62117;'}
  ${({ ismember }) => ismember && 'color: #2ba640;'}
  ${({ ismod }) => ismod && 'color: #5e84f1;'}
  ${({ shadow }) => shadow && 'text-shadow: 0px 0px 4px #000;'}
  ${({ origin, ismember }) =>
    origin === 'kick' && ismember && 'color: #FF6C37;'}
  ${({ origin, ismod }) => origin === 'kick' && ismod && 'color: #5e84f1;'}
  ${({ isverified }) => isverified && 'color: #5BFE2E;'}
  font-weight: 700;
  font-family: 'Inter', sans-serif;
`

const MessageText = styled(Text)`
  display: inline;
  vertical-align: middle;
  word-break: break-word;
  color: white;
  ${({ shadow }) => shadow && 'text-shadow: 0px 0px 4px #000'}
  font-family: 'Inter', sans-serif;
  font-weight: 400;
`

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
  },

  inner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: px(24),
  },

  title: {
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.white,
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18),
    },
  },

  controls: {
    justifyContent: 'center',

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),
    fontFamily: `Unbounded, ${theme.fontFamily}`,
    fontWeight: 500,
    borderRadius: theme.radius.lg,
    color: theme.colors.dark[8],

    [theme.fn.smallerThan('sm')]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },

  subtleContainer: {
    borderRadius: px(18),
    background: theme.colors.dark[7],
    width: '100%',
    paddingTop: px(32),
    paddingBottom: px(56),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: theme.white,
    fontFamily: `IBM Plex Sans, ${theme.fontFamily}`,
    '& > *': {
      marginRight: 'auto',
      marginLeft: 'auto',
      width: '90%',
      [theme.fn.largerThan('sm')]: {
        width: '75%',
      },
    },
  },

  chatContainer: {
    borderRadius: px(18),
    background: theme.colors.dark[7],
    border: '1px solid rgba(255, 255, 255, 0.4)',
    marginTop: '24px',
    overflow: 'hidden',
    height: '220px',
  },
}))

const VerifiedIcon = () => {
  return (
    <VerifiedChatIcon
      style={{
        fill: '#999',
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        marginLeft: '4px',
      }}
    />
  )
}

const ModIcon = () => {
  return (
    <ModChatIcon
      style={{
        fill: 'currentcolor',
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        marginLeft: '4px',
      }}
    />
  )
}

const KickGift50Icon = () => {
  return (
    <KickGifted50Badge
      style={{
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        marginLeft: '4px',
      }}
    />
  )
}

const KickGift200Icon = () => {
  return (
    <KickGifted200Badge
      style={{
        fill: 'currentcolor',
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        marginLeft: '4px',
      }}
    />
  )
}

const OGIcon = () => {
  return (
    <KickOGBadge
      style={{
        fill: 'currentcolor',
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        marginLeft: '4px',
      }}
    />
  )
}

const VIPIcon = () => {
  return (
    <KickVIPBadge
      style={{
        width: 16,
        height: 16,
        verticalAlign: 'middle',
        marginLeft: '4px',
      }}
    />
  )
}

const KekEmote = () => {
  return (
    <img
      src="/images/kekw-emote-twitch.avif"
      alt="kekw"
      width="22"
      height="22"
    />
  )
}

const ClapEmote = () => {
  return (
    <img src="/images/clap-emote-kick.gif" alt="clap" width="22" height="22" />
  )
}

const PogEmote = () => {
  return (
    <img src="/images/pog-emote-kick.png" alt="pog" width="22" height="22" />
  )
}

export const NextGenChatSection = () => {
  const { classes } = useStyles()
  const parallax = useParallax({
    speed: -10,
    translateY: ['30vh', '-200vh'],
  })

  return (
    <div className={classes.wrapper}>
      <Container className={classes.inner}>
        <Box className={classes.subtleContainer}>
          <h2 className={classes.title}>Next-Gen Chat</h2>
          <Box className={classes.chatContainer}>
            <Box ref={parallax.ref} px={30}>
              <Box>
                <SenderText isverified="true">
                  The President
                  <VerifiedIcon />
                </SenderText>
                <MessageText>
                  {' '}
                  <KekEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText>Streamer Guru</SenderText>
                <MessageText> OMG! That was insane!</MessageText>
              </Box>
              <Box>
                <SenderText>PogChampFanatic</SenderText>
                <MessageText> KEKW! That reaction was priceless!</MessageText>
              </Box>
              <Box>
                <SenderText ismod="true">
                  ModMan
                  <ModIcon />
                </SenderText>
                <MessageText> PogChamp! You're killing it!</MessageText>
              </Box>
              <Box>
                <SenderText>LULmaster</SenderText>
                <MessageText>
                  {' '}
                  Haha, that was epic! <KekEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">
                  DogeOiler
                  <KickGift200Icon />
                </SenderText>
                <MessageText> Can't stop laughing! XD</MessageText>
              </Box>
              <Box>
                <SenderText>EpicGamer99</SenderText>
                <MessageText> Nice play, bro!</MessageText>
              </Box>
              <Box>
                <SenderText>KappaKing</SenderText>
                <MessageText>
                  {' '}
                  <KekEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText>EmoteEnthusiast</SenderText>
                <MessageText> Incredible skills!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">
                  ChatOverlord
                  <VIPIcon />
                  <OGIcon />
                </SenderText>
                <MessageText> Poggers! Keep it up!</MessageText>
              </Box>
              <Box>
                <SenderText>KEKW Queen</SenderText>
                <MessageText>
                  {' '}
                  <PogEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText>ClutchMasterFlex</SenderText>
                <MessageText> OMG, I can't believe that happened!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">
                  LaughingLad
                  <OGIcon />
                </SenderText>
                <MessageText> You're on fire!</MessageText>
              </Box>
              <Box>
                <SenderText>Poggers Pro</SenderText>
                <MessageText>
                  {' '}
                  <PogEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">Skilled Clipper</SenderText>
                <MessageText> That move was 200 IQ!</MessageText>
              </Box>
              <Box>
                <SenderText>MonkaSMaster</SenderText>
                <MessageText>
                  {' '}
                  <ClapEmote />
                  <ClapEmote />
                  <ClapEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText>Giggle Genie</SenderText>
                <MessageText> Woot woot! Go, go, go!</MessageText>
              </Box>
              <Box>
                <SenderText ismod="true">
                  ReactionaryRuler
                  <ModIcon />
                </SenderText>
                <MessageText> Keep slaying it, my dude!</MessageText>
              </Box>
              <Box>
                <SenderText>EpicnessEmpire</SenderText>
                <MessageText>
                  {' '}
                  Hilarious! My sides hurt from laughing!
                </MessageText>
              </Box>
              <Box>
                <SenderText>Chat Commander</SenderText>
                <MessageText>
                  {' '}
                  MonkaS! My heart can't handle this excitement!
                </MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">Dank Meme Lord</SenderText>
                <MessageText> What a legend!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">LOLinator</SenderText>
                <MessageText> PogU! I'm amazed!</MessageText>
              </Box>
              <Box>
                <SenderText>PogUConnoisseur</SenderText>
                <MessageText> You're making this look easy!</MessageText>
              </Box>
              <Box>
                <SenderText>Stream Sensation</SenderText>
                <MessageText> Haha, chat is going wild!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">Joke Junkie</SenderText>
                <MessageText> FeelsGoodMan to watch this!</MessageText>
              </Box>
              <Box>
                <SenderText>PogChampChampion</SenderText>
                <MessageText> Insane skills, bro!</MessageText>
              </Box>
              <Box>
                <SenderText>Emote Expert</SenderText>
                <MessageText> Wow! You're a pro!</MessageText>
              </Box>
              <Box>
                <SenderText>LULzMachine</SenderText>
                <MessageText>
                  {' '}
                  <KekEmote /> this is too funny!
                </MessageText>
              </Box>
              <Box>
                <SenderText>GamerGoddess</SenderText>
                <MessageText> Poggers! This stream is a gem!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">KappaConductor</SenderText>
                <MessageText> You're the GOAT!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">KEKWClown</SenderText>
                <MessageText> Keep entertaining us!</MessageText>
              </Box>
              <Box>
                <SenderText>Reaction Sensei</SenderText>
                <MessageText>
                  {' '}
                  Claps in the chat for that play! <ClapEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText>Poggers Pundit</SenderText>
                <MessageText> I'm in awe of your talent!</MessageText>
              </Box>
              <Box>
                <SenderText isverified="true">
                  ChatComedian
                  <VerifiedIcon />
                  <VIPIcon />
                </SenderText>
                <MessageText> This stream is lit AF!</MessageText>
              </Box>
              <Box>
                <SenderText>Epic Emoter</SenderText>
                <MessageText>
                  {' '}
                  <PogEmote />
                  <PogEmote />
                  <PogEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">
                  ROFLRoyalty
                  <KickGift50Icon />
                </SenderText>
                <MessageText>
                  {' '}
                  I'm telling all my friends about this stream!
                </MessageText>
              </Box>
              <Box>
                <SenderText>MonkaSMaestro</SenderText>
                <MessageText> You're a legend in the making!</MessageText>
              </Box>
              <Box>
                <SenderText ismod="true">
                  Giggle Giver
                  <ModIcon />
                  <OGIcon />
                </SenderText>
                <MessageText> Such positive vibes here! Love it!</MessageText>
              </Box>
              <Box>
                <SenderText>StreamerStar</SenderText>
                <MessageText> Wholesome content right there!</MessageText>
              </Box>
              <Box>
                <SenderText>SkillfulSpectator</SenderText>
                <MessageText> That's going in the highlight reel!</MessageText>
              </Box>
              <Box>
                <SenderText>ReactionWatcher</SenderText>
                <MessageText> Your skills are on another level!</MessageText>
              </Box>
              <Box>
                <SenderText ismod="true">
                  PogUProdigy
                  <ModIcon />
                </SenderText>
                <MessageText> I'm having a blast watching this!</MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">
                  LOLzLover
                  <KickGift200Icon />
                </SenderText>
                <MessageText> GG! This stream is amazing!</MessageText>
              </Box>
              <Box>
                <SenderText>EmoteEvangelist</SenderText>
                <MessageText>
                  {' '}
                  Poggers in the chat! <PogEmote />
                </MessageText>
              </Box>
              <Box>
                <SenderText>KappaKollector</SenderText>
                <MessageText>
                  {' '}
                  I'm officially addicted to this stream!
                </MessageText>
              </Box>
              <Box>
                <SenderText ismember="true">HahaHype</SenderText>
                <MessageText> Thanks for making my day!</MessageText>
              </Box>
            </Box>
          </Box>
          <Box opacity={0.66} mt={18} px="lg">
            Combine live stream chats from your favorite platforms into one.
            Currently supports YouTube, Kick, Twitch, and TikTok live streams.
          </Box>
        </Box>
      </Container>
    </div>
  )
}

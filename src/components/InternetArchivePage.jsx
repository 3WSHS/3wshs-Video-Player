import React, { useEffect, useState } from 'react';
import myPantherThumb from '../images/my-panther-thumb.jpg';
import tomAndJerryThumb from '../images/tom-and-jerry-wallpaper.jpg';
import ppEpisodeThumb from '../images/pp-episode-thumbnail.jpg';
import pokemonThumb from '../images/pokemon-thumbnail.jpg';
import pokemonEpisodeThumb from '../images/pokemon-episode.jpg';
import orangeIslandsThumb from '../images/orange-islands-title.jpg';
import orangeIslandsEpisodeThumb from '../images/og-islands.jpg';
import scoobyDooThumb from '../images/Scooby-Doo-title.jpeg';
import scoobyDooEpisodeThumb from '../images/Whats-new-epsiode.png';
import scoobyShowThumb from '../images/scooby-show.jpg';
import scoobyShowEpisodeThumb from '../images/show-episode.jpeg';
import scoobyShowS2Thumb from '../images/sd-season-two.jpg';
import scoobyShowS2EpisodeThumb from '../images/Scooby-doo-season-two-episode.jpg';
import scoobyShowS3Thumb from '../images/sd-season-three.jpg';
import scoobyShowS3EpisodeThumb from '../images/sd-season-three-episode.jpg';
import newSdTitleThumb from '../images/new-sd-title.jpg';
import newSdEpisodeThumb from '../images/new-sd-episode.jpg';
import deathNoteCover from '../images/death-note-cover.jpg';
import deathNoteEpi from '../images/death-note-epi.jpeg';
import jhotoCover from '../images/jhoto-cover.jpg';
import jhotoEpisode from '../images/jhoto-episode.jpg';
import bfTitleThumb from '../images/bf-title.jpg';
import bfEpisodeThumb from '../images/bf-episode.jpg';
import masterQuestThumb from '../images/master-quest-title.jpg';
import masterQuestEpisodeThumb from '../images/mq-episode.jpg';
import advancedThumb from '../images/advanced-title.jpg';
import advancedEpisodeThumb from '../images/advanced-episode.jpg';
import jlChampionsThumb from '../images/jl-champions.jpg';
import jlChampionsEpisodeThumb from '../images/jl-episode.jpg';
import advancedChallengeThumb from '../images/advanced-challenge.jpg';
import advancedChallengeEpisodeThumb from '../images/ac-episode.png';
import advancedBattleThumb from '../images/pokemon-advanced.jpg';
import advancedBattleEpisodeThumb from '../images/pokemon-battle.jpg';
import pmTitleThumb from '../images/pm-title.jpg';
import pm2TitleThumb from '../images/pm2-title.jpg';
import gbTitleThumb from '../images/gb-title.jpg';
import gbEpisodeThumb from '../images/gb-episode.png';
import msbTitleThumb from '../images/msb-title.jpg';
import msbEpisodeThumb from '../images/msb-episode.jpg';
import shrekTitleThumb from '../images/shrek-title.jpg';
import dmTitleThumb from '../images/dm-title.jpg';
import rataTitleThumb from '../images/rata-title.jpg';
import robotsTitleThumb from '../images/robots-title.jpeg';
import iceTitleThumb from '../images/ice-title.jpg';
import rioTitleThumb from '../images/rio-title.jpeg';
import rioTwoThumb from '../images/rio-two.jpg';
import ghibliTitleThumb from '../images/ghibli-title.jpg';
import cbTitleThumb from '../images/cb-title.jpg';
import dballTitleThumb from '../images/dball-title.jpeg';
import bmTitleThumb from '../images/bm-title.png';

export const COLLECTIONS = [
  {
    key: 'pinkpanther',
    title: 'Pink Panther Collection',
    api: 'https://archive.org/metadata/the-pink-panther-cartoon-collection',
    archiveUrl: 'https://archive.org/details/the-pink-panther-cartoon-collection',
    thumb: myPantherThumb,
    episodeThumb: ppEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/the-pink-panther-cartoon-collection/__ia_thumb.jpg',
      'https://archive.org/download/the-pink-panther-cartoon-collection/item.jpg',
      'https://archive.org/download/the-pink-panther-cartoon-collection/collection.jpg',
      'https://archive.org/download/the-pink-panther-cartoon-collection/folder.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/6b/Pink_Panther.png',
    ],
    description: 'Classic Cartoons',
  },
  {
    key: 'tomandjerry',
    title: 'Tom and Jerry Collection',
    api: 'https://archive.org/metadata/tomandjerry_1080p',
    archiveUrl: 'https://archive.org/details/tomandjerry_1080p',
    thumb: tomAndJerryThumb,
    episodeThumb: tomAndJerryThumb, // fallback to main thumb for now
    fallbackThumbs: [
      'https://archive.org/download/tomandjerry_1080p/__ia_thumb.jpg',
      'https://archive.org/download/tomandjerry_1080p/item.jpg',
      'https://archive.org/download/tomandjerry_1080p/collection.jpg',
      'https://archive.org/download/tomandjerry_1080p/folder.jpg',
    ],
    description: 'Classic Cartoons',
  },
  {
    key: 'pokemon',
    title: 'Pokémon Season 1',
    api: 'https://archive.org/metadata/20220906_20220906_1258',
    archiveUrl: 'https://archive.org/details/20220906_20220906_1258',
    thumb: pokemonThumb,
    episodeThumb: pokemonEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/20220906_20220906_1258/__ia_thumb.jpg',
      'https://archive.org/download/20220906_20220906_1258/item.jpg',
      'https://archive.org/download/20220906_20220906_1258/collection.jpg',
      'https://archive.org/download/20220906_20220906_1258/folder.jpg',
    ],
    description: 'Indigo League Episodes',
  },
  {
    key: 'orangeislands',
    title: 'Pokémon: Adventures on Orange Islands',
    api: 'https://archive.org/metadata/pokemon-adventures-on-orange-islands-the-complete-collection-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-adventures-on-orange-islands-the-complete-collection-4kids-entertainment-english-dub',
    thumb: orangeIslandsThumb,
    episodeThumb: orangeIslandsEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-adventures-on-orange-islands-the-complete-collection-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-adventures-on-orange-islands-the-complete-collection-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-adventures-on-orange-islands-the-complete-collection-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-adventures-on-orange-islands-the-complete-collection-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Orange Islands Episodes',
  },
  {
    key: 'scoobydoo',
    title: "What's New Scooby-Doo (Season 1)",
    api: 'https://archive.org/metadata/whatsnewscoobydooseason1hd',
    archiveUrl: 'https://archive.org/details/whatsnewscoobydooseason1hd',
    thumb: scoobyDooThumb,
    episodeThumb: scoobyDooEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/whatsnewscoobydooseason1hd/__ia_thumb.jpg',
      'https://archive.org/download/whatsnewscoobydooseason1hd/item.jpg',
      'https://archive.org/download/whatsnewscoobydooseason1hd/collection.jpg',
      'https://archive.org/download/whatsnewscoobydooseason1hd/folder.jpg',
    ],
    description: 'Season 1 Episodes',
  },
  {
    key: 'scoobyshow',
    title: 'The Scooby Doo Show (1976) Season 1',
    api: 'https://archive.org/metadata/s-01-e-10-a-frightened-hound-meets-demons-underground',
    archiveUrl: 'https://archive.org/details/s-01-e-10-a-frightened-hound-meets-demons-underground',
    thumb: scoobyShowThumb,
    episodeThumb: scoobyShowEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/s-01-e-10-a-frightened-hound-meets-demons-underground/__ia_thumb.jpg',
      'https://archive.org/download/s-01-e-10-a-frightened-hound-meets-demons-underground/item.jpg',
      'https://archive.org/download/s-01-e-10-a-frightened-hound-meets-demons-underground/collection.jpg',
      'https://archive.org/download/s-01-e-10-a-frightened-hound-meets-demons-underground/folder.jpg',
    ],
    description: '1976 Season 1 Episodes',
  },
  {
    key: 'scoobyshows2',
    title: 'The Scooby Doo Show (1977) Season 2',
    api: 'https://archive.org/metadata/s-02-e-08-the-creepy-heap-from-the-deep',
    archiveUrl: 'https://archive.org/details/s-02-e-08-the-creepy-heap-from-the-deep',
    thumb: scoobyShowS2Thumb,
    episodeThumb: scoobyShowS2EpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/s-02-e-08-the-creepy-heap-from-the-deep/__ia_thumb.jpg',
      'https://archive.org/download/s-02-e-08-the-creepy-heap-from-the-deep/item.jpg',
      'https://archive.org/download/s-02-e-08-the-creepy-heap-from-the-deep/collection.jpg',
      'https://archive.org/download/s-02-e-08-the-creepy-heap-from-the-deep/folder.jpg',
    ],
    description: '1977 Season 2 Episodes',
  },
  {
    key: 'scoobyshows3',
    title: 'The Scooby Doo Show (1978) Season 3',
    api: 'https://archive.org/metadata/scooby-doo-show-3',
    archiveUrl: 'https://archive.org/details/scooby-doo-show-3',
    thumb: scoobyShowS3Thumb,
    episodeThumb: scoobyShowS3EpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/scooby-doo-show-3/__ia_thumb.jpg',
      'https://archive.org/download/scooby-doo-show-3/item.jpg',
      'https://archive.org/download/scooby-doo-show-3/collection.jpg',
      'https://archive.org/download/scooby-doo-show-3/folder.jpg',
    ],
    description: '1978 Season 3 Episodes',
  },
  {
    key: 'newscoobydook',
    title: 'The New Scooby Doo Mysteries (1984)',
    api: 'https://archive.org/metadata/scooby-doo-mysteries',
    archiveUrl: 'https://archive.org/details/scooby-doo-mysteries',
    thumb: newSdTitleThumb,
    episodeThumb: newSdEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/scooby-doo-mysteries/__ia_thumb.jpg',
      'https://archive.org/download/scooby-doo-mysteries/item.jpg',
      'https://archive.org/download/scooby-doo-mysteries/collection.jpg',
      'https://archive.org/download/scooby-doo-mysteries/folder.jpg',
    ],
    description: '1984 Mysteries Episodes',
  },
  {
    key: 'deathnote',
    title: 'Death Note Complete (2006-2007)',
    api: 'https://archive.org/metadata/death-note-complete-2006-2007',
    archiveUrl: 'https://archive.org/details/death-note-complete-2006-2007',
    thumb: deathNoteCover,
    episodeThumb: deathNoteEpi,
    fallbackThumbs: [
      'https://archive.org/download/death-note-complete-2006-2007/__ia_thumb.jpg',
      'https://archive.org/download/death-note-complete-2006-2007/item.jpg',
      'https://archive.org/download/death-note-complete-2006-2007/collection.jpg',
      'https://archive.org/download/death-note-complete-2006-2007/folder.jpg',
    ],
    description: '37 Episodes',
  },
  {
    key: 'jhoto',
    title: 'Pokémon: The Johto Journeys - The Complete Collection',
    api: 'https://archive.org/metadata/pokemon-the-johto-journeys-the-complete-collection-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-the-johto-journeys-the-complete-collection-4kids-entertainment-english-dub',
    thumb: jhotoCover,
    episodeThumb: jhotoEpisode,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-the-johto-journeys-the-complete-collection-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-the-johto-journeys-the-complete-collection-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-the-johto-journeys-the-complete-collection-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-the-johto-journeys-the-complete-collection-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Johto Journeys Episodes',
  },
  {
    key: 'battlefrontier',
    title: 'Pokémon: Battle Frontier (Season 9)',
    api: 'https://archive.org/metadata/pokemon-battle-frontier-the-complete-collection-tpci-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-battle-frontier-the-complete-collection-tpci-english-dub',
    thumb: bfTitleThumb,
    episodeThumb: bfEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-battle-frontier-the-complete-collection-tpci-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-battle-frontier-the-complete-collection-tpci-english-dub/item.jpg',
      'https://archive.org/download/pokemon-battle-frontier-the-complete-collection-tpci-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-battle-frontier-the-complete-collection-tpci-english-dub/folder.jpg',
    ],
    description: 'Battle Frontier Episodes',
  },
  {
    key: 'masterquest',
    title: 'Pokémon: Master Quest (Season 5)',
    api: 'https://archive.org/metadata/pokemon-master-quest-random-episode-compilation-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-master-quest-random-episode-compilation-4kids-entertainment-english-dub',
    thumb: masterQuestThumb,
    episodeThumb: masterQuestEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-master-quest-random-episode-compilation-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-master-quest-random-episode-compilation-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-master-quest-random-episode-compilation-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-master-quest-random-episode-compilation-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Master Quest Episodes',
  },
  {
    key: 'advanced',
    title: 'Pokémon: Advanced (Season 6)',
    api: 'https://archive.org/metadata/pokemon-advanced-the-complete-collection-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-advanced-the-complete-collection-4kids-entertainment-english-dub',
    thumb: advancedThumb,
    episodeThumb: advancedEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-advanced-the-complete-collection-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-advanced-the-complete-collection-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-advanced-the-complete-collection-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-advanced-the-complete-collection-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Advanced Episodes',
  },
  {
    key: 'jlc',
    title: 'Pokémon: Johto League Champions (Season 4)',
    api: 'https://archive.org/metadata/pokemon-johto-league-champions-the-complete-collection-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-johto-league-champions-the-complete-collection-4kids-entertainment-english-dub',
    thumb: jlChampionsThumb,
    episodeThumb: jlChampionsEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-johto-league-champions-the-complete-collection-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-johto-league-champions-the-complete-collection-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-johto-league-champions-the-complete-collection-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-johto-league-champions-the-complete-collection-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Johto League Champions Episodes',
  },
  {
    key: 'advancedchallenge',
    title: 'Pokémon: Advanced Challenge (Season 7)',
    api: 'https://archive.org/metadata/pokemon-advanced-challenge-the-complete-collection-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-advanced-challenge-the-complete-collection-4kids-entertainment-english-dub',
    thumb: advancedChallengeThumb,
    episodeThumb: advancedChallengeEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-advanced-challenge-the-complete-collection-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-advanced-challenge-the-complete-collection-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-advanced-challenge-the-complete-collection-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-advanced-challenge-the-complete-collection-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Advanced Challenge Episodes',
  },
  {
    key: 'advancedbattle',
    title: 'Pokémon: Advanced Battle (Season 8)',
    api: 'https://archive.org/metadata/pokemon-advanced-battle-the-complete-collection-4kids-entertainment-english-dub',
    archiveUrl: 'https://archive.org/details/pokemon-advanced-battle-the-complete-collection-4kids-entertainment-english-dub',
    thumb: advancedBattleThumb,
    episodeThumb: advancedBattleEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/pokemon-advanced-battle-the-complete-collection-4kids-entertainment-english-dub/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-advanced-battle-the-complete-collection-4kids-entertainment-english-dub/item.jpg',
      'https://archive.org/download/pokemon-advanced-battle-the-complete-collection-4kids-entertainment-english-dub/collection.jpg',
      'https://archive.org/download/pokemon-advanced-battle-the-complete-collection-4kids-entertainment-english-dub/folder.jpg',
    ],
    description: 'Advanced Battle Episodes',
  },
  {
    key: 'kantomovies',
    title: 'Pokémon - Kanto Movie Collection',
    api: 'https://archive.org/metadata/pokemon-kanto-movie-collection',
    archiveUrl: 'https://archive.org/details/pokemon-kanto-movie-collection',
    thumb: pmTitleThumb,
    episodeThumb: pmTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/pokemon-kanto-movie-collection/__ia_thumb.jpg',
      'https://archive.org/download/pokemon-kanto-movie-collection/item.jpg',
      'https://archive.org/download/pokemon-kanto-movie-collection/collection.jpg',
      'https://archive.org/download/pokemon-kanto-movie-collection/folder.jpg',
    ],
    description: 'Kanto Movie Collection',
  },
  {
    key: 'pkmmovies',
    title: 'PKM (Pokémon Movie Collection)',
    api: 'https://archive.org/metadata/haidarpkm',
    archiveUrl: 'https://archive.org/details/haidarpkm',
    thumb: pm2TitleThumb,
    episodeThumb: pm2TitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/haidarpkm/__ia_thumb.jpg',
      'https://archive.org/download/haidarpkm/item.jpg',
      'https://archive.org/download/haidarpkm/collection.jpg',
      'https://archive.org/download/haidarpkm/folder.jpg',
    ],
    description: 'Movie Collection',
  },
  {
    key: 'goosebumps',
    title: 'Goosebumps - TV Series (1995)',
    api: 'https://archive.org/metadata/Goosebumps1995TVSeries',
    archiveUrl: 'https://archive.org/details/Goosebumps1995TVSeries',
    thumb: gbTitleThumb,
    episodeThumb: gbEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/Goosebumps1995TVSeries/__ia_thumb.jpg',
      'https://archive.org/download/Goosebumps1995TVSeries/item.jpg',
      'https://archive.org/download/Goosebumps1995TVSeries/collection.jpg',
      'https://archive.org/download/Goosebumps1995TVSeries/folder.jpg',
    ],
    description: 'Goosebumps Episodes',
  },
  {
    key: 'magicschoolbus',
    title: 'The Magic School Bus - TV Series (1994)',
    api: 'https://archive.org/metadata/MSBTVSeries',
    archiveUrl: 'https://archive.org/details/MSBTVSeries',
    thumb: msbTitleThumb,
    episodeThumb: msbEpisodeThumb,
    fallbackThumbs: [
      'https://archive.org/download/MSBTVSeries/__ia_thumb.jpg',
      'https://archive.org/download/MSBTVSeries/item.jpg',
      'https://archive.org/download/MSBTVSeries/collection.jpg',
      'https://archive.org/download/MSBTVSeries/folder.jpg',
    ],
    description: 'Magic School Bus Episodes',
  },
  {
    key: 'shrek',
    title: 'Shrek (Movie Collection)',
    api: 'https://archive.org/metadata/4-shrek-movies',
    archiveUrl: 'https://archive.org/details/4-shrek-movies',
    thumb: shrekTitleThumb,
    episodeThumb: shrekTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/4-shrek-movies/__ia_thumb.jpg',
      'https://archive.org/download/4-shrek-movies/item.jpg',
      'https://archive.org/download/4-shrek-movies/collection.jpg',
      'https://archive.org/download/4-shrek-movies/folder.jpg',
    ],
    description: 'Shrek Movie Collection',
  },
  {
    key: 'disneymovies',
    title: 'School project 2 (Disney/Animated Movie Collection)',
    api: 'https://archive.org/metadata/schoolproject2_20200406',
    archiveUrl: 'https://archive.org/details/schoolproject2_20200406',
    thumb: dmTitleThumb,
    episodeThumb: dmTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/schoolproject2_20200406/__ia_thumb.jpg',
      'https://archive.org/download/schoolproject2_20200406/item.jpg',
      'https://archive.org/download/schoolproject2_20200406/collection.jpg',
      'https://archive.org/download/schoolproject2_20200406/folder.jpg',
    ],
    description: 'Disney/Animated Movie Collection',
  },
  {
    key: 'ratatouille',
    title: 'Ratatouille HD',
    api: 'https://archive.org/metadata/ratatouille-hd',
    archiveUrl: 'https://archive.org/details/ratatouille-hd',
    thumb: rataTitleThumb,
    episodeThumb: rataTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/ratatouille-hd/__ia_thumb.jpg',
      'https://archive.org/download/ratatouille-hd/item.jpg',
      'https://archive.org/download/ratatouille-hd/collection.jpg',
      'https://archive.org/download/ratatouille-hd/folder.jpg',
    ],
    description: 'Ratatouille Movie',
  },
  {
    key: 'robots',
    title: 'Robots (2005)',
    api: 'https://archive.org/metadata/robots.-2005.720p.-br-rip.x-264.-yify',
    archiveUrl: 'https://archive.org/details/robots.-2005.720p.-br-rip.x-264.-yify',
    thumb: robotsTitleThumb,
    episodeThumb: robotsTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/robots.-2005.720p.-br-rip.x-264.-yify/__ia_thumb.jpg',
      'https://archive.org/download/robots.-2005.720p.-br-rip.x-264.-yify/item.jpg',
      'https://archive.org/download/robots.-2005.720p.-br-rip.x-264.-yify/collection.jpg',
      'https://archive.org/download/robots.-2005.720p.-br-rip.x-264.-yify/folder.jpg',
    ],
    description: 'Robots Movie',
  },
  {
    key: 'iceage',
    title: '5 Ice Age Movies',
    api: 'https://archive.org/metadata/5-ice-age-movies',
    archiveUrl: 'https://archive.org/details/5-ice-age-movies',
    thumb: iceTitleThumb,
    episodeThumb: iceTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/5-ice-age-movies/__ia_thumb.jpg',
      'https://archive.org/download/5-ice-age-movies/item.jpg',
      'https://archive.org/download/5-ice-age-movies/collection.jpg',
      'https://archive.org/download/5-ice-age-movies/folder.jpg',
    ],
    description: 'Ice Age Movie Collection',
  },
  {
    key: 'rio',
    title: 'Rio (2011)',
    api: 'https://archive.org/metadata/rio_20220511_202205',
    archiveUrl: 'https://archive.org/details/rio_20220511_202205',
    thumb: rioTitleThumb,
    episodeThumb: rioTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/rio_20220511_202205/__ia_thumb.jpg',
      'https://archive.org/download/rio_20220511_202205/item.jpg',
      'https://archive.org/download/rio_20220511_202205/collection.jpg',
      'https://archive.org/download/rio_20220511_202205/folder.jpg',
    ],
    description: 'Rio Movie',
  },
  {
    key: 'rio2',
    title: 'Rio 2 (2014)',
    api: 'https://archive.org/metadata/rio-2_202205',
    archiveUrl: 'https://archive.org/details/rio-2_202205',
    thumb: rioTwoThumb,
    episodeThumb: rioTwoThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/rio-2_202205/__ia_thumb.jpg',
      'https://archive.org/download/rio-2_202205/item.jpg',
      'https://archive.org/download/rio-2_202205/collection.jpg',
      'https://archive.org/download/rio-2_202205/folder.jpg',
    ],
    description: 'Rio 2 Movie',
  },
  {
    key: 'ghibli2',
    title: 'Ghibli Collection 2',
    api: 'https://archive.org/metadata/ghibil2',
    archiveUrl: 'https://archive.org/details/ghibil2',
    thumb: ghibliTitleThumb,
    episodeThumb: ghibliTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/ghibil2/__ia_thumb.jpg',
      'https://archive.org/download/ghibil2/item.jpg',
      'https://archive.org/download/ghibil2/collection.jpg',
      'https://archive.org/download/ghibil2/folder.jpg',
    ],
    description: 'Ghibli Movie Collection',
  },
  {
    key: 'cowboybebop',
    title: 'Cowboy Bebop (1998)',
    api: 'https://archive.org/metadata/db-bebop-of-the-cowboys-1080p',
    archiveUrl: 'https://archive.org/details/db-bebop-of-the-cowboys-1080p',
    thumb: cbTitleThumb,
    episodeThumb: cbTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/db-bebop-of-the-cowboys-1080p/__ia_thumb.jpg',
      'https://archive.org/download/db-bebop-of-the-cowboys-1080p/item.jpg',
      'https://archive.org/download/db-bebop-of-the-cowboys-1080p/collection.jpg',
      'https://archive.org/download/db-bebop-of-the-cowboys-1080p/folder.jpg',
    ],
    description: 'Cowboy Bebop Episodes',
  },
  {
    key: 'dragonball',
    title: 'Dragon Ball - COMPLETE (001-153)',
    api: 'https://archive.org/metadata/ikaos-som-dragon-ball-complete-001-153-r2j-dragon-box-multi-audio-v4_202301',
    archiveUrl: 'https://archive.org/details/ikaos-som-dragon-ball-complete-001-153-r2j-dragon-box-multi-audio-v4_202301',
    thumb: dballTitleThumb,
    episodeThumb: dballTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/ikaos-som-dragon-ball-complete-001-153-r2j-dragon-box-multi-audio-v4_202301/__ia_thumb.jpg',
      'https://archive.org/download/ikaos-som-dragon-ball-complete-001-153-r2j-dragon-box-multi-audio-v4_202301/item.jpg',
      'https://archive.org/download/ikaos-som-dragon-ball-complete-001-153-r2j-dragon-box-multi-audio-v4_202301/collection.jpg',
      'https://archive.org/download/ikaos-som-dragon-ball-complete-001-153-r2j-dragon-box-multi-audio-v4_202301/folder.jpg',
    ],
    description: 'Dragon Ball Complete Series',
  },
  {
    key: 'billymandy',
    title: 'The Grim Adventures of Billy and Mandy',
    api: 'https://archive.org/metadata/the-grim-adventures-of-billy-and-mandy_202212',
    archiveUrl: 'https://archive.org/details/the-grim-adventures-of-billy-and-mandy_202212',
    thumb: bmTitleThumb,
    episodeThumb: bmTitleThumb, // fallback to main thumb for all
    fallbackThumbs: [
      'https://archive.org/download/the-grim-adventures-of-billy-and-mandy_202212/__ia_thumb.jpg',
      'https://archive.org/download/the-grim-adventures-of-billy-and-mandy_202212/item.jpg',
      'https://archive.org/download/the-grim-adventures-of-billy-and-mandy_202212/collection.jpg',
      'https://archive.org/download/the-grim-adventures-of-billy-and-mandy_202212/folder.jpg',
    ],
    description: 'Billy and Mandy Episodes',
  },
];

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function InternetArchivePage() {
  const [openCollection, setOpenCollection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbs, setThumbs] = useState(COLLECTIONS.map(c => c.thumb));
  const [counts, setCounts] = useState([null, null, null, null, null]);
  const [modalVideo, setModalVideo] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [cache, setCache] = useState({});

  // Fetch video list for a collection with caching
  const fetchVideos = (collectionIdx) => {
    setLoading(true);
    setError(null);

    // Check cache first
    if (cache[collectionIdx]) {
      const cachedData = cache[collectionIdx];
      setAllFiles(cachedData.files);
      setVideos(cachedData.videos);
      setLoading(false);
      return;
    }

    fetch(COLLECTIONS[collectionIdx].api)
      .then(res => res.json())
      .then(data => {
        const files = (data.files || []).filter(f => f.name);
        const videoFiles = files.filter(f => f.name && (f.name.endsWith('.mp4') || f.name.endsWith('.mkv')));
        
        // Cache the results
        setCache(prev => ({
          ...prev,
          [collectionIdx]: {
            files,
            videos: videoFiles
          }
        }));

        setAllFiles(files);
        setVideos(videoFiles);
        setCounts(prev => {
          const next = [...prev];
          next[collectionIdx] = videoFiles.length;
          return next;
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load videos from Internet Archive.');
        setLoading(false);
      });
  };

  // Handle thumbnail error fallback
  const handleImgError = (idx) => {
    setThumbs(prev => {
      const currentThumb = prev[idx];
      const c = COLLECTIONS[idx];
      const fallbackIdx = c.fallbackThumbs.indexOf(currentThumb);
      let nextThumb = c.fallbackThumbs[fallbackIdx + 1] || c.fallbackThumbs[c.fallbackThumbs.length - 1];
      if (fallbackIdx === -1) nextThumb = c.fallbackThumbs[0];
      const next = [...prev];
      next[idx] = nextThumb;
      return next;
    });
  };

  // Pre-fetch counts for both collections with caching
  useEffect(() => {
    COLLECTIONS.forEach((col, idx) => {
      // Check cache first
      if (cache[idx]) {
        setCounts(prev => {
          const next = [...prev];
          next[idx] = cache[idx].videos.length;
          return next;
        });
        return;
      }

      fetch(col.api)
        .then(res => res.json())
        .then(data => {
          const files = (data.files || []).filter(f => f.name && (f.name.endsWith('.mp4') || f.name.endsWith('.mkv')));
          setCounts(prev => {
            const next = [...prev];
            next[idx] = files.length;
            return next;
          });
        });
    });
  }, [cache]);

  // When a collection is opened, fetch its videos
  useEffect(() => {
    if (openCollection !== null) {
      fetchVideos(openCollection);
    }
  }, [openCollection]);

  // Modal close handler
  const handleCloseModal = () => setModalVideo(null);

  // In the episode card rendering, deduplicate by base name and prefer .mp4 over .mkv
  const dedupedVideos = Object.values(
    videos.reduce((acc, video) => {
      const baseName = video.name.replace(/\.(mp4|mkv)$/i, '');
      // If not seen, or if this is .mp4 and previous is .mkv, use this one
      if (!acc[baseName] || (video.name.endsWith('.mp4') && acc[baseName].name.endsWith('.mkv'))) {
        acc[baseName] = video;
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    function handleOpenCollection(e) {
      const key = e.detail;
      const idx = COLLECTIONS.findIndex(col => col.key === key);
      if (idx !== -1) setOpenCollection(idx);
    }
    window.addEventListener('openInternetArchiveCollection', handleOpenCollection);
    return () => window.removeEventListener('openInternetArchiveCollection', handleOpenCollection);
  }, []);

  // Add loading state UI
  const renderLoadingState = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
      gap: 32,
      padding: '20px 0'
    }}>
      {[...Array(6)].map((_, idx) => (
        <div key={idx} style={{ 
          background: '#23283a', 
          borderRadius: 14, 
          padding: 18, 
          height: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          animation: 'pulse 1.5s infinite'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 200,
            height: 120,
            background: '#181c24',
            borderRadius: 10,
            marginBottom: 10
          }} />
          <div style={{
            width: '80%',
            height: 20,
            background: '#181c24',
            borderRadius: 4,
            marginBottom: 10
          }} />
          <div style={{
            width: '60%',
            height: 20,
            background: '#181c24',
            borderRadius: 4
          }} />
        </div>
      ))}
    </div>
  );

  // Add keyframes for loading animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.8; }
      100% { opacity: 0.6; }
    }
  `;
  document.head.appendChild(style);

  return (
    <div style={{ width: '100%', padding: 32 }}>
      <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, marginBottom: 18 }}>Internet Archive Collections</h2>
      <p style={{ color: '#b3b8c5', marginBottom: 32 }}>
        Browse classic cartoon collections from the <a href="https://archive.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#4f8cff' }}>Internet Archive</a>
      </p>
      {openCollection === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {chunkArray(COLLECTIONS, 5).map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 8 }}>
              {row.map((col, idx) => {
                const globalIdx = rowIdx * 5 + idx;
                return (
                  <div
                    key={col.key}
                    style={{
                      maxWidth: 340,
                      aspectRatio: '2 / 3',
                      background: '#181c24',
                      borderRadius: 18,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      margin: '0 auto',
                    }}
                    onClick={() => setOpenCollection(globalIdx)}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
                    }}
                  >
                    <img
                      src={thumbs[globalIdx]}
                      alt={col.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      onError={() => handleImgError(globalIdx)}
                    />
                    {/* Gradient overlay for title */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '40%',
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)',
                      zIndex: 2,
                      borderBottomLeftRadius: 18,
                      borderBottomRightRadius: 18,
                    }} />
                    <div style={{
                      position: 'relative',
                      zIndex: 3,
                      color: '#fff',
                      textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                      padding: '0 20px 20px 20px',
                      width: '100%',
                    }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{col.title}</h3>
                      <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 16 }}>{counts[globalIdx] !== null ? `${counts[globalIdx]} ${col.description}` : 'Loading...'}</p>
                      <div style={{
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        backdropFilter: 'blur(4px)',
                        display: 'inline-block',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                      }}>
                        Click to Browse All Videos
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <>
          <button
            onClick={() => setOpenCollection(null)}
            style={{
              marginBottom: 24,
              background: '#23283a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 22px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              transition: 'background 0.18s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 4}}>
              <path d="M11.25 14.25L6.75 9L11.25 3.75" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Collections
          </button>
          <a href={COLLECTIONS[openCollection].archiveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4f8cff', marginBottom: 18, display: 'inline-block', fontSize: '1.1rem' }}>
            View on Archive.org ↗
          </a>
          {openCollection !== null && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 16 }}>
              <button
                onClick={() => {
                  dedupedVideos.forEach(video => {
                    const videoUrl = `${COLLECTIONS[openCollection].archiveUrl.replace('/details/', '/download/')}/${video.name}`;
                    const a = document.createElement('a');
                    a.href = videoUrl;
                    a.download = video.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  });
                }}
                style={{
                  background: '#4f8cff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 22px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: 0,
                }}
              >
                Download All
              </button>
              <span style={{ color: '#b3b8c5', fontSize: '0.98rem', maxWidth: 400 }}>
                Tip: Your browser may prompt you to allow multiple downloads. Downloads will go to your default folder unless you have 'Ask where to save' enabled in your browser settings.
              </span>
            </div>
          )}
          {loading ? (
            renderLoadingState()
          ) : error ? (
            <div style={{ color: '#ff4f4f', padding: 32 }}>{error}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
              {dedupedVideos.map((video, idx) => {
                const videoUrl = `${COLLECTIONS[openCollection].archiveUrl.replace('/details/', '/download/')}/${video.name}`;
                const baseName = video.name.replace(/\.(mp4|mkv)$/i, '');
                const imageFile = allFiles.find(f =>
                  f.name && (
                    f.name === baseName + '.jpg' ||
                    f.name === baseName + '.jpeg' ||
                    f.name === baseName + '.png'
                  )
                );
                const thumbUrl = imageFile
                  ? `${COLLECTIONS[openCollection].archiveUrl.replace('/details/', '/download/')}/${imageFile.name}`
                  : COLLECTIONS[openCollection].episodeThumb;
                return (
                  <div key={video.name + idx} style={{ background: '#23283a', borderRadius: 14, padding: 18, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minHeight: 260 }}>
                    <img
                      src={thumbUrl}
                      alt={baseName}
                      style={{
                        width: '100%',
                        maxWidth: 200,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 10,
                        marginBottom: 10,
                        background: '#181c24',
                      }}
                      onError={e => { e.target.onerror = null; e.target.src = COLLECTIONS[openCollection].episodeThumb; }}
                    />
                    <div style={{ fontWeight: 600, marginBottom: 10, textAlign: 'center', minHeight: 40 }}>{baseName}</div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 8, marginTop: 8 }}>
                      <button
                        style={{
                          background: '#4f8cff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 18px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          transition: 'background 0.18s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                        onClick={() => setModalVideo({ 
                          name: video.name, 
                          url: videoUrl,
                          thumb: thumbUrl,
                          baseName: baseName
                        })}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.18"/>
                          <polygon points="8,6 16,10 8,14" fill="#fff"/>
                        </svg>
                        Play
                      </button>
                      <a
                        href={videoUrl}
                        download={video.name}
                        style={{
                          background: '#4f8cff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 18px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          transition: 'background 0.18s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          textDecoration: 'none',
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.18"/>
                          <path d="M10 5v7m0 0l-3-3m3 3l3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download
                      </a>
                    </div>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4f8cff', marginTop: 8 }}>View on Archive.org</a>
                  </div>
                );
              })}
            </div>
          )}
          {/* Modal popup player */}
          {modalVideo && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.85)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={handleCloseModal}
            >
              <div
                style={{
                  background: '#181c24',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  position: 'relative',
                  maxWidth: 720,
                  width: '90vw',
                  maxHeight: '80vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseModal}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: 32,
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                  title="Close"
                >
                  &times;
                </button>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 18, textAlign: 'center' }}>{modalVideo.name.replace(/\.(mp4|mkv)$/i, '')}</div>
                <video
                  src={modalVideo.url}
                  controls
                  autoPlay
                  style={{ width: '100%', maxHeight: '60vh', borderRadius: 12, background: '#000' }}
                  onPlay={() => {
                    // Dispatch event to add to recently played
                    window.dispatchEvent(new CustomEvent('videoPlayed', { 
                      detail: {
                        name: modalVideo.name,
                        url: modalVideo.url,
                        thumb: modalVideo.thumb,
                        baseName: modalVideo.baseName
                      }
                    }));
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default InternetArchivePage; 
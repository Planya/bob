import { Injectable } from '@nestjs/common'
import { configService } from './config/config.service'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import TwitchApi from 'node-twitch'
import { ChannelEntity } from './entities/channel.entity'
import { ChannelDTO } from './dto/channel.dto'
import { VideoEntity } from './entities/video.entity'
import { VideoDTO } from './dto/video.dto'
import { AnnouncementEntity } from './entities/announcement.entity'
import { AnnouncementDTO } from './dto/announcement.dto'
import { ReactEntity } from './entities/react.entity'
import { ReactDTO } from './dto/react.dto'
import * as moment from 'moment'
import axios from 'axios'
import config from './commands/config'
import { ActivityType, AttachmentBuilder, EmbedBuilder } from 'discord.js'
const { URLSearchParams } = require('url')

let lastStream = null

@Injectable()
export class AppService {
  client: any
  api_key: string
  twitch: TwitchApi

  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,

    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,

    @InjectRepository(AnnouncementEntity)
    private announcementRepository: Repository<AnnouncementEntity>,

    @InjectRepository(ReactEntity)
    private reactRepository: Repository<ReactEntity>,
  ) {
    this.twitch = new TwitchApi({
      client_id: configService.getTWClient(),
      client_secret: configService.getTWSecret()
    })
  }

  setClient(client: any) {
    this.client = client
  }

  checkChannel(
    channel_id: string,
    server_id: string,
  ): Promise<{ status: number; channel?: ChannelDTO }> {
    return new Promise(async (resolve, reject) => {
      try {
        const channel: ChannelDTO = await this.channelRepository.findOne({
          where: { channel_id, server_id },
        })

        if (channel) {
          resolve({ status: 200, channel })
        } else {
          resolve({ status: 400 })
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  createChannel(channel: ChannelDTO): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      const channelRow: ChannelDTO = new ChannelEntity()
      Object.assign(channelRow, {
        ...channel,
      })

      try {
        await this.channelRepository.save(
          this.channelRepository.create(channelRow),
        )
        resolve({ status: 200 })
      } catch (error) {
        resolve({ status: 400 })
      }
    })
  }

  saveChannel(channel: ChannelDTO): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        const channelRow: ChannelDTO = channel
        await this.channelRepository.save(channelRow)
        resolve({ status: 200 })
      } catch (error) {
        resolve({ status: 400 })
      }
    })
  }

  deleteChannel(channel_id: string, server_id: string): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        const channel: ChannelDTO = await this.channelRepository.findOne({
          where: { channel_id, server_id },
        })

        if (channel) {
          await this.channelRepository.delete(channel)
          resolve({ status: 200 })
        } else {
          resolve({ status: 400 })
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  checkAnnouncement(
    channel_id: string,
    server_id: string,
  ): Promise<{ status: number; announcement?: AnnouncementDTO }> {
    return new Promise(async (resolve, reject) => {
      try {
        const announcement: AnnouncementDTO = await this.announcementRepository.findOne({
          where: { channel_id, server_id },
        })

        if (announcement) {
          resolve({ status: 200, announcement })
        } else {
          resolve({ status: 400 })
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  createAnnouncement(announcement: AnnouncementDTO): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      const announcementRow: AnnouncementDTO = new AnnouncementEntity();
      Object.assign(announcementRow, {
        ...announcement,
      })

      try {
        await this.announcementRepository.save(
          this.announcementRepository.create(announcementRow),
        )
        resolve({ status: 200 })
      } catch (error) {
        resolve({ status: 400 })
      }
    })
  }

  saveAnnouncement(announcement: AnnouncementDTO): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        const announcementRow: AnnouncementDTO = announcement
        await this.announcementRepository.save(announcementRow)
        resolve({ status: 200 })
      } catch (error) {
        resolve({ status: 400 })
      }
    })
  }

  deleteAnnouncement(channel_id: string, server_id: string): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        const announcement: AnnouncementDTO = await this.announcementRepository.findOne({
          where: { channel_id, server_id },
        })

        if (announcement) {
          await this.announcementRepository.delete(announcement)
          resolve({ status: 200 })
        } else {
          resolve({ status: 400 })
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  checkReact(
    channel_id: string,
    message_id: string,
    emoji: string,
    role_id: string
  ): Promise<{ status: number; react?: ReactDTO }> {
    return new Promise(async (resolve, reject) => {
      try {
        const react: ReactDTO = await this.reactRepository.findOne({
          where: { channel_id, message_id, emoji, role_id },
        })

        if (react) {
          resolve({ status: 200, react })
        } else {
          resolve({ status: 400 })
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  createReact(react: ReactDTO): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      const reactRow: ReactDTO = new ReactEntity()
      Object.assign(reactRow, {
        ...react,
      })

      try {
        await this.reactRepository.save(
          this.reactRepository.create(reactRow),
        )
        resolve({ status: 200 })
      } catch (error) {
        resolve({ status: 400 })
      }
    })
  }

  deleteReact(
    channel_id: string,
    message_id: string,
    emoji: string,
    role_id: string
  ): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        const react: ReactDTO = await this.reactRepository.findOne({
          where: { channel_id, message_id, emoji, role_id },
        })

        if (react) {
          await this.reactRepository.delete(react)
          resolve({ status: 200 })
        } else {
          resolve({ status: 400 })
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  async getReacts(): Promise<ReactDTO[]> {
    const data: ReactDTO[] = await this.reactRepository.find()
    return data
  }

  clearGuildData(server_id: string): Promise<{ status: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.channelRepository.createQueryBuilder()
          .delete()
          .where({ server_id })
        await this.announcementRepository.createQueryBuilder()
          .delete()
          .where({ server_id })

        resolve({ status: 200 })
      } catch (error) {
        console.log(error)
      }
    })
  }

  async sendBotEvent(video: VideoDTO) {
    let eventType = 'video'
    if (video.stream && video.isLive) {
      eventType = 'live'
    } else if (video.stream && !video.isLive) {
      eventType = 'announcement'
    }

    const videoId: string = video.videoId
    const url = config.dataUrls.youtubeOembed(videoId)
    const videoUrl = config.dataUrls.youtubeVideo(videoId)
    const dataOembed: any = (await axios.get(url)).data
    let msg = ''
    if (eventType === 'announcement') {
      msg = `📆 МСК ${moment(video.start_time).format('HH:mm DD.MM.YYYY')}\n📢 Анонс стрима - ${dataOembed.author_name}`
    } else if (eventType === 'video') {
      msg = `📺 ${dataOembed.author_name}\nВышло новое видео`
    } else {
      msg = `🔴 ${dataOembed.author_name}\nСтрим начался`
      this.client.user.setActivity(`${dataOembed.author_name} - ${video.description}`, {
        type: ActivityType.Watching,
      })
      lastStream = video.id
    }

    const attachment = new AttachmentBuilder(dataOembed.thumbnail_url, { name: `${dataOembed.author_name}.jpg` })
    const embed = new EmbedBuilder()
      .setTitle(msg)
      .setDescription(`<${videoUrl}>`)
      .setImage(`attachment://${attachment.name}`)
      .addFields(
        { name: `${eventType === 'video' ? 'Видео' : 'Тема стрима'}`, value: `${dataOembed.title}`, inline: true },
        { name: `${eventType === 'video' ? 'Тема' : 'Игра'}`, value: `Если б я знал /ᐠ｡ꞈ｡ᐟ\\`, inline: true }
      )

    const guilds = await this.channelRepository.createQueryBuilder()
      .select('server_id')
      .where({ channel_id: video.channel_id })
      .distinct(true)
      .getRawMany()

    for (const guild of guilds) {
      const announcement: AnnouncementDTO = await this.announcementRepository.findOne({
        where: { server_id: guild.server_id }
      })

      if (announcement) {
        this.client.channels
        .fetch(announcement.channel_id)
        .then((channel: any) => {
          channel.send({
            content: announcement.ping ? '<:Charlotte_stare1:889519443426807829>  @everyone' : '<:Charlotte_stare1:889519443426807829> ',
            embeds: [embed],
            files: [attachment]
          })
        })
        .catch(console.error)
      }
    }
  }

  async getVideoInfo(videoId: string, channelId: string): Promise<any> {
    const videoObject: any = await this.videoRepository.find({
      where: [{ videoId: videoId }],
    })

    if (videoObject.length === 0) {
      const vData: any = await axios.get(
        config.dataUrls.youtubeVideoInfo(videoId, config.yt_api_key),
      )

      this.logData(vData, 'getVideoInfo')

      if (vData.data.items.length > 0) {
        let isStream = false
        let isOffline = false
        if (vData.data.items[0].snippet.liveBroadcastContent === 'upcoming') {
          isStream = true
        } else if (
          vData.data.items[0].snippet.liveBroadcastContent === 'live'
        ) {
          isStream = true
          isOffline = true
        }

        const itemThumbnails = vData.data.items[0].snippet.thumbnails
        const newLive = new VideoEntity()
        Object.assign(newLive, {
          channel_id: channelId,
          videoId: videoId,
          url: config.dataUrls.youtubeVideo(videoId),
          description: vData.data.items[0].snippet.title,
          image: itemThumbnails.standard.url,
          isLive: isOffline,
          stream: isStream,
          start_time: vData.data.items[0]?.liveStreamingDetails?.scheduledStartTime || null
        })

        await this.videoRepository.save(newLive)
        await this.sendBotEvent(newLive)
      }
    }
  }

  @Cron('0 * * * * *')
  async checkStreamsStatus() {
    const streams: any = await this.videoRepository.find({
      where: [
        { isLive: true, stream: true },
      ],
    })

    const ids = streams.map((m) => m.videoId).join(',')
    let vData: any = []

    if (streams.length > 0) {
      const data: any = await axios.get(
        config.dataUrls.youtubeVideoInfo(ids, config.yt_api_key),
      )
      vData = data.data.items
    }

    for (const videoObject of vData) {
      const dbVideoObject = streams.find((f) => f.videoId === videoObject.id)
      if (dbVideoObject) {
        const currentLive = new VideoEntity()
        if (
          !dbVideoObject.isLive &&
          videoObject.snippet.liveBroadcastContent === 'live'
        ) {
          const obj = { isLive: true };
          Object.assign(currentLive, {
            ...dbVideoObject,
            ...obj,
          })

          await this.videoRepository.save(currentLive)
          await this.sendBotEvent(currentLive)
        } else if (
          dbVideoObject.isLive &&
          videoObject.snippet.liveBroadcastContent !== 'live'
        ) {
          const obj = { isLive: false, stream: false };
          Object.assign(currentLive, {
            ...dbVideoObject,
            ...obj,
          })

          this.client.user.setActivity(config.bot.rpc, {
            type: ActivityType.Listening,
          })

          await this.videoRepository.save(currentLive)
        } else if (
          dbVideoObject.isLive &&
          videoObject.snippet.liveBroadcastContent === 'live' &&
          (lastStream === dbVideoObject.id || !lastStream)
        ) {
          this.client.user.setActivity(`${videoObject.snippet.channelTitle}. Зрители: ${videoObject?.liveStreamingDetails?.concurrentViewers}`, {
            type: ActivityType.Watching,
          })
        }
      }
    }
  }

  @Cron('0 0 */12 * * *')
  async autoUpdateSubs() {
    if (!configService.isProduction()) return

    const channels: ChannelDTO[] = await this.channelRepository.createQueryBuilder()
      .select('channel_id')
      .where('is_twitch = :twitch', { twitch: false })
      .distinct(true)
      .getRawMany()

    const requests = []
    for (let i = 0; i < channels.length; i++) {
      const url = 'https://pubsubhubbub.appspot.com/subscribe'
      const formData = new URLSearchParams({
        'hub.callback': config.dataUrls.callback,
        'hub.topic': `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channels[i].channel_id}`,
        'hub.verify': 'async',
        'hub.mode': 'subscribe',
        'hub.verify_token': '',
        'hub.secret': '',
        'hub.lease_seconds': '',
      })

      requests.push(axios.post(url, formData))
    }

    Promise.all(requests)
      .then(() => {
        console.log('Обновлены подписки на каналы')
      })
      .catch((error) => {
        this.logData(error, 'autoUpdateSubs')
        console.log(error)
      })
  }

  logData(data: any, logName?: string) {
    this.client.channels
      .fetch(configService.getLogChannel())
      .then((channel: any) => {
        channel.send(`${moment().format('DD.MM.YYYY HH:mm:ss')} LOG:${logName ? ` ${logName}\n` : '\n'}`+'```'+JSON.stringify(data)+'```');
      })
      .catch(console.error)
  }

  @Cron('0 * * * * *')
  async checkTwitchChannels() {
    const channels: ChannelDTO[] = await this.channelRepository.find({
      where: [
        { is_twitch: true },
      ],
    })

    const filteredChannels = channels.filter((value, index, self) => {
      return self.findIndex(f => f.server_id === value.server_id) === index
    })

    for (const channel of filteredChannels) {
      try {
        const streamData = await this.twitch.getStreams({ channel: channel.channel_id })
        if (!channel.is_live && streamData?.data?.length && streamData.data[0].type === 'live') {
          if (channel.last_live_date) {
            const d1 = moment(channel.last_live_date)
            const d2 = moment(new Date())
            const diff = d2.diff(d1, 'minutes')
            const needDiff = 30
            if (diff < needDiff) return
          }

          const stream = streamData.data[0]
          const channelName = stream.user_name
          const guilds = await this.channelRepository.createQueryBuilder()
            .select('server_id')
            .where({ channel_id: channel.channel_id })
            .distinct(true)
            .getRawMany()
          for (const guild of guilds) {
            const announcement: AnnouncementDTO = await this.announcementRepository.findOne({
              where: { server_id: guild.server_id }
            })
      
            const msg = `🔴 ${channelName} в эфире на Twitch!`
            const imageUrl = stream.getThumbnailUrl()
            const attachment = new AttachmentBuilder(imageUrl, { name: `${channelName}.jpg` })

            channel.is_live = true
            channel.last_live_date = new Date()
            await this.saveChannel(channel)

            this.client.user.setActivity(`${channelName}. Зрители: ${stream.viewer_count}`, {
              type: ActivityType.Watching,
            });

            const embed = new EmbedBuilder()
              .setTitle(msg)
              .setDescription(`<https://www.twitch.tv/${stream.user_login}>`)
              .setImage(`attachment://${attachment.name}`)
              .addFields(
                { name: 'Тема стрима', value: `${stream.title}`, inline: true },
                { name: 'Игра', value: `${stream.game_name ? stream.game_name : 'Если б я знал /ᐠ｡ꞈ｡ᐟ\\'}`, inline: true }
              )
      
            if (announcement) {
              this.client.channels
              .fetch(announcement.channel_id)
              .then((channel: any) => {
                channel.send({
                  content: announcement.ping ? '<:heart:887417941564481536> @everyone' : '<:heart:887417941564481536>',
                  embeds: [embed],
                  files: [attachment]
                });
              })
              .catch(console.error)
            }
          }
        } else if (channel.is_live && (streamData?.data?.length && streamData.data[0].type === 'live')) {
          const stream = streamData.data[0]
          this.client.user.setActivity(`${stream.user_name}. Зрители: ${stream.viewer_count}`, {
            type: ActivityType.Watching,
          })
        } else if (channel.is_live && (
          !streamData?.data?.length ||
          (streamData?.data?.length && streamData.data[0].type !== 'live')
        )) {
          this.client.user.setActivity(config.bot.rpc, {
            type: ActivityType.Watching,
          })
          channel.is_live = false
          await this.saveChannel(channel)
        }
      } catch (error) {
        console.error(error)
        this.logData(error, 'checkTwitchChannels')
      }
    }
  }
}

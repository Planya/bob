import { EmbedBuilder, ColorResolvable } from 'discord.js'
import { hasChannelEmbed, hasReactionEmbed } from './helpers'
import { AppService } from './../app.service'
import config from './config'

export default class Command {
  public commandName: string
  public isSlash: boolean
  public service: AppService
  public args: any
  public message: any
  public embed: EmbedBuilder
  public config
  public prefix: string = config.bot.prefix

  constructor(commandName: string) {
    this.commandName = commandName
    this.config = config
  }

  public get name() {
    return this.commandName
  }

  public async send(messageData) {
    if (this.isSlash) await this.message.reply(messageData).catch()
    else await this.message.reply(messageData).catch(() => console.log(''))
  }

  public async initCommand(
    message: any,
    args: any,
    service: AppService,
    isSlash: boolean | undefined,
    callBack,
  ) {
    this.message = message
    this.args = args
    this.service = service
    this.isSlash = isSlash ? isSlash : false
    this.embed = new EmbedBuilder().setColor(
      config.bot.badgeColor as ColorResolvable,
    )

    return callBack()
  }

  public getUser() {
    return this.isSlash ? this.message.user : this.message.author
  }

  public replyHasChannel(user) {
    this.send({ embeds: [hasChannelEmbed(user)] })
  }

  public replyHasReact(user) {
    this.send({ embeds: [hasReactionEmbed(user)] })
  }

  public getArgByIndex(index) {
    return this.args[index]
  }

  public getArgString(argName) {
    return this.isSlash
      ? Math.abs(parseInt(this.args.getString(argName)))
      : Math.abs(parseInt(this.args[0]))
  }

  public getArgUser(argName) {
    return this.isSlash
      ? this.args.getUser(argName)
      : this.message.mentions.users.first()
  }
}

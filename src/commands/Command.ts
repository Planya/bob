import { 
  EmbedBuilder,
  ColorResolvable,
  ChatInputCommandInteraction,
  CacheType,
  Message,
  CommandInteractionOptionResolver
} from 'discord.js'
import { hasChannelEmbed, hasReactionEmbed } from './helpers'
import { AppService } from './../app.service'
import config from './config'

export type SlashArguments = Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
export type SlashMessage = ChatInputCommandInteraction<CacheType>

export default class Command {
  public commandName: string
  public isSlash: boolean
  public service: AppService
  public args: string[] | SlashArguments
  public message: SlashMessage | Message<boolean>
  public embed: EmbedBuilder
  public config: typeof config
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
    else await this.message.reply(messageData).catch((e) => console.log(e))
  }

  public async initCommand(
    message: SlashMessage | Message<boolean>,
    args: string[] | SlashArguments,
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
    return this.isSlash ? (this.message as SlashMessage).user : (this.message as Message).author
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
      ? Math.abs(parseInt((this.args as SlashArguments).getString(argName)))
      : Math.abs(parseInt(this.args[0]))
  }

  public getArgUser(argName) {
    return this.isSlash
      ? (this.args as SlashArguments).getUser(argName)
      : (this.message as Message).mentions.users.first()
  }
}

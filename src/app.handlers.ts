import {
  type Client,
  type MessageReaction,
  type PartialMessageReaction,
  type User,
  type PartialUser,
  type Message,
  type Collection,
  ActivityType
} from 'discord.js'
import { type AppService } from './app.service'
import config from './commands/config'

interface ClientModel extends Client {
  commands: Collection<string, any>
}

/**
 * Хэндлер для события добавления реакции к сообщению
 * @param reaction
 * @param user
 * @param service
 * @param client
 */
export const messageReactionAddHandler = async (
  reaction: any,
  user: any,
  service: AppService,
  client: ClientModel
) => {
  try {
    if (user.bot) return

    const reacts = await service.getReacts()
    reacts.forEach(async (react) => {
      const channel: any = await client.channels.fetch(react.channel_id)
      await channel.messages.fetch(react.message_id)
    })
    const r = await reaction.fetch()
    const react = reacts.find(f =>
      f.emoji === r.emoji.name &&
      f.channel_id === reaction.message.channelId &&
      f.message_id === reaction.message.id
    )

    if (react) {
      const guild = await client.guilds.fetch(reaction.message.guildId)
      const role= guild.roles.cache.find(role => role.id === react.role_id)
      if (role) reaction.message.guild.members.cache.get(user.id).roles.add(react.role_id)
    }
  } catch (error) {
    return
  }
}

/**
 * Хэндлер для события удаления реакции
 * @param reaction
 * @param user
 * @param service
 * @param client
 */
export const messageReactionRemoveHandler = async (
  reaction: any,
  user: any,
  service: AppService,
  client: ClientModel
) => {
  try {
    if (user.bot) return

    const reacts = await service.getReacts()
    reacts.forEach(async (react) => {
      const channel: any = await client.channels.fetch(react.channel_id)
      await channel.messages.fetch(react.message_id)
    })
    const r = await reaction.fetch()
    const react = reacts.find(f =>
      f.emoji === r.emoji.name &&
      f.channel_id === reaction.message.channelId &&
      f.message_id === reaction.message.id
    )

    if (react) {
      const guild = await client.guilds.fetch(reaction.message.guildId)
      const role= guild.roles.cache.find(role => role.id === react.role_id)
      if (role) reaction.message.guild.members.cache.get(user.id).roles.remove(react.role_id)
    }
  } catch (error) {
    return
  }
}

/**
 * Хэндлер для обработки сообщений и вызова команд
 * @param message 
 * @param service 
 * @param client
 */
export const messageCreateHandler = async (
  message: any,
  service: AppService,
  client: ClientModel
) => {
  const { prefix } = config.bot
  if (message.author.bot || message.author.system || !message.content.startsWith(prefix)) return
  const messageArray = message.content.split(' ')
  const command = messageArray[0]
  const args = messageArray.slice(1)
  const commandController = client.commands.get(
    command.slice(prefix.length).trimStart().toLowerCase(),
  )
  if (commandController) {
    try {
      await commandController.run(message, args, service)
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Хэндлер для управления активностью и кэширования сообщений
 * @param service
 * @param client
 */
export const clientReadyHandler = async (
  service: AppService,
  client: ClientModel
) => {
  client.user.setActivity(config.bot.rpc, {
    type: ActivityType.Listening,
  })

  // кэшируем все сообщения где слушаются реакции
  const reacts = await service.getReacts()
  reacts.forEach(async (react) => {
    const channel: any = await client.channels.fetch(react.channel_id)
    await channel.messages.fetch(react.message_id)
  })

  service.setClient(client)
  console.log('bot ready!')
}
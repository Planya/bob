import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events
} from 'discord.js'
import { NestFactory } from '@nestjs/core'
import * as xmlparser from 'express-xml-bodyparser'

import { AppService } from './app.service'
import { AppModule } from './app.module'
import { 
  messageReactionAddHandler,
  messageReactionRemoveHandler,
  messageCreateHandler,
  clientReadyHandler
} from './app.handlers'

import { LiveService } from './live/live.service'
import { LiveModule } from './live/live.module'

import { configService } from './config/config.service'
import config from './commands/config'
import CommandList from './commands'

interface ClientModel extends Client {
  commands: Collection<string, any>
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
}) as ClientModel

/**
 * Главный модуль чат-бота и автоанонсов Twitch/YouTube
 */
async function App() {
  const app = await NestFactory.create(AppModule)
  app.use(xmlparser())
  await app.listen(configService.getPort())
  const service = app.get<AppService>(AppService)
  await service.autoUpdateSubs()

  // заполняем самовызывающиеся команды
  client.commands = new Collection()
  for (const command of CommandList) {
    client.commands.set(command.name, command)
  }

  try {
    client.on(Events.ClientReady, () => clientReadyHandler(service, client))
    client.on(Events.GuildDelete, (guild) => service.clearGuildData(guild.id))
    client.on(Events.MessageReactionAdd, (reaction, user) => messageReactionAddHandler(reaction, user, service, client))
    client.on(Events.MessageReactionRemove, (reaction, user) => messageReactionRemoveHandler(reaction, user, service, client))
    client.on(Events.MessageCreate, (message) => messageCreateHandler(message, service, client))

    client.login(config.bot.token)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Модуль радио
 */
async function Live() {
  const app = await NestFactory.create(LiveModule)
  await app.listen(parseInt(configService.getPort()) + 1)
  const service = app.get<LiveService>(LiveService)

  service.init()
}

function init() {
  App()
  if (configService.getRadio()) Live()
}

init()

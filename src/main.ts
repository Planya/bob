import {
  Client,
  Collection,
  ActivityType,
  GatewayIntentBits,
  Partials,
  Events
} from 'discord.js';
import { NestFactory } from '@nestjs/core';
import * as xmlparser from 'express-xml-bodyparser';

import { AppService } from './app.service';
import { AppModule } from './app.module';

import { configService } from './config/config.service';
import config from './commands/config';
import CommandList from './commands';

interface ClientModel extends Client {
  commands: Collection<any, any>;
}
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
}) as ClientModel;



async function App() {
  const app = await NestFactory.create(AppModule);
  app.use(xmlparser());
  await app.listen(configService.getPort());
  const service = app.get<AppService>(AppService);
  await service.autoUpdateSubs();

  client.commands = new Collection();
  for (const command of CommandList) {
    client.commands.set(command.name, command);
  }

  try {
    client.on(Events.ClientReady, async () => {
      client.user.setActivity(config.bot.rpc, {
        type: ActivityType.Watching,
      });

      // кэшируем все сообщения где слушаются реакции
      const reacts = await service.getReacts()
      reacts.forEach(async (react) => {
        const channel: any = await client.channels.fetch(react.channel_id)
        await channel.messages.fetch(react.message_id)
      })

      service.setClient(client);
      console.log('bot ready!');
      await service.updateToken()
    });

    client.on(Events.GuildDelete, async (guild) => {
      await service.clearGuildData(guild.id)
    })

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
      try {
        if (user.bot) return;
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
        return;
      }
    })

    client.on(Events.MessageReactionRemove, async (reaction, user) => {
      try {
        if (user.bot) return;
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
        return;
      }
    })

    client.on(Events.MessageCreate, async (message) => {
      const prefix = config.bot.prefix;
      if (message.author.bot || message.author.system || !message.content.startsWith(prefix)) return;

      const messageArray = message.content.split(' ');
      const command = messageArray[0];
      const args = messageArray.slice(1);
      const commandController = client.commands.get(
        command.slice(prefix.length).trimStart().toLowerCase(),
      );
      if (commandController) {
        try {
          await commandController.run(message, args, service);
        } catch (err) {
          //
        }
      }
    });

    client.login(config.bot.token);
  } catch (error) {
    console.log(error);
  }
}
App();

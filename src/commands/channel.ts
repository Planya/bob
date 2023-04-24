import Command from './Command';
import { AppService } from './../app.service';
import { setEmbedAuthor } from './helpers';
import { ChannelDTO } from 'src/dto/channel.dto';
import { PermissionsBitField } from 'discord.js'

enum ChannelAction {
  add = 'добавить',
  delete = 'удалить',
}

export class ChannelCommand extends Command {
  constructor(commandName: string) {
    super(commandName);
  }

  run(
    message: any,
    args: any,
    service: AppService,
    isSlash: boolean | undefined,
  ) {
    this.initCommand(message, args, service, isSlash, async () => {
      const user = this.getUser();
      const action: any = this.getArgByIndex(0);
      const channel: string = this.getArgByIndex(1);
      const is_twitch: boolean = !!this.getArgByIndex(2)

      if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (!action) {
          this.embed.setDescription(
            `Не указано действие! **${this.prefix}канал добавить/удалить* <ID/имя канала*> <0/1 твич>**`,
          );
        } else if (!channel) {
          this.embed.setDescription(
            `Не указан ID канала! **${this.prefix}канал добавить/удалить* <ID/имя канала*> <0/1 твич>**`,
          );
        } else {
          const res = await service.checkChannel(channel, message.guild.id);
          if (res.status === 200 && action === ChannelAction.add) {
            this.replyHasChannel(user);
          } else {
            if (action === ChannelAction.add) {
              const newChannel: ChannelDTO = {
                channel_id: channel,
                server_id: message.guild.id,
                is_twitch: is_twitch,
                is_live: false
              };
              const res = await this.service.createChannel(newChannel);
              if (res.status === 200) {
                this.embed.setDescription('Канал добавлен!');
              }
            } else {
              const res = await this.service.deleteChannel(channel, message.guild.id);
              if (res.status === 200) {
                this.embed.setDescription('Канал удален!');
              }
            }
          }
        }

        this.send({
          embeds: [setEmbedAuthor(this.embed, user)],
        });
      }
    });
  }
}

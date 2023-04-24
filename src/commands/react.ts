import Command from './Command';
import { AppService } from './../app.service';
import { setEmbedAuthor } from './helpers';
import { ReactDTO } from 'src/dto/react.dto';
import { PermissionsBitField } from 'discord.js'

enum ReactAction {
  add = 'добавить',
  delete = 'удалить',
}

export class ReactCommand extends Command {
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
      const channel_id: string = this.getArgByIndex(1);
      const message_id: string = this.getArgByIndex(2);
      const emoji: string = this.getArgByIndex(3);
      const role_id: string = this.getArgByIndex(4);

      if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (!action) {
          this.embed.setDescription(
            `Не указано действие! **${this.prefix}реакция добавить/удалить <ID канала> <ID сообщения> <эмодзи> <ID роли>**`,
          );
        } else if (!channel_id || !message_id || !role_id) {
          this.embed.setDescription(
            `Указаны не все параметры! **${this.prefix}реакция добавить/удалить <ID канала> <ID сообщения> <эмодзи> <ID роли>**`,
          );
        } else {
          const res = await service.checkReact(channel_id, message_id, emoji, role_id);
          if (res.status === 200 && action === ReactAction.add) {
            this.replyHasReact(user);
          } else {
            if (action === ReactAction.add) {
              const newReact: ReactDTO = {
                channel_id: channel_id,
                message_id: message_id,
                emoji: emoji,
                role_id: role_id
              };
              const res = await this.service.createReact(newReact);
              if (res.status === 200) {
                this.embed.setDescription('Реакция добавлена!');
                const channel: any = await message.client.channels.fetch(channel_id)
                const fetchedMessage = await channel.messages.fetch(message_id)
                fetchedMessage.react(emoji)
              }
            } else { 
              const res = await this.service.deleteReact(channel_id, message_id, emoji, role_id);
              if (res.status === 200) {
                this.embed.setDescription('Реакция удалена!');
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

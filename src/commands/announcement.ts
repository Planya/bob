import Command from './Command'
import { AppService } from './../app.service'
import { setEmbedAuthor } from './helpers'
import { AnnouncementDTO } from 'src/dto/announcement.dto'
import { PermissionsBitField } from 'discord.js'

enum AnnouncementAction {
  add = 'добавить',
  delete = 'удалить',
}

export class AnnouncementCommand extends Command {
  constructor(commandName: string) {
    super(commandName)
  }

  run(
    message: any,
    args: any,
    service: AppService,
    isSlash: boolean | undefined,
  ) {
    this.initCommand(message, args, service, isSlash, async () => {
      const user = this.getUser()
      const action: any = this.getArgByIndex(0)
      const channel: string = this.getArgByIndex(1)
      const ping: string = this.getArgByIndex(2)

      if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (!action) {
          this.embed.setDescription(
            `Не указано действие! **${this.prefix}анонсы добавить/удалить <ID канала>**`,
          )
        } else if (!channel) {
          this.embed.setDescription(
            `Не указан ID канала! **${this.prefix}анонсы добавить/удалить <ID канала>**`,
          )
        } else {
          const res = await service.checkAnnouncement(channel, message.guild.id)
          if (res.status === 200 && action === AnnouncementAction.add) {
            const announcement = res.announcement
            announcement.channel_id = channel
            announcement.ping = ping === 'ping'
            const resA = await this.service.saveAnnouncement(announcement)
            if (resA.status === 200) {
              this.embed.setDescription('Канал анонсов изменен!')
            }
          } else {
            if (action === AnnouncementAction.add) {
              const newAnnouncement: AnnouncementDTO = {
                channel_id: channel,
                server_id: message.guild.id,
                ping: ping === 'ping'
              }
              const res = await this.service.createAnnouncement(newAnnouncement)
              if (res.status === 200) {
                this.embed.setDescription('Канал анонсов добавлен!')
              }
            } else {
              const res = await this.service.deleteAnnouncement(channel, message.guild.id)
              if (res.status === 200) {
                this.embed.setDescription('Канал анонсов удален!')
              }
            }
          }
        }

        this.send({
          embeds: [setEmbedAuthor(this.embed, user)],
        })
      }
    })
  }
}

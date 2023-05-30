import { Injectable } from '@nestjs/common'
import { configService } from './../config/config.service'
import axios from 'axios'
import { createCanvas, loadImage, registerFont } from 'canvas'
import * as fs from 'fs'

@Injectable()
export class LiveService {
  private canvas
  private ctx
  private bg
  private bgC
  private currentMeta
  constructor() {
    registerFont('font.ttf', { family: 'Shantell Sans' })
    
    this.canvas = createCanvas(1920, 1080)
    this.ctx = this.canvas.getContext('2d')
    this.currentMeta = {
      title: '',
      artist: ''
    }
  }

  public async init() {
    this.bg = await loadImage('helheim-radio.png')
    this.bgC = await loadImage('helheim-radio-c.png')
    this.getMeta()
  }

  private async getMeta() {
    setInterval(async () => {
      const { data } = await axios.get(configService.getRadio())
      const { now_playing } = data[0]

      if (
        this.currentMeta.title !== now_playing.song.title ||
        this.currentMeta.artist !== now_playing.song.artist
      ) {
        this.currentMeta = {
          title: now_playing.song.title,
          artist: now_playing.song.artist
        }

        this.paint()
      }
    }, 1000)
  }

  private async paint() {
    this.ctx.drawImage(this.currentMeta.artist === 'Planya' ? this.bg : this.bgC, 0, 0)

    this.ctx.font = '50px "Shantell Sans"'
    this.ctx.fillText(`${this.currentMeta.title} очень длинно название`, 174, 1046)

    this.ctx.font = '38px "Shantell Sans"'
    this.ctx.fillText(`${this.currentMeta.artist}Planya`, 174, 990)

    const buffer = this.canvas.toBuffer('image/png')
    fs.writeFileSync("./overlay.png", buffer)
  }
}

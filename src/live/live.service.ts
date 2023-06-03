import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { configService } from './../config/config.service'
import axios from 'axios'
import { 
  createCanvas, 
  loadImage, 
  registerFont,
  type Canvas,
  type CanvasRenderingContext2D,
  type Image
} from 'canvas'
import * as fs from 'fs'

interface StreamMeta {
  title: string
  artist: string
}

@Injectable()
export class LiveService {
  private canvas: Canvas
  private ctx: CanvasRenderingContext2D
  private bg: Image
  private bgC: Image
  private currentMeta: StreamMeta

  constructor() {
    registerFont('font.ttf', { family: 'Shantell Sans' })
    
    this.canvas = createCanvas(1920, 1080)
    this.ctx = this.canvas.getContext('2d')
    this.currentMeta = {
      title: '',
      artist: ''
    }
  }

  /**
   * Подгружаем фоны
   */
  public async init(): Promise<void> {
    this.bg = await loadImage('helheim-radio.png') // Planya
    this.bgC = await loadImage('helheim-radio-c.png') // Charlotte
  }

  /**
   * Обновляем данные о текущем треке каждую секунду
   */
  @Cron('* * * * * *')
  async getMeta(): Promise<void> {
    // получаем json
    const { data } = await axios.get(configService.getRadio())
    const { now_playing } = data[0]

    // если данные изменились -> рисуем новый оверлей
    if (
      this.currentMeta.title !== now_playing.song.title ||
      this.currentMeta.artist !== now_playing.song.artist
    ) {
      this.currentMeta = {
        title: now_playing.song.title,
        artist: now_playing.song.artist
      }

      this.draw()
    }
  }

  /**
   * Рисуем новый оверлей и сохраняем
   */
  private async draw(): Promise<void> {
    const { title, artist } = this.currentMeta

    // рисуем фон
    this.ctx.drawImage(artist === 'Planya' ? this.bg : this.bgC, 0, 0)

    // выводим заголовок трека
    this.ctx.font = '50px "Shantell Sans"'
    this.ctx.fillText(`${title}`, 174, 1046)

    // выводим исполнителя
    this.ctx.font = '38px "Shantell Sans"'
    this.ctx.fillText(`${artist}`, 174, 990)

    // сохраняем
    const buffer = this.canvas.toBuffer('image/png')
    fs.writeFileSync("./overlay.png", buffer)
  }
}

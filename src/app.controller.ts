import { Controller, Get, Post, Req, Query, Header } from '@nestjs/common'
import { XMLParser } from 'fast-xml-parser'
import * as moment from 'moment'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getPush(@Query() query: any): Promise<any> {
    return query['hub.challenge']
  }

  @Get('/streams')
  @Header('Access-Control-Allow-Origin', '*')
  async getStreams(): Promise<any> {
    return await this.appService.getTwitchStreams()
  }

  @Post()
  async postPush(@Req() request: any): Promise<any> {
    const parser = new XMLParser()
    const data = parser.parse(request.rawBody)

    let dataNormalize: any = JSON.stringify(data)

    dataNormalize = dataNormalize.replaceAll('"?xml"', '"xml"')
    dataNormalize = dataNormalize.replace('"yt:videoId"', '"videoId"')
    dataNormalize = dataNormalize.replace('"yt:channelId"', '"channelId"')
    dataNormalize = JSON.parse(dataNormalize)

    try {
      await this.appService.logData(dataNormalize)
    } catch (error) {
      console.log(error)
    }

    if (!dataNormalize?.feed?.entry?.videoId) return 'OK'
    const { published, updated } = dataNormalize.feed.entry
    if (!moment(published).startOf('day').isSame(moment(updated).startOf('day'))) return 'OK'

    try {
      await this.appService.getVideoInfo(
        dataNormalize.feed.entry.videoId,
        dataNormalize.feed.entry.channelId,
      )
    } catch (error) {
      console.log(error)
    }

    return 'OK'
  }
}

import { Controller, Get, Post, Req, Query, Res } from '@nestjs/common'
import { XMLParser } from 'fast-xml-parser'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getPush(@Query() query: any): Promise<any> {
    return query['hub.challenge']
  }

  @Get('/streams')
  async getStreams(@Res() res): Promise<any> {
    res.set('Access-Control-Allow-Origin', '*')
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

import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { LiveService } from './live.service'

/**
 * Модуль для обновления оверлея стрима радио
 * Используется для RTMP стрима генерируемого FFMPEG
 */
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [LiveService]
})
export class LiveModule {}

import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { LiveService } from './live.service'

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [LiveService]
})
export class LiveModule {}

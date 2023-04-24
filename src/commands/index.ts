import { ChannelCommand } from './channel';
import { AnnouncementCommand } from './announcement';
import { ReactCommand } from './react';

export default [
  new ChannelCommand('канал'),
  new AnnouncementCommand('анонсы'),
  new ReactCommand('реакция')
];

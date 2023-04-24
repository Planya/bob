export interface ChannelDTO {
  id?: string;
  channel_id: string;
  server_id: string;
  is_twitch: boolean;
  is_live: boolean;
  last_live_date?: Date;
}

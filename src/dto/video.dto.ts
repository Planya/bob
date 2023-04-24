export interface VideoDTO {
  id?: string;
  channel_id: string;
  videoId: string;
  url: string;
  description: string;
  image: string;
  isLive?: boolean | null;
  stream?: boolean | null;
  start_time?: Date;
}

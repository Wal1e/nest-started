import { IsString, IsInt } from 'class-validator';

export class DemoDto {
  @IsString()
  name: string;

  @IsString()
  author: string;

  @IsString()
  content: string;

  @IsString()
  thumb_url: string;

  @IsInt()
  type: number;
}

export interface DemoPostBody {
  title: string;
  author: string;
  content: string;
  thumb_url: string;
  type: number;
}

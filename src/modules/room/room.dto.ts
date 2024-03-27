import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ type: Number, default: 3 })
  @IsNumber()
  round: number;

  @ApiProperty({ type: Number, default: 8 })
  @IsNumber()
  playerCount: number;

  @ApiProperty({ type: Number, default: 100 })
  @IsNumber()
  drawTimeInSec: number;

  @ApiProperty({ type: Number, default: 4 })
  @IsNumber()
  wordCount: number;

  @ApiProperty({ type: Number, default: 2 })
  hit: number;
}

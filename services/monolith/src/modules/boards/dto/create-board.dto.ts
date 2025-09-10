import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}

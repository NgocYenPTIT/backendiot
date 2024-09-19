import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
export class GetHistorytActionDto {
    @ApiProperty({ required: true })
    @IsInt()
    @IsNotEmpty()
    readonly currentPage: number;

    @ApiProperty({ required: true })
    @IsInt()
    @IsNotEmpty()
    readonly pageSize: number;
}
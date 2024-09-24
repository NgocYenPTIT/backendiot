import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class GetHistorytActionDto {
    @ApiProperty({ required: true })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    readonly currentPage: number;

    @ApiProperty({ required: true })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    readonly pageSize: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly time: string;
}
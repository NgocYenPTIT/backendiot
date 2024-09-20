import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Type } from 'class-transformer';

export class GetHistorytCensorDto {
    @ApiProperty({ required: true })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    readonly currentPage: number;

    @ApiProperty({ required: true })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    readonly pageSize: number;


    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    readonly temperature: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    readonly humid: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    readonly light: number;


    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly time: string;
}
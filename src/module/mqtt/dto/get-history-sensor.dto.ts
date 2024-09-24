import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
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
    @Type(() => Number)
    @IsNumber()
    readonly temperature: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    readonly humid: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    readonly light: number;


    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly time: string;
}
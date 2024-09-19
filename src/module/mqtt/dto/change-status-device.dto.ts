import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from "class-validator";

export class ChangeStatusDeviceDto {
    @ApiProperty({ required: true, default: 'fan' })
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly device: string;

    @ApiProperty({ required: true, default: 'on' })
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly status: string;
}
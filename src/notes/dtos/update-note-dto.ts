import { IsString, IsOptional } from "class-validator";

export class UpdateNote {
    @IsString()
    @IsOptional()
    author: string;

    @IsString()
    @IsOptional()
    note: string;
}
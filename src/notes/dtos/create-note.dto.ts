import { IsString } from "class-validator";

export class CreateNoteDto {
    @IsString()
    author: string;

    @IsString()
    note: string;
}
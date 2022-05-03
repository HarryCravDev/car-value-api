import { Expose, Transform } from "class-transformer";

export class NoteDto {
    @Expose()
    id: number;

    @Expose()
    author: string;

    @Expose()
    note: string;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}
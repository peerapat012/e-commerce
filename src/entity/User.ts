import { Entity, Column, PrimaryColumn } from "typeorm";
import { uuidv7 } from "uuidv7";

@Entity()
export class User {
    @PrimaryColumn()
    id: string = uuidv7();

    @Column()
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;
}
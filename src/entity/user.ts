import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user-model")
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	wordCount: number;

	@Column()
	dateReference: Date;
}

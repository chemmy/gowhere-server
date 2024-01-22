import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  search_location: string;

  @Column({ type: 'bigint' })
  search_timestamp: number;

  @Column({ type: 'bigint' })
  searched_when: number;

  @BeforeInsert()
  setDefaultSearchedWhen() {
    this.searched_when = Date.now();
  }
}

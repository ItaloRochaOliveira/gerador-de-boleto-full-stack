import { Column, Entity, Index, OneToMany } from "typeorm";
import { BoletoData } from "./BoletoData";

@Index("email", ["email"], { unique: true })
@Entity("users")
export class Users {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("varchar", { name: "email", unique: true, length: 100 })
  email: string;

  @Column("varchar", { name: "password", nullable: true, length: 100 })
  password: string | null;

  @Column("varchar", { name: "role", nullable: true, length: 15 })
  role: string | null;

  @Column("varchar", { name: "created_at", nullable: true, length: 24, default: () => "CURRENT_TIMESTAMP" })
  createdAt: string | null;
  
  @Column("varchar", { name: "updated_at", nullable: true, length: 24 })
  updatedAt: string | null;
  
  @Column("boolean", { name: "deleted", nullable: true, default: false })
  deleted: boolean | null;
  
  @Column("varchar", { name: "deleted_at", nullable: true, length: 24 })
  deletedAt: string | null;

  @OneToMany(() => BoletoData, (boleto) => boleto.user)
  boletoData?: BoletoData[];


    constructor(
        id: string,
        name: string | null,
        password: string | null,
        role: string | null,
        createdAt: string | null,
        email: string,
        updatedAt: string | null,
        deleted: boolean | null,
        deletedAt: string | null
    ) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.role = role
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.deleted = deleted
        this.deletedAt = deletedAt
    }  
}
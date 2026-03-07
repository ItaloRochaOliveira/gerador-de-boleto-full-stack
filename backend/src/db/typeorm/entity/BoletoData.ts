import { Column, Entity, Index } from "typeorm";

@Entity("boleto_data")
export class BoletoData {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "nome_empresa", nullable: true, length: 100 })
  nomeEmpresa: string | null;

  @Column("varchar", {name: "cpf_cnpj", nullable: true, length: 18})
  cpfCnpj: string | null;

  @Column("varchar", {name: "endereco", nullable: true, length: 255})
  endereco: string | null;

  @Column("varchar", {name: "descricao_referencia", nullable: true, length: 255})
  descricaoReferencia: string | null;  

  @Column("numeric", {name: "valor", nullable: true, precision: 10, scale: 2})
  valor: number | null;

  @Column("date", {name: "vencimento", nullable: true})
  vencimento: Date | null;

  @Column("varchar", { name: "created_at", nullable: true, length: 24, default: () => "CURRENT_TIMESTAMP"  })
  createdAt: string | null;

  @Column("varchar", { name: "updated_at", nullable: true, length: 24 })
  updatedAt: string | null;

  @Column("boolean", { name: "deleted", nullable: false, default: false })
  deleted: boolean;

  @Column("varchar", { name: "deleted_at", nullable: true, length: 24 })
  deleted_at: string | null;

  @Column("varchar", { name: "user_id", nullable: false, length: 36 })
  user_id: string;


    constructor(
        id: string,
        nome_empresa: string | null,
        cpf_cnpj: string | null,
        endereco: string | null,
        descricao_referencia: string | null,
        valor: number | null,
        vencimento: Date | null,
        created_at: string | null,
        updated_at: string | null,
        deleted: boolean,
        deleted_at: string | null,
        user_id: string,
    ) {
        this.id = id
        this.nomeEmpresa = nome_empresa
        this.cpfCnpj = cpf_cnpj
        this.endereco = endereco
        this.descricaoReferencia = descricao_referencia
        this.valor = valor
        this.vencimento = vencimento
        this.createdAt = created_at
        this.updatedAt = updated_at
        this.deleted = deleted
        this.deleted_at = deleted_at
        this.user_id = user_id
    }  
}
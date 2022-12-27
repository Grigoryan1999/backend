import { MigrationInterface, QueryRunner } from 'typeorm';

export class bidTableWasCreated1672140549488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.bid (
                uuid serial4 NOT NULL,
                fio varchar NOT NULL,
                "comment" varchar NOT NULL,
                updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
                created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
                tel varchar NOT NULL,
                "endDate" timestamp NOT NULL,
                CONSTRAINT "PK_38708187cffb1d824b6c2188b92" PRIMARY KEY (uuid)
            );
            )`,
    );

    await queryRunner.query(
      `CREATE TABLE public.bid_product (
            uuid serial4 NOT NULL,
            count int4 NOT NULL,
            updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
            created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
            "productUuid" int4 NULL,
            CONSTRAINT "PK_25a30ad8c0ae5fc6621afb4dbd5" PRIMARY KEY (uuid),
            CONSTRAINT "UQ_cc141fc41a65ef32a699cf0ebe6" UNIQUE ("productUuid")
        );`,
    );

    await queryRunner.query(
      `ALTER TABLE public.bid_product ADD CONSTRAINT "FK_cc141fc41a65ef32a699cf0ebe6" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid);`,
    );

    await queryRunner.query(
      `CREATE TABLE public.category_products_product (
            "categoryUuid" int4 NOT NULL,
            "productUuid" int4 NOT NULL,
            CONSTRAINT "PK_19f71d93906e5c373f3d47319cd" PRIMARY KEY ("categoryUuid", "productUuid")
        );
        CREATE INDEX "IDX_89b3f303aacf922af380391cb8" ON public.category_products_product USING btree ("categoryUuid");
        CREATE INDEX "IDX_923ad539acd9f99312befc95e4" ON public.category_products_product USING btree ("productUuid");`,
    );

    await queryRunner.query(
      `ALTER TABLE public.category_products_product ADD CONSTRAINT "FK_89b3f303aacf922af380391cb88" FOREIGN KEY ("categoryUuid") REFERENCES public.category(uuid) ON DELETE CASCADE ON UPDATE CASCADE;`,
    );

    await queryRunner.query(
      `ALTER TABLE public.category_products_product ADD CONSTRAINT "FK_923ad539acd9f99312befc95e4d" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid) ON DELETE CASCADE ON UPDATE CASCADE;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.bid`);
    await queryRunner.query(`DROP TABLE public.bid_product`);
    await queryRunner.query(`DROP TABLE public.category_products_product`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProductTable1668432104874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.product (
        uuid serial4 NOT NULL,
        "name" varchar NOT NULL,
        "subscription" varchar NOT NULL,
        updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        drink bool NOT NULL,
        CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0" PRIMARY KEY (uuid)
    );`,
    );

    await queryRunner.query(
      `CREATE TABLE public.product_categoryes_category (
        "productUuid" int4 NOT NULL,
        "categoryUuid" int4 NOT NULL,
        CONSTRAINT "PK_d3a2225e5d70fbcf5aab483bd23" PRIMARY KEY ("productUuid", "categoryUuid")
    );
    CREATE INDEX "IDX_0efc34ab37c92d370486fd76fd" ON public.product_categoryes_category USING btree ("productUuid");
    CREATE INDEX "IDX_152f61fb23b1a092b7d5ae5780" ON public.product_categoryes_category USING btree ("categoryUuid");
    
    
    -- public.product_categoryes_category foreign keys
    
    ALTER TABLE public.product_categoryes_category ADD CONSTRAINT "FK_0efc34ab37c92d370486fd76fd6" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid) ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE public.product_categoryes_category ADD CONSTRAINT "FK_152f61fb23b1a092b7d5ae5780e" FOREIGN KEY ("categoryUuid") REFERENCES public.category(uuid) ON DELETE CASCADE ON UPDATE CASCADE;`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.product`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS public.product_categoryes_category`,
    );
  }
}

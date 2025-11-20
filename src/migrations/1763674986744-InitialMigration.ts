import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1763674986744 implements MigrationInterface {
    name = 'InitialMigration1763674986744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feed_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "feedId" uuid, "userId" uuid, CONSTRAINT "UQ_4336eba98ad4aa934c3f6b19d1b" UNIQUE ("feedId", "userId"), CONSTRAINT "PK_942f455569072c6a005c0a1d017" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "caption" character varying(280) NOT NULL, "mediaUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_8a8dfd1ff306ccdf65f0b5d04b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profilePhotoUrl" character varying, "name" character varying NOT NULL, "birthDate" date NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feed_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying(280) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "feedId" uuid, "userId" uuid, CONSTRAINT "PK_3150445d1f5eaea934548589b05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feed_like" ADD CONSTRAINT "FK_c06d4b8c1c3dab3afc2213d9d13" FOREIGN KEY ("feedId") REFERENCES "feed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feed_like" ADD CONSTRAINT "FK_5e930935709429d02b067e9cc19" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feed" ADD CONSTRAINT "FK_70952a3f1b3717e7021a439edda" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feed_comment" ADD CONSTRAINT "FK_b1a1d1f1300e517964a6af03dcf" FOREIGN KEY ("feedId") REFERENCES "feed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feed_comment" ADD CONSTRAINT "FK_dfe031aa7a6d20ab75e86dc804d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed_comment" DROP CONSTRAINT "FK_dfe031aa7a6d20ab75e86dc804d"`);
        await queryRunner.query(`ALTER TABLE "feed_comment" DROP CONSTRAINT "FK_b1a1d1f1300e517964a6af03dcf"`);
        await queryRunner.query(`ALTER TABLE "feed" DROP CONSTRAINT "FK_70952a3f1b3717e7021a439edda"`);
        await queryRunner.query(`ALTER TABLE "feed_like" DROP CONSTRAINT "FK_5e930935709429d02b067e9cc19"`);
        await queryRunner.query(`ALTER TABLE "feed_like" DROP CONSTRAINT "FK_c06d4b8c1c3dab3afc2213d9d13"`);
        await queryRunner.query(`DROP TABLE "feed_comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "feed"`);
        await queryRunner.query(`DROP TABLE "feed_like"`);
    }

}

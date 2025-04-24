import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1745412479033 implements MigrationInterface {
    name = 'Project1745412479033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`phoneNumber\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NULL, \`borrowerProfileId\` varchar(36) NULL, UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`), UNIQUE INDEX \`REL_e63ba19564399ea3ee824a097e\` (\`borrowerProfileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_e63ba19564399ea3ee824a097ef\` FOREIGN KEY (\`borrowerProfileId\`) REFERENCES \`borrower\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_e63ba19564399ea3ee824a097ef\``);
        await queryRunner.query(`DROP INDEX \`REL_e63ba19564399ea3ee824a097e\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_f2578043e491921209f5dadd08\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}

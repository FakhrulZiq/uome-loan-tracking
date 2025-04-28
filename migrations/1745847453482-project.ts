import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1745847453482 implements MigrationInterface {
    name = 'Project1745847453482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`borrower\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`name\` varchar(100) NOT NULL, \`phoneNumber\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`loan\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`borrowerId\` varchar(255) NOT NULL, \`loanAmount\` float NOT NULL DEFAULT '0', \`totalInstalments\` int NOT NULL, \`outStandingAmount\` float NOT NULL DEFAULT '0', \`loanStartDate\` varchar(100) NOT NULL, \`loanStatus\` varchar(100) NOT NULL, \`remark\` varchar(100) NULL, \`proofLink\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`instalmentSchedule\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`loanId\` varchar(255) NOT NULL, \`instalmentNumber\` int NOT NULL, \`dueDate\` varchar(100) NOT NULL, \`amountDue\` decimal(10,2) NOT NULL DEFAULT '0.00', \`status\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`instalmentId\` varchar(255) NOT NULL, \`paymentAmount\` float NOT NULL DEFAULT '0', \`paymentDate\` varchar(100) NOT NULL, \`paymentMethod\` varchar(100) NOT NULL, \`paymentStatus\` varchar(100) NOT NULL, \`transactionId\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`auditCreatedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`auditCreatedBy\` varchar(50) NOT NULL, \`auditModifiedDateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`auditModifiedBy\` varchar(50) NULL, \`auditDeletedDateTime\` datetime(6) NULL, \`auditDeletedBy\` varchar(50) NULL, \`phoneNumber\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL, \`role\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, \`borrowerId\` varchar(36) NULL, UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`), UNIQUE INDEX \`REL_ea4083c7c7d54d3aea5880cbe5\` (\`borrowerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`loan\` ADD CONSTRAINT \`FK_fff5adf4a8082e21349521e6d3c\` FOREIGN KEY (\`borrowerId\`) REFERENCES \`borrower\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`instalmentSchedule\` ADD CONSTRAINT \`FK_b8789a97bb0d8560012ddf4d0a1\` FOREIGN KEY (\`loanId\`) REFERENCES \`loan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_ad3bd23598ffd0bea973d21e8e5\` FOREIGN KEY (\`instalmentId\`) REFERENCES \`instalmentSchedule\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_ea4083c7c7d54d3aea5880cbe5f\` FOREIGN KEY (\`borrowerId\`) REFERENCES \`borrower\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_ea4083c7c7d54d3aea5880cbe5f\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_ad3bd23598ffd0bea973d21e8e5\``);
        await queryRunner.query(`ALTER TABLE \`instalmentSchedule\` DROP FOREIGN KEY \`FK_b8789a97bb0d8560012ddf4d0a1\``);
        await queryRunner.query(`ALTER TABLE \`loan\` DROP FOREIGN KEY \`FK_fff5adf4a8082e21349521e6d3c\``);
        await queryRunner.query(`DROP INDEX \`REL_ea4083c7c7d54d3aea5880cbe5\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_f2578043e491921209f5dadd08\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP TABLE \`instalmentSchedule\``);
        await queryRunner.query(`DROP TABLE \`loan\``);
        await queryRunner.query(`DROP TABLE \`borrower\``);
    }

}

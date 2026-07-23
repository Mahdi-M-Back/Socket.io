import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    userName: {
      type: "varchar(100)",
    },

    password: {
      type: "varchar(60)",
      notNull: true,
    },

    refresh_token: {
      type: "varchar(255)",
    },

    is_deleted: {
      type: "boolean",
      default: false,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
    },

    deleted_at: {
      type: "timestamptz",
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("users");
}

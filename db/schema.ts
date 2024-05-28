import { relations, sql } from "drizzle-orm";
import {
  int,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `inv_${name}`);

// create the user schema
export const users = createTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    userName: text("user_name").notNull(),
    isVerified: int("verified", { mode: "boolean" }),
    credits: int("credits", { mode: "number" }).default(15),
  },
  (users) => ({
    emailIdx: uniqueIndex("emailIdx").on(users.email),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  token: one(verificationTokens),
}));

export const verificationTokens = createTable("activateToken", {
  id: text("id").primaryKey(),
  token: text("token", { length: 384 }).notNull(),
  createdAt: int("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at"),
});

export const verificationTokensRelation = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationTokens.id],
      references: [users.id],
    }),
  })
);

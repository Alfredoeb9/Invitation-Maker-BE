import { relations, sql } from "drizzle-orm";
import {
  int,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
  unique,
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
  invitations: many(invitations),
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

export const invitations = createTable(
  "invitations",
  {
    id: text("id").primaryKey(),
    name: text("name", { length: 150 }).notNull(),
    createdBy: text("created_by").notNull(),
    description: text("text", { length: 384 }),
    content: text("content", { mode: "json" })
      .$type<string[]>()
      .default(sql`'[]'`),
    published: int("published", { mode: "boolean" }).default(false),
    shareURL: text("share_url"),
  },
  (invitations) => ({
    nameInvitations: unique("nameInvitationsIdx").on(
      invitations.name,
      invitations.createdBy
    ),
  })
);

export const invitationsRelation = relations(invitations, ({ one }) => ({
  invitation: one(invitationsForm),
  user: one(users, {
    fields: [invitations.createdBy],
    references: [users.email],
  }),
}));

export const invitationsForm = createTable(
  "invitations_form",
  {
    id: text("id").primaryKey(),
    createdAt: int("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    formId: text("form_id").notNull(),
  },
  (invitationsForms) => ({
    formIdInvitationsFormsIdx: uniqueIndex("formIdInvitationsFormsIdx").on(
      invitationsForms.id
    ),
  })
);

export const invitationsFormRelation = relations(
  invitationsForm,
  ({ one }) => ({
    invitation: one(invitations, {
      fields: [invitationsForm.formId],
      references: [invitations.id],
    }),
  })
);

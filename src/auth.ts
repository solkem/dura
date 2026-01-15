import { Lucia } from "lucia";
import { DrizzleAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessions, users } from "./db/schema";

const adapter = new DrizzleAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: import.meta.env.PROD
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username
        };
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
}

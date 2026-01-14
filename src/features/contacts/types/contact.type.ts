import { Prisma } from "../../../../generated/prisma/client.js";

export type ContactResponse = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
  };
}>;

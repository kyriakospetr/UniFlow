import { Prisma } from "../../../../generated/prisma/client.js";

export type ContactTargetUserInfo = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
  };
}>;

export type ContactUserInfo = Prisma.ContactGetPayload<{
  select: {
    userId: true;
  };
}>;
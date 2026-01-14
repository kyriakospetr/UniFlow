import { Prisma } from "../../../../generated/prisma/client.js";

// This type automatically matches the shape of a Post + the specific Author fields
export type PostResponse = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        username: true;
      };
    };
  };
}>;
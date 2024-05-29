import { PrismaClient } from "@prisma/client";

// query to get the score of a game
async function scoreQuery(prisma: PrismaClient, uuid: string) {
    const game = await prisma.game.findUnique(
        {
            where: {
                uuid: uuid
            }
        }
    );

    return game;
}

export {
    scoreQuery
}
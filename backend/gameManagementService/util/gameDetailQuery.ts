import { PrismaClient } from "@prisma/client";

// query to get the details of a game
async function gameDetailQuery(prisma: PrismaClient, uuid: string) {
    const gameDetail = await prisma.game.findUnique(
        {
            where: {
                uuid: uuid,
            },
            select: {
                user1: true,
                user2: true,
                currentPlayer: true,
                task: true,
                questions: true
            }
        }
    );

    return gameDetail;
}

export {
    gameDetailQuery
}
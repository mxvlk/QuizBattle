import { PrismaClient } from "@prisma/client";

// query to get the games of a user
async function userGamesQuery(prisma: PrismaClient, username: string, finished: boolean) {
    const userGames1 = await prisma.game.findMany(
        {
            where: {
                user1: username,
                finished: finished,
            }
        }
    );
    
    const userGames2 = await prisma.game.findMany(
        {
            where: {
                user2: username,
                finished: finished,
            }
        }
    );

    return { userGames1, userGames2 }
}

export {
    userGamesQuery
}


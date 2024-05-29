import express, { Request, Response } from 'express';
import { prisma } from '../../util/prisma';
import { Category } from '../../util/interfaces';


export const v1CategoryRoute = express.Router();

// get three random categories
v1CategoryRoute.get('/category', async (req: Request, res: Response) => {
    let categoryList = await prisma.category.findMany() as Category[]
    let categories = getRandomCategories(categoryList)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(categories));

});


function getRandomCategories(array: Category[]): Category[] {
    // Shuffle array
    console.log(array)
    const shuffled = array.sort(() => 0.5 - Math.random());
    console.log(shuffled)
    // Get sub-array of first n elements after shuffled
    return shuffled.slice(0, 3);
}


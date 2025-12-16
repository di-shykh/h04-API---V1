import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogListPaginatedOutput} from "../mappers/map-to-blog-list-paginated-output";
import {blogsService} from "../../application/blog.service";
import {errorHandler} from "../../../core/errors/error.handler";
import {BlogQueryInput} from "../input/blog-query.input";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {matchedData} from "express-validator";

export async function getBlogListHandler(
    req: Request,
    res: Response
) {
    try {
        const query = req.query as unknown as BlogQueryInput;
        const sanitizedQuery = matchedData<BlogQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });//утилита для извечения трансформированных значений после валидатара
        //в req.query остаются сырые квери параметры (строки)
        const queryInput = setDefaultSortAndPaginationIfNotExist({...query, ...sanitizedQuery});
        console.log("query", query);
        console.log("queryInput", queryInput);
        console.log("sanitizedQuery", sanitizedQuery);
        const {items, totalCount} = await blogsService.findMany(queryInput);
        const blogsListOutput = mapToBlogListPaginatedOutput(items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        )
        res.status(HttpStatus.Ok).send(blogsListOutput);
    } catch (error: unknown) {
       errorHandler(error, res);
    }
}
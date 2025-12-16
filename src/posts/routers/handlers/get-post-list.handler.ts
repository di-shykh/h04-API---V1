import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostQueryInput} from "../input/post-query.input";
import {matchedData} from "express-validator";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {postsService} from "../../application/post.services";
import {mapToPostListPaginatedOutput} from "../mappers/map-to-post-list-paginated-output";
import {errorHandler} from "../../../core/errors/error.handler";

export async function getPostListHandler(req: Request, res: Response) {
    try{
        const query = req.query as unknown as PostQueryInput;
        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
        const {items, totalCount} = await postsService.findManyPosts(queryInput);
        const postsListOutput = mapToPostListPaginatedOutput(items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        )
        res.status(HttpStatus.Ok).send(postsListOutput);
    }catch (e: unknown) {
        errorHandler(e, res);
    }
}
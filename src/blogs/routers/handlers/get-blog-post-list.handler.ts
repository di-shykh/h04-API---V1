import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";
import {PostQueryInput} from "../../../posts/routers/input/post-query.input";
import {postsService} from "../../../posts/application/post.services";
import {mapToPostListPaginatedOutput} from "../../../posts/routers/mappers/map-to-post-list-paginated-output";
import {HttpStatus} from "../../../core/types/http-statuses";
import {matchedData} from "express-validator";
import {BlogQueryInput} from "../input/blog-query.input";

export async function getBlogPostListHandler(
    req: Request<{id: string}>,
    res: Response,
    ) {
    try {
        const blogId = req.params.id;
        const queryInput = req.query as unknown as unknown as PostQueryInput;
        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,
        });
        const { items, totalCount } = await postsService.findPostsByBlogId(blogId, sanitizedQuery);
        const postListOutput = mapToPostListPaginatedOutput(items,
            sanitizedQuery.pageNumber,
            sanitizedQuery.pageSize,
            totalCount,
        );
        res.status(HttpStatus.Ok).send(postListOutput);
    }
    catch (e: unknown) {
        errorHandler(e,res);
    }
}
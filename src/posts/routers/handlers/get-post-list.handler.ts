import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../domain/post";
import {WithId} from "mongodb";
import {mapToPostViewModelUtil} from "../mappers/map-to-post-view-model.utils";

export async function getPostListHandler(req: Request, res: Response) {
    try{
        const posts:WithId<Post>[]  = await postsRepository.findAllPosts();
        const postViewModels = posts.map(mapToPostViewModelUtil);
        res.status(HttpStatus.Ok).send(postViewModels);
    }catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }

}
import {Post} from "../domain/post";
import {PostInputDto} from "../application/dtos/post.input-dto";
import {postCollection} from "../../db/mongo.bd";
import {blogCollection} from "../../db/mongo.bd";
import {ObjectId, WithId} from "mongodb";
import {PostQueryInput} from "../routers/input/post-query.input";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";

export const postsRepository = {
    async findAllPosts(): Promise<WithId<Post>[]> {
        return postCollection.find().toArray();
    },
    async findPostById(id: string): Promise<WithId<Post> | null> {
        return postCollection.findOne({_id: new ObjectId(id)})
    },
    async createPost(newPost: Post): Promise<WithId<Post>> {
        const insertPost = await postCollection.insertOne(newPost);
        return {...newPost, _id: insertPost.insertedId};
    },
   async updatePost(id: string, dto: Post): Promise<void> {
        const updatePostResult = await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                }
            });
        if (updatePostResult.matchedCount < 1) {
            throw new Error("Post not found.");
        }

        return;
    },
    async deletePost(id: string): Promise<void> {
        const deletePostResult = await postCollection.deleteOne({_id: new ObjectId(id)});
        if (deletePostResult.deletedCount < 1) {
            throw new Error("Post not found.");
        }
        return;
    },
    async findPostsByBlogId(blogId: string, queryDto?: PostQueryInput ): Promise<{items: WithId<Post>[], totalCount: number}> {
        const filter: any = {'blogId': blogId};
        let items: WithId<Post>[];
        if(queryDto) {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
             items = await postCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                 .skip(skip)
                .limit(pageSize)
                .toArray();
        }
        else {
            items = await postCollection.find(filter).toArray();
        }
        const totalCount = await postCollection.countDocuments(filter);
        return {items, totalCount};
    },
    async findManyPosts(queryDto: PostQueryInput): Promise<{items: WithId<Post>[], totalCount: number}> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchPostTitleTerm,
        } = queryDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};
        if(searchPostTitleTerm){
            filter.title = { $regex: searchPostTitleTerm, $options: "i" };
        }
        const items: WithId<Post>[] = await postCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .limit(pageSize)
            .toArray();
        const totalCount = await postCollection.countDocuments(filter);
        return {items, totalCount};
    },
    async findPostByIdOrFail(id: string): Promise<WithId<Post>> {
        const result = await postCollection.findOne({_id: new ObjectId(id)});
        if (!result) {
            throw new RepositoryNotFoundError("Post not found.");
        }
        return result;
    },
}


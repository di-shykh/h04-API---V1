import {Post} from "../domain/post";
import {PostInputDto} from "../application/dtos/post.input-dto";
import {postCollection} from "../../db/mongo.bd";
import {blogCollection} from "../../db/mongo.bd";
import {ObjectId, WithId} from "mongodb";

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
    async findPostsByBlogId(blogId: string): Promise<WithId<Post>[] | null> {
      return await postCollection.find({blogId}).toArray(); //проверить не нужно ли переводить в формат монгоИД
    },
}


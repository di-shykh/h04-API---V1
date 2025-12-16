import {Blog} from "../types/blog";
import {BlogInputDto} from "../application/dtos/blog.input-dto";
import {blogCollection} from "../../db/mongo.bd";
import {ObjectId, WithId} from "mongodb";
import {BlogQueryInput} from "../routers/input/blog-query.input";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";

export const blogsRepository = {
    async findAllBlogs(): Promise<WithId<Blog>[]>{
        return blogCollection.find().toArray();
    },
    async findBlogById(id: string):Promise<WithId<Blog> | null> {
        return blogCollection.findOne({_id: new ObjectId(id)})
    },
    async createBlog(newBlog: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();
    },

    async updateBlog(id: string, dto: BlogInputDto): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl,
                },
            },
        );
        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError("Blog not found.");
        }
        return;
    },
    async deleteBlog(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});
        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Blog not found.");
        }
       return;
    },
    async findManyBlogs(
        queryDto: BlogQueryInput,
    ): Promise<{items: WithId<Blog>[]; totalCount: number}>{
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};
        if(searchNameTerm){
            filter.name = { $regex: searchNameTerm, $options: "i" };
        }
        const items = await blogCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalCount = await blogCollection.countDocuments(filter);
        return {items, totalCount};
    },
    async findBlogByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({_id: new ObjectId(id)});
        if(!res) {
            throw new RepositoryNotFoundError("Blog not found.");
        }
        return res;
    }
}
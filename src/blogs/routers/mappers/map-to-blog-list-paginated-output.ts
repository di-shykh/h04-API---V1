import {WithId} from "mongodb";
import {Blog} from "../../types/blog";
import {BlogListPaginatedOutput} from "../output/blog-list-paginated.output";
import {BlogOutput} from "../output/blog.output";

export function mapToBlogListPaginatedOutput (
    blogs: WithId<Blog>[],
    pageNumber: number, pageSize: number, totalCount: number
): BlogListPaginatedOutput {
    return {
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,

        items: blogs.map(
            (blog):BlogOutput=>({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            }),
        ),
    };
}
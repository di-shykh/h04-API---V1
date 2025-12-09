import {BlogInputDto} from "../../../src/blogs/application/dtos/blog.input-dto";

export function getBlogDto(): BlogInputDto {
    return {
        name: "Blog name",
        description: "Blog description",
        websiteUrl: "https://www.blogs.com/",
    }
}
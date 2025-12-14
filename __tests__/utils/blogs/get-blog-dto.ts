import {BlogAttributes} from "../../../src/blogs/application/dtos/blog-attributes";

export function getBlogDto(): BlogAttributes {
    return {
        name: "Blog name",
        description: "Blog description",
        websiteUrl: "https://www.blogs.com/",
    }
}
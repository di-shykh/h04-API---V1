import {PostInputDto} from "../../../src/posts/application/dtos/post.input-dto";
import {PostAttributes} from "../../../src/posts/application/dtos/post-attributs";

export function getPostDto(blogId: string): PostAttributes {
    return {
        title: "Post name",
        shortDescription: "Post description",
        content: "dfkdsghjdsfhglsdhgjsfdhlgks",
        blogId: blogId,
    }
}

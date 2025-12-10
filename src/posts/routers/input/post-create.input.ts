import {ResourceType} from "../../../core/types/resource-type";
import {PostAttributes} from "../../application/dtos/post-attributs";

export type PostSortField = {
    data: {
        type: ResourceType.Posts;
        attributes: PostAttributes;
    }
}
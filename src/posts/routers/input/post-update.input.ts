import {ResourceType} from "../../../core/types/resource-type";
import {PostAttributes} from "../../application/dtos/post-attributs";

export type PostUpdateInput = {
    data: {
        type: ResourceType.Posts;
        id: string;
        attributes: PostAttributes;

    }
}
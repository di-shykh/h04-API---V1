import {ResourceType} from "../../../core/types/resource-type";

export type PostAttributes = {
    data: {
        type: ResourceType.Posts;
        id: string;
        attributes: PostAttributes;

    }
}
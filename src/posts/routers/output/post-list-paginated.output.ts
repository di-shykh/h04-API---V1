import {PostDataOutput} from "./post-data.output";
import {PaginatedOutput} from "../../../core/types/paginated.output";

export type PostListPaginatedOutput = {
    meta: PaginatedOutput;
    data: PostDataOutput[];
}
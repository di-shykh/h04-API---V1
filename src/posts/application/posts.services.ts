import {PostAttributes} from "./dtos/post-attributs";
import {postsRepository} from "../repositories/posts.repository";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {DomainError} from "../../core/errors/domain.error";
import {Post} from "../domain/post";
import {WithId} from "mongodb";
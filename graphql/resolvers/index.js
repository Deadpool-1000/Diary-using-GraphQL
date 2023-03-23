import UserResolvers  from './UserResolvers.js';
import PostResolvers  from './PostResolvers.js';
import {mergeResolvers} from '@graphql-tools/merge'


const resolvers = [UserResolvers,PostResolvers];

export default mergeResolvers(resolvers)
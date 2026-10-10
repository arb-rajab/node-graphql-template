import { rootTypeDefs } from './root';
import { scalarTypeDefs } from './scalars';
import { userTypeDefs } from './user';
import { echoTypeDefs } from './echo';

export const typeDefs = [rootTypeDefs, scalarTypeDefs, userTypeDefs, echoTypeDefs];

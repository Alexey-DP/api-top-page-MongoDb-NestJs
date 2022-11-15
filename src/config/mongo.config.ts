import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongoComfig = async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => ({
    uri: getMongoUrl(configService),
    ...getMongoOptions()
})

const getMongoUrl = (configService: ConfigService) =>
    `mongodb+srv://${configService.get('MOBGO_NAME')}:${configService.get('MONGO_PASSWORD')}@api.cka7hrf.mongodb.net/?retryWrites=true&w=majority`

const getMongoOptions = () => ({
    useNewUrlParser: true,
    useUnifiedTopology: true
})
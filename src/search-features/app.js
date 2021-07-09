const {getLogger, BodyParser} = require("dcm-lambda-utils");
const getSingleObjectWithPartitionKey = require("./dynamo-functions");

let response;

const transform = (item) => {
    return {
        status: item.enabled,
        featureId: item.primary_key,
        lastModified: item.time,
        authorisedBy: item.authorisedBy,
        authoriser: item.authoriserEmail,
        environment: item.gsi1_pk
    };
}

exports.lambdaHandler = async (event, context) => {
    const logger = getLogger();
    const request = BodyParser(event);

    logger.debug(request)

    try {
        const feature = request.featureId;
        const environment = request.env;

        const val = await getSingleObjectWithPartitionKey(feature, environment);
        const res = val.Items.map(transform);

        response = {
            'statusCode': 200,
            'body': JSON.stringify(res)
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

import buildApolloClient, {
    buildQuery as buildQueryFactory,
} from 'ra-data-graphql-simple';
import { DELETE, LegacyDataProvider } from 'ra-core';
import gql from 'graphql-tag';
import {
    IntrospectionField,
    IntrospectionSchema,
    IntrospectionType,
} from 'graphql';

const getGqlResource = (resource: string) => {
    switch (resource) {
        case 'customers':
            return 'Customer';

        case 'categories':
            return 'Category';

        case 'commands':
            return 'Command';

        case 'products':
            return 'Product';

        case 'reviews':
            return 'Review';

        case 'invoices':
            return 'Invoice';

        default:
            throw new Error(`Unknown resource ${resource}`);
    }
};

interface Resource {
    [key: string]: IntrospectionField;
}

type IntrsopectionResource = IntrospectionType & Resource;

interface IntrospectionResults {
    types: IntrospectionType[];
    queries: IntrospectionField[];
    resources: IntrsopectionResource[];
    schema: IntrospectionSchema;
}

const customBuildQuery = (
    introspectionResults: IntrospectionResults
): LegacyDataProvider => {
    const buildQuery = buildQueryFactory(introspectionResults);

    return (type, resource, params) => {
        if (type === DELETE) {
            return {
                query: gql`mutation remove${resource}($id: ID!) {
                    remove${resource}(id: $id)
                }`,
                variables: { id: params.id },
                parseResponse: ({ data }: any) => {
                    if (data[`remove${resource}`]) {
                        return { data: { id: params.id } };
                    }

                    throw new Error(`Could not delete ${resource}`);
                },
            };
        }

        return buildQuery(type, resource, params);
    };
};

export default () => {
    return buildApolloClient({
        clientOptions: {
            uri: 'http://localhost:4000/graphql',
        },
        introspection: {
            operationNames: {
                [DELETE]: (resource: IntrospectionType) =>
                    `remove${resource.name}`,
            },
        },
        buildQuery: customBuildQuery,
    }).then(
        (dataProvider: LegacyDataProvider) => (
            ...rest: Parameters<LegacyDataProvider>
        ) => {
            const [type, resource, params] = rest;
            dataProvider(type, getGqlResource(resource), params);
        }
    );
};

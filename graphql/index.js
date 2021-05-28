const {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLSchema,
} = require('graphql');
const { getUserGuilds } = require('../utils/api');
const User = require('../database/schemas/Users');

const GuildType = new GraphQLObjectType({
    name: "GuildType",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        icon: {type: GraphQLString},
        owner: {type: GraphQLBoolean},
        permissions: {type: GraphQLInt},
        features: {
            type: GraphQLList(GraphQLString),
        },
        permissions_new: {type: GraphQLString}
    })
})

const LocationType = new GraphQLObjectType({
    name: "LocationType",
    fields: () => ({
        country: {type: GraphQLString},
        location: {type: GraphQLString},
        location_id: {type: GraphQLString}
    })
})

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        discriminator: {type: GraphQLString},
        discordId: {type: GraphQLString},
        username: {type: GraphQLString},
        avatar: {type: GraphQLString},
        guilds: {
            type: GuildType,
            resolve(parent, args, request) {
                return getUserGuilds(request.user.discordId)
                    .then(data => {
                        return res = data.find(a => a.id == "721203266452586507")
                    })
                    .catch(e => { throw new Error(e) })
            }
        },
        location: {
            type: LocationType
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser:{
            type: UserType,
            resolve(parent, args, request){
                return request.user ? request.user : null;
            }
        },
        
    }
});

const RootMutationQuery = new GraphQLObjectType({
    name: "RootMutationQuery",
    fields: {
        updateUserLocation: {
            type: UserType,
            args: {
                discordId: {type: GraphQLString},
                country: {type: GraphQLString},
                location: {type: GraphQLString},
                location_id: {type: GraphQLString},
            },
            async resolve(parent, args, request){
                const {discordId, location, country, location_id} = args;
                if(!discordId || !location || !country || !location_id || !request.user) return null;
                const user = await User.findOne({discordId: discordId}).catch(e => {throw new Error(e)});
                user.location = {
                    country,
                    location,
                    location_id
                }
                await user.save();
                return user ? user : null;
            }
        }
    }
})

module.exports = new GraphQLSchema({query: RootQuery, mutation: RootMutationQuery});
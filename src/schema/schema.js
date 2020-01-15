const graphql = require('graphql')
const Tag = require('../models/tag')
const {GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema} = graphql


const TagType = new GraphQLObjectType({
    name: 'Tags',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        continent: {type: GraphQLString},
        capital: {type: GraphQLString},
        population: {type: GraphQLString},
        territory: {type: GraphQLString},
        tag: {type: GraphQLString},
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        tag: {
            type: TagType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Tag.findById(args.id)
            }
        },
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args){
                return Tag.find().sort("name")
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTag: {
            type: TagType,
            args: {
                name: {type: GraphQLString},
                continent: {type: GraphQLString},
                capital: {type: GraphQLString},
                population: {type: GraphQLString},
                territory: {type: GraphQLString},
                tag: {type: GraphQLString}
            },
            resolve(parent, args){
                return Tag(args).save()
            }
        },
        updateTag: {
            type: TagType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                continent: {type: GraphQLString},
                capital: {type: GraphQLString},
                population: {type: GraphQLString},
                territory: {type: GraphQLString},
                tag: {type: GraphQLString},
            },
            resolve(parent, args){
                return Tag.findByIdAndUpdate(
                    args.id, {
                        name: args.name,
                        continent: args.continent,
                        capital: args.capital,
                        population: args.population,
                        territory: args.territory,
                        tag: args.tag
                    },
                    {new: true}
                )
            }
        },
        deleteTag: {
            type: TagType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Tag.findByIdAndDelete(args.id)
            }
        },
        deleteAllTag: {
            type: TagType,
            resolve(parent, args){
                return Tag.deleteMany({})
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})


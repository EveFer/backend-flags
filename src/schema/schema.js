const graphql = require('graphql')
const Tag = require('../models/tag')
const { GraphQLUpload } = require('graphql-upload')
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema} = graphql
const { storeFS } = require('../utils/uploadfile')



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
        },
        tagsByContinent: {
            type: new GraphQLList(TagType),
            args: {
                continent: {type: GraphQLString}
            },
            resolve(parent, args){
                return Tag.find({continent: args.continent}).sort("name")
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createTag: {
            type: TagType,
            args: {
                name: {type: GraphQLString},
                continent: {type: GraphQLString},
                capital: {type: GraphQLString},
                population: {type: GraphQLString},
                territory: {type: GraphQLString},
                tag: {type: GraphQLUpload},
            },
            async resolve(parent, args,){
                const { filename, mimetype, createReadStream } = await args.tag
                const stream = createReadStream()
                const pathObj = await storeFS({ stream, filename });
                const fileLocation = pathObj.path_picture;

                let tag = new Tag({
                    name: args.name,
                    continent: args.continent,
                    capital: args.capital,
                    population: args.population,
                    territory: args.territory,
                    tag: fileLocation
                })
                return tag.save()
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


// { "query": "mutation($tag: Upload ){ createTag(name: \"Colombia\" , continent: \"America\" , capital: \"Bogota\" , population: \"33434\" , territory: \"23342\", tag: $tag ){ name } }", "variables": { "tag": null} }
const graphql = require('graphql')
const Flag = require('../models/Flag')
const { GraphQLUpload } = require('graphql-upload')
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema} = graphql
const { storeFS } = require('../utils/uploadfile')
const fs = require('fs')


const FlagType = new GraphQLObjectType({
    name: 'Flag',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        continent: {type: GraphQLString},
        capital: {type: GraphQLString},
        population: {type: GraphQLString},
        territory: {type: GraphQLString},
        picture: {type: GraphQLString},
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Flag: {
            type: FlagType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Flag.findById(args.id)
            }
        },
        Flags: {
            type: new GraphQLList(FlagType),
            resolve(parent, args){
                return Flag.find().sort("name")
            }
        },
        FlagsByContinent: {
            type: new GraphQLList(FlagType),
            args: {
                continent: {type: GraphQLString}
            },
            resolve(parent, args){
                return Flag.find({continent: args.continent}).sort("name")
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createFlag: {
            type: FlagType,
            args: {
                name: {type: GraphQLString},
                continent: {type: GraphQLString},
                capital: {type: GraphQLString},
                population: {type: GraphQLString},
                territory: {type: GraphQLString},
                picture: {type: GraphQLUpload},
            },
            async resolve(parent, args,){
                const { filename, mimetype, createReadStream } = await args.picture
                const stream = createReadStream()
                const pathObj = await storeFS({ stream, filename });
                const fileLocation = pathObj.path_picture;

                let flag = new Flag({
                    name: args.name,
                    continent: args.continent,
                    capital: args.capital,
                    population: args.population,
                    territory: args.territory,
                    picture: fileLocation
                })
                return flag.save()
            }
        },
        updateFlag: {
            type: FlagType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                continent: {type: GraphQLString},
                capital: {type: GraphQLString},
                population: {type: GraphQLString},
                territory: {type: GraphQLString},
                picture: {type: GraphQLString},
            },
            resolve(parent, args){
                return Flag.findByIdAndUpdate(
                    args.id, {
                        name: args.name,
                        continent: args.continent,
                        capital: args.capital,
                        population: args.population,
                        territory: args.territory,
                        picture: args.picture
                    },
                    {new: true}
                )
            }
        },
        deleteFlag: {
            type: FlagType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Flag.findByIdAndDelete(args.id)
            }
        },
        deleteAllFlag: {
            type: FlagType,
            resolve(parent, args){
                return Flag.deleteMany({})
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})


// { "query": "mutation($picture: Upload ){ createFlag(name: \"Colombia\" , continent: \"America\" , capital: \"Bogota\" , population: \"33434\" , territory: \"23342\", flag: $picture ){ name } }", "variables": { "picture": null} }
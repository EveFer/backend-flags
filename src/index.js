const express = require('express')
const graphqlHTTP = require('express-graphql')
const { graphqlUploadExpress } = require('graphql-upload')
const bodyParser = require('body-parser')
const path = require('path')

const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()

const PORT = process.env.PORT || 3131
const MONGODB_URI = process.env.DATABASE_URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false})
  .then(() => { 
      console.log('Conection to MongoDB Success') 

      app.listen(PORT, ()=>{
        console.log(`Listen on PORT ${PORT}`)
      })

    })
  .catch(err => console.log(`{error: ${err}}`))

app.use('/graphql', 
        graphqlUploadExpress({}),
        express.static(path.join(__dirname, 'pictures')),
        bodyParser.json(),
        graphqlHTTP({
          schema,
          graphiql:true
        }),
)


import { Bike } from "../models/Bike";
import { PubSub } from 'apollo-server-express'
import { User } from "../models/User";
import { createNewSessionUser } from "../middlewares/initializeUserMiddleware"
import humanNames from 'human-names'

const pubsub = new PubSub();

type CreateUserRequest = {
    name: string,
    sessionKey: string
}

type RentBikeRequest = {
    user: typeof User,
    bike: typeof Bike
}

type RentBikeRequestError = {
    error: String
}

type RentBikeRequestSuccess = {
    payload: any
    warning: String
}

export const resolvers = {
    Query: {
        users: () => User.find(),
        bikes: () => Bike.find().populate('user'),
        user:(_,{id}) => User.findById(id),
        bike:(_,{id}) => Bike.findById(id).populate('user'),
        actualUser:  (_, __, context) => {
            const { cookies:{username, sessionKey} } = context
            return User.findOne({name: username, sessionKey})
        }
    },
    Mutation: {
        createUser: async (_, { name, sessionKey }: CreateUserRequest) => {
            return await createNewSessionUser(name, sessionKey)
        },
        rentBikeStart: async(_, { bike }: RentBikeRequest, context) => {
            const { id:bid } = bike as any 
            const { cookies:{username, sessionKey} } = context || {cookies:{}}
            
            const activeUser = await User.findOne({name: username, sessionKey}).exec()
            const activeBike = await Bike.findById(bid).exec()

            if(!activeBike?.rented){
                activeBike.user = activeUser
                activeBike.rented = true
            
                await activeBike.save()
                pubsub.publish('BIKE_STATUS_UPDATE', {bikeStatusChanged: activeBike})
            }

            return activeBike.populate('user').toObject({ virtuals: true })
        },
        rentBikeFinish: async(_, { bike }: RentBikeRequest, context) => {
            const { id:bid } = bike as any
            const { cookies:{username, sessionKey} } = context || {cookies:{}}
            
            const activeUser = await User.findOne({name: username, sessionKey}).exec()
            const activeBike = await Bike.findById(bid).exec()

            if(activeBike?.rented && activeBike?.user._id.toString() === activeUser?._id.toString()){
                activeBike.rented = false
                activeBike.user = null

                await activeBike.save()
                pubsub.publish('BIKE_STATUS_UPDATE', {bikeStatusChanged: activeBike.populate('user')})
            }
            
            return activeBike.toObject({ virtuals: true })
        },
        dropAllRents: async()=>{
            const query = { rented: true };
            await Bike.updateMany(query, {rented:false, user: null}).exec()

            const allTheBikes = await Bike.find().populate('user').exec()

            pubsub.publish('BIKES_DATA_UPDATE', {bikesDataBulkUpdate: allTheBikes})

            return allTheBikes
        },
        resetBikesData: async()=>{
            await Bike.deleteMany().exec()
            await Bike.insertMany([
                {
                  name: "Henry",
                  latitude: 50.119504,
                  longitude: 8.638137,
                  rented: false,
                },
                { name: "Hans", latitude: 50.119229, longitude: 8.64002, rented: false },
                {
                  name: "Thomas",
                  latitude: 50.120452,
                  longitude: 8.650507,
                  rented: false,
                },
              ])
              
            const allTheBikes = await Bike.find().populate('user').exec()

            pubsub.publish('BIKES_DATA_UPDATE', {bikesDataBulkUpdate: allTheBikes})

            return allTheBikes
        },
        placeNewBike: async(_, {coords}) => {
            const {latitude, longitude} = coords
            // random German name
            const name = humanNames.maleDe[Math.floor(Math.random() * Math.floor(68))]
            const bike = new Bike({
                name,
                latitude,
                longitude,
                rented: false
            });
            
            await bike.save();

            // quick and dirty soluition
            const allTheBikes = await Bike.find().populate('user').exec()
            pubsub.publish('BIKES_DATA_UPDATE', {bikesDataBulkUpdate: allTheBikes})
            
            return bike
        }
    },
    Subscription: {
        bikeStatusChanged:{
            subscribe: () => pubsub.asyncIterator(['BIKE_STATUS_UPDATE'])
        },
        bikesDataBulkUpdate:{
            subscribe: () => pubsub.asyncIterator(['BIKES_DATA_UPDATE'])
        },
    }
};
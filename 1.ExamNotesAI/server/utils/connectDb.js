import mongoose from "mongoose"
import dns from "dns"  

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const connectDb = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URL)
        console.log("Db Connected")
    } catch (error) {
        console.log(`Db error ${error}`)  
    }
    console.log(mongoose.connection.host)
}
export default connectDb
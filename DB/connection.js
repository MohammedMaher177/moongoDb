
import moongose from "mongoose"

//mongodb+srv://momaherfrontend:<password>@cluster0.mbdwkdz.mongodb.net/
//mongodb+srv://newUser:112233112233@atlascluster.o0ywtpx.mongodb.net/usersModel
const connectionDb =async ()=> {

    return await moongose.connect( process.env.DB_CONNECTION)
    .then((result) => {
        // console.log(result);
        console.log("DB Connected");
    }).catch(error => console.log("Catsh Error", error))
}

export default connectionDb
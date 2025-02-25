import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addConnections } from "../utils/connectionSlice"

const Connection = () => {

    const dispatch = useDispatch();
    const connections = useSelector((store)=>store.connections);
    //console.log(connections)
    const fetchConnection = async()=>{
        try {
            const res = await axios.get(BASE_URL+ "/user/allconnections",{
                withCredentials:true,
            }
        )
        console.log(res.data.data);
        dispatch(addConnections(res.data.data))

        } catch (err) 
        {
         console.log(err)   
        }
    }
    useEffect(()=>{
        fetchConnection();
    },[]);

    if(!connections) {
        return (
            <div className="flex justify-center my-10">
                <p className="text-bold text-1xl">Add some users to see Connections</p>
            </div>
        )
    }
    return (
        
        <div className="text-center my-5">
            <h1 className="text-bold text-3xl">Connections</h1>
            
            {connections.map((connection) => {
                const {_id,firstName, lastName, photoUrl, gender, age, about} = connection;
        
        
                return(
                    <div key={_id} className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">
                        <div>
                            <img alt="photo" 
                            className="w-20 h-20 rounded-full" 
                            src={photoUrl}
                            />
                        </div>
                        <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
                    </div>
                )
        
            })}

        </div>
    )
}

export default Connection;
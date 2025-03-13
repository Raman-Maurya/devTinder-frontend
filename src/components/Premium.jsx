import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {


    const handleBuyClick = async (type) =>{
        const order = await axios.post(BASE_URL + "/payment/create",{membershipType: type},{
            withCredentials:true,
        });

const {amount, keyId, currency, order_id, notes} = order.data;

const options = {
 key: keyId, // Replace with your Razorpay key_id
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency,
        name: "Dev Tinder",
        description: "Connect to other Developers",
        order_id: order_id, // This is the order_id created in the backend
        prefill: {
          name: notes.firstName + " " + notes.lastName,
            email: notes.emailId,
          contact: '9999999999'
        },
        theme: {
          color: '#4169E1'
        },

      };
      const rzp = new window.Razorpay(options);
    rzp.open();
    };
    return (
        <div className="flex w-full flex-col px-20 my-10">
  <div className="card bg-base-300 rounded-box grid h-41 place-items-center">
    <div className="font-bold text-2xl py-2">Silver Premium  400Rs/-</div>
    <div>
        <ol>
            <li> - Send 100 connections in a day</li>
            <li> - 2nd feature for Silver Premium</li>
            <li> - 3rd feature for Silver Premium</li>
        </ol>
    </div>
    <button onClick={()=>handleBuyClick("silver")} className="btn btn-primary font-bold my-5">Buy Silver</button>
  </div>
  <div className="divider my-10">OR</div>
  <div className="card bg-base-300 rounded-box grid h-41 place-items-center">
    <div className="font-bold text-2xl py-2">Gold Premium 700Rs/-</div>
    <div>
        <ol>
            <li> - Send 1000 connections in a day</li>
            <li> - 2nd feature for Gold Premium</li>
            <li> - 3rd feature for Gold Premium</li>
        </ol>
    </div>
   
    <button onClick={()=>handleBuyClick("gold")} className="btn btn-primary font-bold my-5">Buy Gold</button>
  </div></div>
    )
}

export default Premium;
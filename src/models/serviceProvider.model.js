import mongoose from 'mongoose'

const serviceproviderSchema=new mongoose.Schema({
  
  business_name:{
    type:String,
    required:true
  },
  fullname:{
    type:String,
    required:true
  },
  password: { type: String, required: true },
  phone_number:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  business_address:{
    type:String
  },
  addressproof:{
    type:String
  },
  service_category:{
    type:String,
    required:true
  },
  sub_category:{
    type:String
  },
  services:[
    {
      serviceName:{
        type:String,
        required:true
      },
      price:{
        type:Number,
        required:true
      }
    }
  ],
  experience:{
    type:String
  },
  emergency_contact:{
    type:String

  }
})

export default mongoose.model('Provider',serviceproviderSchema)
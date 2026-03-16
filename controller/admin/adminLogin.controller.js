const admin = {
    email:"admin@gmail.com",
    password:"12345"
}

export const adminLogin = async ( req , res)=>{
    const {email,password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all fields"
        })
    }
    if(email!==admin.email || password!==admin.password){
        return res.status(400).json({
            success:false,
            message:"Invalid credentials"
        })
    }
    const token = "adminAccessToken"
    return res.status(200).json({
        success:true,
        message:"Admin login successful",
        token:token
    })

}
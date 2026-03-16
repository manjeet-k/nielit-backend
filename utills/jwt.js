import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "nielit-computer-course";

export const generateToken = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2d"
    })
    return token;
}
export const verifyToken = (token) => {
    const decode = jwt.verify(token, JWT_SECRET)
    return decode;
}



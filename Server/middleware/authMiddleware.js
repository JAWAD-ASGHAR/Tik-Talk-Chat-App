import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;

    if (!token) {
        return response.status(401).json({message: "You are unauthenticated!"});
    }
    jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
        if (error) {
            return response.status(401).json({message: "Token is not valid!"});
        } 
        request.userId = payload.userId;
        next();
    })
}
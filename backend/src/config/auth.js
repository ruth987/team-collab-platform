module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'hello-ethiopia',
    jwtExpiresIn: '1d',
}
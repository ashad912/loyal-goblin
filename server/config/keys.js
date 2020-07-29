export default {
    nodeEnv: process.env.NODE_ENV || 'dev',
    dbPort: process.env.PORT || 4000,
    registerKey: process.env.REGISTER_KEY,
    mongoURL: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/loyalgoblin',
    jwtSecret: process.env.JWT_SECRET || 'devJwtSecret',
    adminJwtSecret: process.env.ADMIN_JWT_SECRET || 'devAdminJwtSecret',
    barmanJwtSecret: process.env.BARMAN_JWT_SECRET || 'devBarmanJwtSecret',
    secretRecaptcha: process.env.SECRET_RECAPTCHA_KEY || '6Ldy0ssUAAAAAJ_SDkdPnpS-hvr8WuPwUSyDTmnM',
    senderGmail: process.env.SENDER_GMAIL || 'yourLoyalGoblinGmail@gmail.com',
    emailPass: process.env.EMAIL_PASS || 'loyalgoblinpassword',
    replica: process.env.REPLICA ? true : false,
    replicaName: process.env.REPLICA_NAME,
    demoKey: process.env.DEMO_KEY
}

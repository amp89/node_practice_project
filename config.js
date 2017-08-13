const env = process.env;

export default {
    mgp:"lakjsdf0898Y987typuih%967tuy$E^%*R&FTG*YUHIO&6re5423$#65d",
    mus:"npp",
    mongodbUri: 'mongodb://localhost:27017/test',
    port: env.PORT || 8080,
    host: env.HOST || "0.0.0.0",
    get serverUrl(){
        return `http://${this.host}:${this.port}`;
    }
};

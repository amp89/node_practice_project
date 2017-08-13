const env = process.env;


export default {
    mgp:"3t489ygwehruoisd8y4t93hu5egiruegy94tuhowg5reya8e974uhtgq3ij5r8gueta9hbf8gr9ye7ughoit",
    mus:"npp",
    mongodbUri: `mongodb://npp:3t489ygwehruoisd8y4t93hu5egiruegy94tuhowg5reya8e974uhtgq3ij5r8gueta9hbf8gr9ye7ughoit@localhost:27017/test`,
    port: env.PORT || 8080,
    host: env.HOST || "0.0.0.0",
    get serverUrl(){
        return `http://${this.host}:${this.port}`;
    }
};

import App from "./app";
import { port } from "./config";
const appInstance = new App();
appInstance.listen(port);

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
    console.log('📥 SIGTERM signal received');
    await App.shutdown();
});

process.on('SIGINT', async () => {
    console.log('📥 SIGINT signal received');
    await App.shutdown();
});


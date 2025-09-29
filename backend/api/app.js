import app from "../server.js";
import scriptures from "./scriptures.js";
import users from "./users.js";

app.use('/scriptures', scriptures);
app.use('/users', users);

export default app;
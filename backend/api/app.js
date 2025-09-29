import app from "../server.js";
import scriptures from "../routes/scriptures.js";
import users from "../routes/users.js";

app.use('/scriptures', scriptures);
app.use('/users', users)

export default app
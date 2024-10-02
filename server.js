const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const dotenv = require("dotenv");
const emailRoutes = require('./routes/emailRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const reclamationRoutes = require('./routes/reclamationRoutes');
const areasRoutes = require('./routes/areasRoutes');
const serviceRoutes = require('./routes/service');
const languagesTRoutes = require('./routes/languagesT');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
dotenv.config();


cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });

const bodyParser = require('body-parser');
const AuthRoute  = require('./routes/auth') 

mongoose.connect(process.env.database_uri);


const db = mongoose.connection;

db.on('error', (err) => {
   console.log(err);
});

db.once('open', () => {
   console.log('Database Connection Established!');
});

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(fileUpload()); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
   res.json({message:
      "hello there"
   });
})
app.use('/api', AuthRoute);
app.use('/api/email', emailRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/reclamations', reclamationRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/languagesT', languagesTRoutes);

const server = http.createServer(app);
server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

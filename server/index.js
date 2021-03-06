require("dotenv").config()

import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";

// configs
import googleAuthConfig from "./config/google.config";
import routeConfig from "./config/route.config";

// microservice routes
import Auth from "./API/Auth";
import Restaurant from "./API/Restaurant";
import Food from "./API/Food";
import Image from "./API/Image";
import Order from "./API/Orders";
import Reviews from "./API/Reviews";
import Menu from "./API/Menu";
import User from "./API/User";
import MailService from "./API/Mail";
import Payments from "./API/Payments";

// Database connection 
import ConnectDB from "./database/connection";

const zomato = express();
const PORT = 4000;

// application middlewares
zomato.use(express.json());
zomato.use(express.urlencoded({ extended: false }))
zomato.use(cors());
zomato.use(helmet());
zomato.use(passport.initialize());
zomato.use(passport.session());

// passport configuration
googleAuthConfig(passport);
routeConfig(passport);

// application routes
zomato.use("/auth", Auth);
zomato.use("/restaurant", Restaurant);
zomato.use("/food", Food);
zomato.use("/image", Image);
zomato.use("/order", Order);
zomato.use("/reviews", Reviews);
zomato.use("/menu", Menu);
zomato.use("/user", User);
zomato.use("/mail", MailService);
zomato.use("/payments", Payments);

zomato.get("/", (req, res) => res.json({ message: "Setup success!" }))

zomato.listen(PORT, () => {
    ConnectDB()
        .then(() => console.log(`Server is running on port ${PORT}`))
        .catch(() => console.log("Server is running, but database connection failed"))
})
import express from "express";
import passport from "passport";

// Database Model
import { RestaurantModel } from "../../database/allModels";

// Validation
import { ValidateRestaurantID } from "../../validation/food";
import { ValidateRestaurantCity, ValidateRestaurantSearchString } from "../../validation/restaurant";

const Router = express.Router();

/*
Route           /
Description     Get all restaurant details based on city
Access          PUBLIC
Parameters      none
Method          GET
*/
Router.get("/", async (req, res) => {
    try {
        await ValidateRestaurantCity(req.query);

        const { city } = req.query;
        const restaurants = await RestaurantModel.find({ city });

        return res.json({ restaurants });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

/*
Route           /
Description     Get individual restaurant details based on id
Access          PUBLIC
Parameters      _id
Method          GET
*/
Router.get("/:_id", async (req, res) => {
    try {
        await ValidateRestaurantID(req.params);

        const { _id } = req.params;
        const restaurant = await RestaurantModel.findOne({ _id });

        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found!" })
        }

        return res.json({ restaurant });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

/*
Route           /search
Description     Get restaurant details based on search string
Access          PUBLIC
Parameters      none
Body            searchString
Method          GET
*/
Router.get("/search", async (req, res) => {
    try {
        await ValidateRestaurantSearchString(req.body);

        const { searchString } = req.body;

        const restaurants = await RestaurantModel.find({
            name: { $regex: searchString, $options: "i" }
        })

        if (!restaurants) {
            res.status(404).json({ error: `No Restaurant matched with ${searchString}` });
        }

        return res.json({ restaurants });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

export default Router;
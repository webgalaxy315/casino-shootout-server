const axios = require("axios");
const rand = require("random-seed").create();
require("dotenv").config();

module.exports = {
    Play: async (req, res) => {
        try {
            let users = [];

            const { token, betAmount } = req.body;

            const bet_Amount = parseFloat(betAmount);

            users[token] = {
                token: token,
                betAmount: bet_Amount
            }
            try {
                await axios.post(process.env.PLATFORM_SERVER + "api/games/bet", {
                    token: users[token].token,
                    amount: users[token].betAmount
                });
            } catch {
                throw new Error("BET ERROR!");
            }

            res.json({
                Message: "SUCCESS!"
            })

        } catch (err) {
            res.json({

                Message: err.message
            });
        }
    },
    ball: async (req, res) => {
        try {
            try {
                let keeper_number = await rand.intBetween(0, 4);
                res.json({
                    keeper_number: keeper_number,
                    Message: "SUCCESS!"
                })

            } catch (err) {
                throw new Error("DATA ERROR!");
            }
        } catch (err) {
            res.json({

                Message: err.message
            });
        }
    },
    _random: async (req, res) => {
        try {
            try {
                let ball_number = await rand.intBetween(0, 4);
                let keeper_number = await rand.intBetween(0, 4);
                res.json({
                    ball_number: ball_number,
                    keeper_number: keeper_number,
                    Message: "SUCCESS!"
                })

            } catch (err) {
                throw new Error("DATA ERROR!");
            }
        } catch (err) {
            res.json({

                Message: err.message
            });
        }
    },
    _cash: async (req, res) => {
        try {
            try {
                let users = [];
                let earnAmount = 0.0;
                const { token, betAmount, goalNumber } = req.body;
                const goal_number = parseInt(goalNumber);
                const bet_Amount = parseInt(betAmount);
                users[token] = {
                    token: token,
                    betAmount: bet_Amount,
                    goalNumber: goal_number
                }

                if (users[token].goalNumber == 0) {
                    earnAmount = 0;
                } else if (goal_number == 1) {
                    earnAmount = users[token].betAmount * 1.92;
                } else if (users[token].goalNumber == 2) {
                    earnAmount = users[token].betAmount * 3.84;
                } else if (users[token].goalNumber == 3) {
                    earnAmount = users[token].betAmount * 7.68;
                } else if (users[token].goalNumber == 4) {
                    earnAmount = users[token].betAmount * 15.36;
                } else if (users[token].goalNumber >= 5) {
                    earnAmount = users[token].betAmount * 30.72;
                }
                res.json({
                    earnAmount: earnAmount,
                    Message: "SUCCESS!"
                })
                try {
                    await axios.post(process.env.PLATFORM_SERVER + "api/games/winlose", {
                        token: users[token].token,
                        amount: earnAmount,
                        winState: earnAmount > 0 ? true : false
                    });
                } catch (err) {
                    throw new Error("SERVER ERROR!");
                }
            } catch (err) {
                throw new Error("DATA ERROR!");
            }
        } catch (err) {
            res.json({

                Message: err.message
            });
        }
    },
};

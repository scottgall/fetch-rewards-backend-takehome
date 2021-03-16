# Fetch Rewards Coding Exercise - Backend Software Engineering
This repo includes an Express.js server offering a REST API with Node.js that accepts HTTP request and returns responses based on conditions outlined later in this readme. 

## Project Premise
* There is a `user` that can have `points` in their account from various `payers`.
* Payers submit `transactions` to add or subtract points from a user.
  * Transactions are stored in memory on the backend.
  * The total points per payer cannot go below 0.
* The user can `spend` points.
  * The user's total points can't go below 0.
  * When spending points, the oldest points are spent first based on their transaction's timestamp, regardless of payer.

## Getting Started
* Must have [Node.js](https://nodejs.org/) version v10.0.0 installed.
  * Verify version by running the command below in your terminal.
  ```
  node --version
  ```
1) Clone repo
    ```
    git clone https://github.com/scottgall/fetch-rewards-backend-takehome.git
    ```
2) Go to the project's root directory
    ```
    cd /my/path/to/fetch-rewards-backend-takehome
    ```
3) Install dependencies
    ```
    npm install
    ```
4) Start the server!
    ```
    npm start
    ```
    Your terminal should read:
    ```
    Server running on port: http://localhost:5000
    ```
5) Verify the app is running by visiting http://localhost:5000 in your browser. You should see the following greeting:
>![homepage greeting](/assets/images/greeting.jpg)
    





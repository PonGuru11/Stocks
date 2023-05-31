const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

const apiKey = 'YOUR_API_KEY'; // Replace with your Alpha Vantage API key

app.use(express.json());
app.use(cors());


app.post('/stocks', async (req, res) => {
    try {
      const symbols = req.body.symbols; // Read stock symbols from the request body
  
      if (!symbols || !Array.isArray(symbols)) {
        return res.status(400).json({ message: 'Invalid stock symbols' });
      }
  
      const stockData = [];
  
      for (const symbol of symbols) {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${apiKey}`
        );
  
        const data = response.data['Global Quote'];
        if (data) {
          const open = parseFloat(data['02. open']); // Opening price of the day
          const high = parseFloat(data['03. high']); // Highest price of the day
          const low = parseFloat(data['04. low']); // Lowest price of the day
          const price = parseFloat(data['05. price']); // Current price
          const volume = parseFloat(data['06. volume']); // Trading volume
          const latestTradingDay = data['07. latest trading day']; // Date of the latest trading day
          const previousClose = parseFloat(data['08. previous close']); // Previous closing price
          const change = parseFloat(data['09. change']); // Price change
          const changePercent = parseFloat(data['10. change percent']); // Price change percentage
  
          const stock = {
            symbol,
            high,
            open,
            low,
            price,
            volume,
            latestTradingDay,
            previousClose,
            change,
            changePercent,
          };
  
          stockData.push(stock);
        }
      }
  
      res.json(stockData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

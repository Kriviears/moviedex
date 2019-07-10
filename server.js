'use strict';


require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const moviedex = require('./moviedex.json');
const PORT = process.env.PORT || 8000;
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

const app = express();

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authTOKEN = req.get('Authorization');

  if(!authTOKEN || apiToken !== authTOKEN.split(' ')[1]){
    return res.status(401).json({ error: 'Unauthorized request'});
  }

  next();
});

app.use((error, req, res, next)=>{
  let response;
  if(process.env.NODE_ENV === 'production'){
    response = { error: {message: 'server error'}};
  }else {
    response = { error };
  }
  res.status(500).json(response);
});


function handleGetMovies(req, res){
  const { genre, country, avg_vote } = req.query;

  let response = moviedex;
  
  if(genre){
    console(genre);

    response = response.filter(movie =>
      movie.genre.includes(genre)
    );
  }

  if(country){
    console(country);
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase)    
    );
  }

  if(avg_vote){
    response = response.filter(movie =>
      Number(movie.avg_vote) === avg_vote    
    );
  }

  res.json(response);
}

app.get('/movies', handleGetMovies);



app.listen(PORT, ()=>{

});
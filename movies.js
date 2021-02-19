// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/srYya1ZlI97Au4jUYAktDe3avyA.jpg` to get the 
// complete image URL

window.addEventListener('DOMContentLoaded', async function(event) {
    
  let db = firebase.firestore()
  let apiKey = '0e87e1658fbd62ac8b311e5364fdc5d3'
  let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
  //console.log(response)
  let movies = await response.json()
  //console.log(movies)

  // loop through the API data and display the movie posters on the webpage 
  for (let i = 0; i < movies.results.length; i++) {
    let movieList = movies.results[i]
    let movieID = movieList.id
    let moviePoster = movieList.poster_path
    console.log(movieList)
    let movie = document.querySelector('.movies').insertAdjacentHTML('beforeend', `
      <div class="mov-${movieID} w-1/5 p-4">
        <img src="https://image.tmdb.org/t/p/w500/${moviePoster}" class="w-full">
        <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      </div>
    `)

    // check the database to see if the movie was already watched
    let querySnapshot = await db.collection('watched').get()
    let alreadyWatched = querySnapshot.docs
    for (let i = 0; i < alreadyWatched.length; i++) {
      //console.log(alreadyWatched[i].id)
      if (alreadyWatched[i].id == movieID) {
      document.querySelector(`.mov-${movieID}`).classList.add('opacity-20')
      }
    }
  
    // if the watched button is clicked, add opacity and write to the database
    let watchButton = document.querySelector(`.mov-${movieID} .watched-button`).addEventListener('click', async function(event) {
      event.preventDefault()
      //console.log(`I watched movie with this ID: ${movieID}`)
      document.querySelector(`.mov-${movieID}`).classList.add('opacity-20')
      let newDoc = await db.collection('watched').doc(`${movieID}`).set({})
    })
      
  }
    
})
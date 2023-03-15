import axios from 'axios';


export const fetchData = (book: string): Promise<any> => {
    const apiUrl = `https://openlibrary.org/search.json?title=${book}`;
  
    return axios.get(apiUrl, {
      mode: 'no-cors'
    } as any)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

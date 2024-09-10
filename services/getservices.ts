import axios from "axios";

const GetDataService = async (endoint: string) => {
    try {
        const baseURL = `https://us-central1-smarttelescope.cloudfunctions.net/api/`
        const response= await axios.get(baseURL + endoint)
          return response  

    } catch (error) {
        console.error('Error fetching data: ', error);

    }
}
export default GetDataService;
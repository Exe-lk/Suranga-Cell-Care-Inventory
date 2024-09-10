import axios from "axios";

const PutDataService = async (endoint: string, data: any) => {
    try {
        const baseURL = `https://us-central1-smarttelescope.cloudfunctions.net/api/`
        const response = await axios.put(baseURL + endoint, data)
        return response

    } catch (error) {
        console.error('Error fetching data: ', error);

    }
}
export default PutDataService;
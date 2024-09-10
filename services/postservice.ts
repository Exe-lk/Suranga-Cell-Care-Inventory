import axios from "axios";

const PostDataService = async (endoint: string, data: any) => {
    try {
        try {
            const baseURL = `https://us-central1-smarttelescope.cloudfunctions.net/api/`
            const response = await axios.post(baseURL + endoint, data)
            return response
    
        } catch (error) {
            console.error('Error fetching data: ', error);
    
        }
    } catch (error) {
        console.error('Error fetching data: ', error);

    }
}
export default PostDataService;
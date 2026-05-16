import axios from "axios"
//import { serverUrl} from "../App"// // written THIS FOR JUST TO AVOID BlanK auth PAge 
import { setUserData } from "../redux/userSlice"

const serverUrl = "http://localhost:8000"

export const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(
      serverUrl + "/api/user/currentUser",
      { withCredentials: true }
    )

    dispatch(setUserData(result.data))

  } catch (error) {
    console.log(error)
    dispatch(setUserData(null))
  }
}

export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(serverUrl+ "/api/notes/generate-notes" , payload, {withCredentials:true})
    console.log(result.data)
    return result.data

  } catch (error) {
    console.error(error)
  }
}

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl+ "/api/pdf/generate-pdf" , {result} , {
            responseType:"blob" , withCredentials:true
        })

        const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamNotesAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
    } catch (error) {
         throw new Error("PDF download failed");

    }
}
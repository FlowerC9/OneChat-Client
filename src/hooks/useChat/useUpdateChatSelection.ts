import { useGetChatsQuery } from "../../services/api/chatApi"
import { updateSelectedChatDetails, updateSelectedChatId } from "../../services/redux/slices/chatSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useUpdateChatSelection = () => {

    const dispatch = useAppDispatch()

    const {data:chats} = useGetChatsQuery()
    
    const updateChatSelection = (chatId:string) =>{  

        dispatch(updateSelectedChatId(chatId))

        const chatDetails = chats?.find(chat=>chat._id===chatId)

        if(chatDetails) {
            dispatch(updateSelectedChatDetails(chatDetails))
        }
    }

    return {
        updateChatSelection
    }

}

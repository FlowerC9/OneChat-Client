import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useClearAdditionalMessagesOnChatChange } from '../../hooks/useMessages/useClearAdditionalMessagesOnChatChange'
import { useDeleteMessage } from '../../hooks/useMessages/useDeleteMessage'
import type { IUser } from "../../interfaces/auth"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import type { IMessage } from "../../interfaces/messages"
import { useLazyGetMessagesByChatIdQuery } from '../../services/api/messageApi'
import { TypingIndicatorWithUserList } from "../chat/TypingIndicatorWithUserList"
import { CircleLoading } from '../shared/CircleLoading'
import { MessageCard } from "./MessageCard"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
  selectedChatDetails:IChatWithUnreadMessages
  messageContainerRef: React.RefObject<HTMLDivElement>
  totalPages:number
}
export const MessageList = ({messages,loggedInUserId,isGroupChat,totalPages,selectedChatDetails,messageContainerRef}:PropTypes) => {

  const [fetchMoreMessages,{isFetching}] = useLazyGetMessagesByChatIdQuery()
  const {clearExtraPreviousMessages} = useClearAdditionalMessagesOnChatChange()

  const [page,setPage] = useState<number>(1)
  const [hasMore,setHasMore] = useState<boolean>(true)
  const prevHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0)


  const [isNearBottom, setIsNearBottom] = useState(true);

  const [openContextMenuMessageId, setOpenContextMenuMessageId] = useState<string>()
  const [editMessageId,setEditMessageId] = useState<string>()
  const [reactionMenuMessageId,setReactionMenuMessageId] = useState<string | undefined>()

  const deleteMessage = useDeleteMessage()

  const handleSetOpenContextMenuMessageId=useCallback((messageId: string)=>{
    setOpenContextMenuMessageId(messageId)
  },[])

  useLayoutEffect(()=>{

    setPage(1)

    const container = messageContainerRef.current
    if(container){

      const timeoutId = setTimeout(() => {
        container.scrollTop = container.scrollHeight
      }, 100);

      return ()=> {
        clearExtraPreviousMessages(selectedChatDetails._id)
        clearTimeout(timeoutId)
      }

    }
  },[selectedChatDetails._id])

  useEffect(()=>{
    if(totalPages===1){
      setHasMore(false)
    }
    else{
      setHasMore(true)
    }
  },[totalPages])

  useEffect(()=>{

    if(page>1){
      fetchMoreMessages({_id:selectedChatDetails._id,page})
      if(page === totalPages) setHasMore(false)
    }

  },[page,totalPages])


  const handleScroll = useCallback(() => {
    const container = messageContainerRef.current;
  
    if (container) {
      // Check if we are close to the top to load more messages
      if (container.scrollTop <= 284 && hasMore && !isFetching) {
        prevHeightRef.current = container.scrollHeight;
        prevScrollTopRef.current = container.scrollTop;
        setPage((prev) => prev + 1);
      }
  
      // Check if we are near the bottom
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
      setIsNearBottom(isAtBottom);
    }
  }, [hasMore, isFetching]);
  

  useEffect(() => {
    const container = messageContainerRef.current;

    if (container && isNearBottom) {
      prevHeightRef.current = 0;
      prevScrollTopRef.current = 0
      setTimeout(() => container.scrollTop = container.scrollHeight, 50);
    } 
    
  }, [messages]);

  useEffect(()=>{
    const container = messageContainerRef.current;

    if(page>1 && container){

      if(!isFetching){
        container.scrollTop = container.scrollHeight - prevHeightRef.current + prevScrollTopRef.current
      }

    }
  },[isFetching,page])
  
  useEffect(()=>{

    const container = messageContainerRef.current;

    if(container &&  selectedChatDetails.userTyping.length>0){

      if(isNearBottom){
        container.scrollTop = container.scrollHeight
      }
    }
  },[selectedChatDetails.userTyping])


  return (
    <>
    {/* <p className='text-text'> total page {totalPages}</p>
    <p className='text-text'>page {page}</p>
    <p className='text-text'>isFetcing {isFetching?"true":"false"}</p>
    <p className='text-text'>bottom {isNearBottom?"true":"false"}</p> */}
    
    <div ref={messageContainerRef} onScroll={handleScroll} className="relative flex h-full flex-col gap-y-4 max-xl:gap-y-2 overflow-y-auto overflow-x-hidden">
      
      
      {
        isFetching &&
        <CircleLoading/>
      }
      {messages.map((message,index) => (

        <MessageCard
          key={index}
          selectedChatDetails={selectedChatDetails}
          loggedInUserId={loggedInUserId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
          editMessageId={editMessageId}
          setEditMessageId={setEditMessageId}
          onContextMenuOpen={handleSetOpenContextMenuMessageId}
          deleteMessage={deleteMessage}
          isContextMenuOpen={openContextMenuMessageId===message._id}
          isGroupChat={isGroupChat} 
          message={message}
          myMessage={loggedInUserId===message.sender._id}
          reactionMenuMessageId={reactionMenuMessageId}
          setReactionMenuMessageId={setReactionMenuMessageId} 
        />

      ))}

      <AnimatePresence>
      {
        isNearBottom && selectedChatDetails.userTyping?.length && 
        <motion.div className="w-fit" variants={{hide:{opacity:0,x:-10},show:{opacity:1,x:0}}} initial="hide" animate="show" exit="hide">
            <TypingIndicatorWithUserList
              isGroupChat={selectedChatDetails.isGroupChat}
              users={selectedChatDetails.userTyping}
            />
        </motion.div>
      }
      </AnimatePresence>

    </div>
    </>
  )
}
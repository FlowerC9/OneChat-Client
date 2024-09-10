import { useGetSharedKey } from "../../hooks/useAuth/useGetSharedKey"
import { IChatMember, IChatWithUnreadMessages } from "../../interfaces/chat"
import { IMessage, IUnreadMessage } from "../../interfaces/messages"
import { ActiveDot } from "../ui/ActiveDot"
import { TypingIndicator } from "../ui/TypingIndicator"
import { useCallback, useEffect, useState } from "react"
import { decryptMessage } from "../../utils/encryption"
import { RenderAppropriateUnreadMessage } from "../messages/RenderAppropriateUnreadMessage"
import { formatRelativeTime } from "../../utils/helpers"
import { VerificationBadgeIcon } from "../ui/icons/VerificationBadgeIcon"

type PropTypes = {
  chatId:string
  chatName:string
  isGroupChat:boolean
  members:IChatWithUnreadMessages['members']
  avatar:string
  unreadMessage:IUnreadMessage
  latestMessage:IMessage
  loggedInUserId:string
  isTyping:boolean
  isLg:boolean
  createdAt:Date
  selectedChatDetails:IChatWithUnreadMessages | undefined | null
  updateSelectedChatId:(chatId:string)=>void
  toggleChatBar:()=>void
}

export const ChatCard = ({chatName,isGroupChat,createdAt,loggedInUserId,latestMessage,members,selectedChatDetails,avatar,isLg,chatId,unreadMessage,isTyping,updateSelectedChatId,toggleChatBar}:PropTypes) => {

  const getSharedKey =  useGetSharedKey()

  const [decryptedMessage,setDecryptedMessage] = useState<string>()
  const [unreadDecryptedMessage,setUnreadDecryptedMessage] = useState<string>()
  const [sharedKey,setSharedKey] = useState<CryptoKey>()

  const otherMember = members.filter(member=>member._id!==loggedInUserId)[0]
  
  const handleSetSharedKey = useCallback(async(otherMember:IChatMember)=>{
    const key = await getSharedKey(loggedInUserId,otherMember)
    if(key) setSharedKey(key)
  },[loggedInUserId,otherMember])

  const handleSetDecryptMessage = useCallback(async(sharedKey:CryptoKey)=>{
    if(latestMessage?.content?.length){
      const msg = await decryptMessage(sharedKey,latestMessage.content)
      if(msg) setDecryptedMessage(msg)
    }
  },[])

  const handleSetUnreadDecryptedMessage = useCallback(async(message:string)=>{
    if(sharedKey){
      const msg = await decryptMessage(sharedKey,message)
      if(msg) setUnreadDecryptedMessage(msg)
    }
  },[sharedKey])


  useEffect(()=>{
    if(!isGroupChat && otherMember){
      handleSetSharedKey(otherMember)
    }
  },[isGroupChat,otherMember])

  useEffect(()=>{
    if(sharedKey){
      if(unreadMessage.message?.content){
        handleSetUnreadDecryptedMessage(unreadMessage.message?.content)
      }
      if(latestMessage?.content?.length){
        handleSetDecryptMessage(sharedKey)
      }
    }
  },[sharedKey,unreadMessage.message?.content,latestMessage?.content])


  const handleChatCardClick = useCallback((chatId:string) =>{

    if(selectedChatDetails?._id!==chatId){
      updateSelectedChatId(chatId)
    }

    if(isLg){
      toggleChatBar()
    }

  },[])

  const renderOnlineStatus = () => {

    if (isGroupChat) {

      const onlineMembers = members.filter((member) => member._id !== loggedInUserId && member.isActive).length;

      return onlineMembers > 0 ? 
        <div className="text-sm text-secondary-darker flex items-center gap-x-1 ml-1">
          <ActiveDot/>
          <p>{onlineMembers}</p>
        </div>
        : 
       null;
    } 
    
    else {
      const otherMember = members.find((member) => member._id !== loggedInUserId);
      return otherMember?.isActive ? 
        <ActiveDot/>
        : 
        null
    }
  };


  return (
    <div onClick={()=>handleChatCardClick(chatId)} className={` ${selectedChatDetails?._id===chatId?"bg-secondary-dark":""}  text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3`}>

        <img className="aspect-square w-16 rounded-full object-cover max-md:w-14" src={avatar} />

        <div className="w-full flex flex-col gap-y-1">

            <div className="flex items-center gap-x-2 justify-between w-full">

                <div className="flex items-center gap-x-1">

                    <p className="font-medium break-words">{chatName.substring(0,16)}</p>
                    {!isGroupChat && otherMember?.verificationBadge && <VerificationBadgeIcon/>}
                    {renderOnlineStatus()}
                
                </div>
                
        
                  <p className="text-sm text-secondary-darker">
                    {formatRelativeTime(new Date(
                      unreadMessage.message.createdAt ? unreadMessage.message.createdAt
                      :
                      latestMessage?.createdAt ? latestMessage.createdAt
                      :
                      createdAt
                    ))}
                  </p>
                

            </div>
            
            <div className="flex justify-between items-center">
                
                  <p className="text-sm text-secondary-darker">
                    
                    {
                      isTyping ? 
                        <div className="w-12">
                          <TypingIndicator/>
                        </div>
                      :
                       unreadMessage.count===0?

                          // latest message display
                          isGroupChat?  // for group chat
                            RenderAppropriateUnreadMessage({
                              attachments:latestMessage?.attachments?.length?true:false,
                              content:latestMessage?.content,
                              poll:latestMessage?.isPoll,
                              url:latestMessage?.url?true:false
                            })
                          :
                          RenderAppropriateUnreadMessage({  // for private chat
                            attachments:latestMessage?.attachments?.length?true:false,
                            content:decryptedMessage,
                            poll:latestMessage?.isPoll,
                            url:latestMessage?.url?true:false
                          })
                      :
                      // unread Message display
                      isGroupChat ?   // for group chat
                      RenderAppropriateUnreadMessage({
                        attachments:unreadMessage?.message?.attachments,
                        content:unreadMessage?.message?.content,
                        poll:unreadMessage?.message?.poll,
                        url:unreadMessage?.message?.url
                      })
                      : // for private chat
                      RenderAppropriateUnreadMessage({
                        attachments:unreadMessage?.message?.attachments,
                        content:unreadDecryptedMessage,
                        poll:unreadMessage?.message?.poll,
                        url:unreadMessage?.message?.url
                      })
                    }
                    
                    
                  </p>
                { 
                  unreadMessage?.count > 0 && 
                  <p className="bg-primary flex items-center justify-center text-white rounded-full h-5 w-5 p-2">
                    { unreadMessage?.count }
                  </p>
                }
            </div>

        </div>

    </div>
  )
}
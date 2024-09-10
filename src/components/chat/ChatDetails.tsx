import { IAttachment } from "../../interfaces/attachment"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { AvatarList } from "../shared/AvatarList"
import { ChevronRightIcon } from "../ui/icons/ChevronRightIcon"
import { AddMemberSection } from "./AddMemberSection"
import { ChatDetailsHeader } from "./ChatDetailsHeader"
import { RemoveMemberSection } from "./RemoveMemberSection"
import { SharedMedia } from "./SharedMedia"


type PropTypes = {
    isAdmin:boolean
    isGroupChat:boolean
    chatAvatar:string
    chatName:string
    members:IChatWithUnreadMessages['members']
    attachments:IAttachment
    isAttachmentsFetching:boolean
    selectedChatId:string
    toggleChatDetailsBar: () => void
    fetchMoreAttachments: (chatId: string, page: number) => void
}

export const ChatDetails = ({isAdmin,chatName,chatAvatar,members,isGroupChat,attachments,selectedChatId,toggleChatDetailsBar,fetchMoreAttachments}:PropTypes) => {

  return (
    
    <div className="flex flex-col justify-center items-center gap-y-7 text-text relative">
        
        <button onClick={toggleChatDetailsBar} className="absolute left-0 top-1 hidden max-2xl:block">
          <ChevronRightIcon/>
        </button>

        <div className="flex flex-col gap-y-4 items-center">

            <ChatDetailsHeader
              isGroupChat={isGroupChat}
              isAdmin={isAdmin}
              avatar={chatAvatar}
              chatName={chatName}
              membersLength={members.length}
            />
            
        </div>

        <div className="flex flex-col gap-y-6 w-full">
            
            <div className="flex flex-col gap-y-4">

                <div className="flex justify-between items-center">

                    <div className="flex items-center">

                        <AvatarList w={8} h={8} avatars={members.slice(0,4).map(member=>member.avatar)}/>
                        {
                          ((members.length-4)>0) && 
                          <p className="w-8 h-8 rounded-full bg-secondary-dark flex justify-center items-center">+{members.length-4}</p>
                        }
                    </div>

                    {isGroupChat && <p>See all</p>}

                </div>

                {
                  isAdmin && isGroupChat && 
                  
                  <>
                  <AddMemberSection/>
                  <RemoveMemberSection/>
                  </>
                }

            </div>

            
            {
              <SharedMedia
                selectedChatId={selectedChatId}
                attachments={attachments}
                fetchMoreAttachments={fetchMoreAttachments}
              />
            }

        </div>

    </div>
  )
}

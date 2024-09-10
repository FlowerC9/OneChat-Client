import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'
import { useLogout } from "../../hooks/useAuth/useLogout"
import { useOpenAddFriendForm } from "../../hooks/useUI/useOpenAddFriendForm"
import { useOpenFriendRequestForm } from "../../hooks/useUI/useOpenFriendRequestForm"
import { useOpenProfileForm } from "../../hooks/useUI/useOpenProfileForm"
import { useToggleChatBar } from "../../hooks/useUI/useToggleChatBar"
import { useToggleGroupChatForm } from '../../hooks/useUI/useToggleGroupChatForm'
import { useToggleNavMenu } from "../../hooks/useUI/useToggleNavMenu"
import { useToggleSettingsForm } from '../../hooks/useUI/useToggleSettingsForm'
import { useClickOutside } from '../../hooks/useUtils/useClickOutside'
import { useUpdateTheme } from "../../hooks/useUtils/useUpdateTheme"
import { useGetUserFriendRequestsQuery } from "../../services/api/requestApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectNavMenu, selectisDarkMode } from "../../services/redux/slices/uiSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { Avatar } from "../ui/Avatar"
import { FriendRequestButton } from "./FriendRequestButton"
import { NavMenu } from "./NavMenu"
import { HamburgerIcon } from '../ui/icons/HamburgerIcon'

export const Navbar = () => {


  const isNavMenuOpen = useAppSelector(selectNavMenu)
  const navMenuRef = useRef<HTMLUListElement>(null)

  const {data:friendRequests} = useGetUserFriendRequestsQuery()


  const isDarkMode = useAppSelector(selectisDarkMode)
  const toggleNavMenu = useToggleNavMenu()


  const openNewGroupChatForm = useToggleGroupChatForm()
  const openAddFriendForm = useOpenAddFriendForm()
  const openFriendRequestForm = useOpenFriendRequestForm()
  const openProfileForm = useOpenProfileForm()
  const logoutUser = useLogout()
  const toggleChatBar = useToggleChatBar()
  const toggleSettingsForm = useToggleSettingsForm()

  const loggedInUser = useAppSelector(selectLoggedInUser)

  useClickOutside(navMenuRef,()=>toggleNavMenu())


  const updateTheme = useUpdateTheme() 

  return (
    <nav className="flex items-center h-14 justify-around shadow bg-background text-text select-none">

      <button onClick={toggleChatBar} className="hidden max-lg:block">
        <HamburgerIcon/>
      </button>


      <h4 className="text-3xl font-Shantell-Sans font-medium">OneChat</h4>

      <div className="flex item-center gap-x-10">
              {
                friendRequests && friendRequests?.length>0 &&   

                <FriendRequestButton 
                 numberOfFriendRequest={friendRequests.length} 
                 openFriendRequestForm={openFriendRequestForm}
                />

              }

              {
                isDarkMode?
                <div onClick={()=>updateTheme("light")} className="flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                </div>
                :
                <div onClick={()=>updateTheme("dark")} className="flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                </div>
              }

              <div className="relative shrink-0">

                  <Avatar
                   cursor="pointer"
                   onClick={toggleNavMenu}
                   imgUrl={loggedInUser?.avatar!}
                   width={10}
                   height={10}
                   alt={`${loggedInUser?.username} avatar`}
                  />
                  
                  <AnimatePresence>
                    {
                      isNavMenuOpen && 

                      <motion.div variants={{hide:{y:-5,opacity:0},show:{y:0,opacity:1}}} initial="hide" animate="show" exit="hide"  className="bg-secondary-dark w-[15rem] max-lg:md:right-28 max-md:right-1 self-end fixed rounded-lg shadow-2xl p-4 z-50">

                        <NavMenu 
                          openSettingsForm={toggleSettingsForm}
                          openProfileForm={openProfileForm}
                          openAddFriendForm={openAddFriendForm}
                          openNewGroupChatForm={openNewGroupChatForm}
                          logoutUser={logoutUser}
                          ref={navMenuRef}
                        />

                      </motion.div>

                    }
                  </AnimatePresence>
              </div>

      </div>
    </nav>
  )
}

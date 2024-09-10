const DEFAULT_AVATAR = "https://res.cloudinary.com/dh5fjdce9/image/upload/v1717842288/defaultAvatar_q2y2az.png"
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]
const ACCEPTED_FILE_MIME_TYPES = ["application/pdf","application/msword",...ACCEPTED_IMAGE_TYPES]

const AVATARS = [
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1204612/pexels-photo-1204612.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2115681/pexels-photo-2115681.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/10506369/pexels-photo-10506369.jpeg?auto=compress&cs=tinysrgb&w=600"
]

const DB_NAME = "Authentication"
const VERSION = 1
const OBJECT_STORE = "privateKeys"

export {
    DEFAULT_AVATAR,
    ACCEPTED_IMAGE_TYPES,
    AVATARS,
    ACCEPTED_FILE_MIME_TYPES,
    DB_NAME,
    VERSION,
    OBJECT_STORE
}
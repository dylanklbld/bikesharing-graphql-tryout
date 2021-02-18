import { User } from "../models/User";

export const createNewSessionUser = async (name, sessionKey) => {
    const createdAt = Date.now()

    const getExpireDate = (date: number, days: number): Date => {
        const copy = new Date(date)
        copy.setDate(copy.getDate() + days)
        return copy
    }

    const sessionUser = new User({
        name,
        sessionKey,
        created: createdAt,
        expires: getExpireDate(createdAt, 1)
    });
    
    await sessionUser.save();
    return sessionUser
}

export const initSessionUser = async (req, res, next) => {
    const {username, sessionKey} = res.locals.cookie
    const exisitngUser = await User.findOne({name: username, sessionKey}).exec()

    if(!exisitngUser) {
        await createNewSessionUser(username, sessionKey)
    }

    next()
}
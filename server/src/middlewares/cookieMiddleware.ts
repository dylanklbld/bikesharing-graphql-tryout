import crypto from 'crypto'
import humanNames from 'human-names'

const setSessionUserCookies = (res) => {
    let options = {
        maxAge: 10 * 60 * 60 * 1000, // would expire after 10 hours
        httpOnly: true, // The cookie only accessible by the web server
    }

    // random German name
    const username = humanNames.maleDe[Math.floor(Math.random() * Math.floor(68))]
    const sessionKey = crypto.randomBytes(64).toString('hex')
    
    res.cookie('username', username, options).cookie('sessionKey', sessionKey, options)
        
    res.locals.cookie = {
        ...res.locals.cookie,
        username,
        sessionKey
    }
}

export const cookieMiddleware = (req, res, next) => {
    const { headers: { cookie } } = req;

    console.warn(cookie)

    if (cookie) {
        const values = cookie.split(';').reduce((res, item) => {
            const data = item.trim().split('=');
            return { ...res, [data[0]]: data[1] };
        }, {});
        
        res.locals.cookie = values;
        
        if(!(values.username && values.sessionKey)){
            setSessionUserCookies(res)
        }
    }
    else {
        setSessionUserCookies(res)
    }

    next();
}
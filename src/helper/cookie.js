const setAccessToken = (res, accessToken)=>{
    //cookie option
    res.cookie('accessToken', accessToken,{
        maxAge: 5 * 60 * 1000,
        httpOnly: false,
        secure: true,
        sameSite: 'none'
    });
}

const setRefreshToken = (res, refreshToken)=>{
    res.cookie('refreshToken', refreshToken,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: true,
        sameSite: 'none'
    });
}

module.exports = {setAccessToken, setRefreshToken}
/**
 * @api {post} /auth/google/login Request Login on google
 * 
 * @apiVersion        1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                yVoteToken : string,
                email : string,
                name : string
            }
        }
 */

/**
 * @api {post} /auth/kakao/login Request Login on Kakao
 * 
 * @apiVersion        1.0.0
 * @apiName KakaoLogin
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                yVoteToken : string,
                email : string,
                name : string
            }
        }
 */

/**
 * @api {post} /auth/apple/login Request Login on Apple
 * 
 * @apiVersion        1.0.0
 * @apiName AppleLogin
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiBody {id=String} apple user id   
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                yVoteToken : string,
                email : string,
                name : string
            }
        }
 */

/**
 * @api {post} /auth/refresh Refresh access token
 * 
 * @apiVersion        1.0.0
 * @apiName RefreshAccess
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                access : string
            }
        }
 *
 * @apiError (401 NoAuthorization) AuthorizationTokenNeeded
 * @apiErrorExample {json} Error-Response:
       HTTP/1.1 500 Unauthorized
 *     {
 *       "success" : false,
 *       "result" : {
 *              "error" : "The authorization token is needed"   
 *       }
 *     }
 */

/**
 * @api {post} /auth/logout Request Logout
 *
 * @apiVersion        1.0.0
 * @apiName Logout
 * @apiGroup Auth
 *
 * @apiHeader {String} Authorization='Bearer ${string}'
 *
 * @apiBody {access=string} access token to expire
 * @apiBody {refresh=string} refresh token to expire
 */

/**
 * @api {post} /auth/withdrawal Withdrawal User
 * 
 * @apiVersion      1.0.0
 * @apiName Withdrawal
 * @apiGroup Auth
 * 
 * @apiHeader {String} Authorization='Bearer {string}'
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {}
            }
        }
 *
 * 
 */

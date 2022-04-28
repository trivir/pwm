import { rest } from 'msw';

export const handlers = [
    rest.post('/pwm/public/newuser', (req, res, ctx) => {

        let response: string;
        switch (req.url.searchParams.get('processAction')) {
            case 'sendOTP':
                response = `
                {
                    "data": {
                        "token": "H4sIAAAAAAAAAAE_AMD_UFdNLkdDTTEQld3JuMlD5tpm5-ZtFzs1RLZFY_TP5I6A5g1GMndv2PupeAjrSpWMk1BJH0k3YuHAw1pIj-QYnOFyJD8AAAA="
                    },
                    "error": false,
                    "errorCode": 0
                }
                `;
                break;
            case 'verifyOTP':
                response = `
                {
                    "data": {
                        "token": "H4sIAAAAAAAAAAFfAKD_UFdNLkdDTTEQld3JuMlD5tpm5-ZtFzs1OeVtIKLP-9PhyWWtJQmpM_CixGIln4LAZTbaxpS8o0lZ4zaWfUw_XcAr79QejY-930Gj6JbFxH_lnSmY-4FZjXKpodnNcR59lRWQXwAAAA=="
                    },
                    "error": false,
                    "errorCode": 0
                }
                `;
                break;
            case 'spaNewUser':
                response = `
                {
                    "error": true,
                    "errorCode": 9999,
                    "errorMessage": "user already exists"
                }
                `;
                break;
            default:
                response = '';
        }
        return res(
            ctx.delay(),
            ctx.json(JSON.parse(response))
        );
    }),

];

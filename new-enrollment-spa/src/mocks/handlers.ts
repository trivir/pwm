import { rest } from 'msw';

const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQSflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const handlers = [
    rest.post('/pwm/public/newuser?processAction=sendOTP', (_, res, ctx) => {
        const response = `
        {
            "data": {
                "token": "H4sIAAAAAAAAAAE_AMD_UFdNLkdDTTEQld3JuMlD5tpm5-ZtFzs1RLZFY_TP5I6A5g1GMndv2PupeAjrSpWMk1BJH0k3YuHAw1pIj-QYnOFyJD8AAAA="
            },
            "error": false,
            "errorCode": 0
        }
        `;

        return res(
            ctx.delay(),
            ctx.json(JSON.parse(response))
        );
    }),

    rest.post('/pwm/public/newuser?processAction=verifyOTP', (_, res, ctx) => {
        const response = `
        {
            "data": {
                "token": "H4sIAAAAAAAAAAFfAKD_UFdNLkdDTTEQld3JuMlD5tpm5-ZtFzs1OeVtIKLP-9PhyWWtJQmpM_CixGIln4LAZTbaxpS8o0lZ4zaWfUw_XcAr79QejY-930Gj6JbFxH_lnSmY-4FZjXKpodnNcR59lRWQXwAAAA=="
            },
            "error": false,
            "errorCode": 0
        }
        `;

        return res(
            ctx.delay(),
            ctx.json(JSON.parse(response))
        );
    }),

    rest.post('/pwm/public/newuser?processAction=spaNewUser', (req, res, ctx) => {
        return res(
            ctx.delay(),
            ctx.json(req.body)
        );
    })
];

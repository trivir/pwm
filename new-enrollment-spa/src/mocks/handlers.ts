import { rest } from 'msw';
import { PwmRestResult } from 'src/app/models/pwm-rest-result';

export const handlers = [
  rest.get('/public/newuser', (req, res, ctx) => {
    const processAction = req.url.searchParams.get('processAction');
    if (processAction) {
      const response = getResponses[processAction] || getResponses['default'];
      return res(
        ctx.delay(),
        ctx.json(response)
      );
    }

    return res();
  }),

  rest.post('/public/newuser', (req, res, ctx) => {
    const processAction = req.url.searchParams.get('processAction');
    if (processAction) {
      const response = postResponses[processAction] || postResponses['default'];
      return res(
        ctx.delay(),
        ctx.json(response)
      );
    }

    return res();
  }),

  rest.post('/public/command', (req, res, ctx) => {
    const processAction = req.url.searchParams.get('processAction');
    if (processAction) {
      const response: PwmRestResult<string> = {
        error: false,
        errorCode: 0,
        data: 'https://google.com'
      };
      return res(
        ctx.delay(),
        ctx.json(response)
      );
    }

    return res();
  })
];

const postResponses: { [action: string]: PwmRestResult<any> } = {
  'sendOTP': {
    data: {
      token: 'H4sIAAAAAAAAAAE_AMD_UFdNLkdDTTEQld3JuMlD5tpm5-ZtFzs1RLZFY_TP5I6A5g1GMndv2PupeAjrSpWMk1BJH0k3YuHAw1pIj-QYnOFyJD8AAAA='
    },
    error: false,
    errorCode: 0
  },
  'verifyOTP': {
    data: {
      token: 'H4sIAAAAAAAAAAFfAKD_UFdNLkdDTTEQld3JuMlD5tpm5-ZtFzs1OeVtIKLP-9PhyWWtJQmpM_CixGIln4LAZTbaxpS8o0lZ4zaWfUw_XcAr79QejY-930Gj6JbFxH_lnSmY-4FZjXKpodnNcR59lRWQXwAAAA=='
    },
    error: false,
    errorCode: 0
  },
  // 'verifyOTP': {
  //   error: true,
  //   errorCode: 5037 // Incorrect token
  // },
  'checkUnique': {
    data: true,
    error: false,
    errorCode: 0,
  },
  'checkRules': {
    data: {
      passed: true,
      message: "Not compliant with password rules"
    },
    error: false,
    errorCode: 0,
  },
  'spaCreateNewUser': {
    error: false,
    errorCode: 0,
    data: {}
  },
  'default': {
    error: true,
    errorCode: -1,
    errorMessage: 'Unknown process action'
  }
}

const getResponses: { [action: string]: PwmRestResult<any> } = {
  'formSchema': {
    data: {
      fieldConfigs: [
        {
          name: 'mail',
          minimumLength: 1,
          maximumLength: 64,
          type: 'email',
          required: true,
          confirmationRequired: false,
          readonly: false,
          unique: true,
          multivalue: false,
          labels: {
            '': 'Email Address'
          },
          regexErrors: {
            '': 'Email Address has invalid characters'
          },
          description: {
            '': ''
          },
          regex: "^[a-zA-Z0-9 .,'@]*$",
          placeholder: 'username@example.com',
          selectOptions: {},
          maximumSize: 0
        },
        {
          name: 'givenName',
          minimumLength: 1,
          maximumLength: 64,
          type: 'text',
          required: true,
          confirmationRequired: false,
          readonly: false,
          unique: false,
          multivalue: false,
          labels: {
            '': 'First Name'
          },
          regexErrors: {
            '': ''
          },
          description: {
            '': ''
          },
          regex: "^[a-zA-Z0-9 .,'@]*$",
          selectOptions: {},
          maximumSize: 0
        },
        {
          name: 'sn',
          minimumLength: 1,
          maximumLength: 64,
          type: 'text',
          required: true,
          confirmationRequired: false,
          readonly: false,
          unique: false,
          multivalue: false,
          labels: {
            '': 'Last Name'
          },
          regexErrors: {
            '': ''
          },
          description: {
            '': ''
          },
          regex: "^[a-zA-Z0-9 .,'@]*$",
          selectOptions: {},
          maximumSize: 0
        }
      ],
      passwordRules: [
        'Password is case sensitive.',
        'Must be at least 4 characters long.',
        'Must be no more than 12 characters long.',
        'Must not include any of the following values:  password test',
        'Must not include a common word or commonly used sequence of characters.',
        'Must not include part of your name or user name.'
      ],
      redirectUrl: 'https://google.com',
      userAgreement: 'about:blank',
      userPrivacyAgreement: 'about:blank',
      fieldsForVerification: {
        'mail': 'email'
      },
      promptForPassword: true,
      dynamicRedirect: true
    },
    error: false,
    errorCode: 0
  },
  'default': {
    error: true,
    errorCode: -1,
    errorMessage: 'Unknown process action'
  }
}

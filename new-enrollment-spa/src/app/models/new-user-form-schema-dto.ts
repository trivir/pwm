import { FormConfig } from "src/app/models/form-config";

export type VerificationMethod =
  | 'email'
  | 'sms'

export interface NewUserFormSchemaDto {
  fieldConfigs: FormConfig[],
  passwordRules: string[],
  redirectUrl: string,
  userAgreement: string,
  userPrivacyAgreement: string,
  promptForPassword: boolean,
  fieldsForVerification: Record<string, VerificationMethod>,
  dynamicRedirect: boolean
}

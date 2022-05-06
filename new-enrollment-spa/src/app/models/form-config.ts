export type FormConfigType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'random'
  | 'tel'
  | 'hidden'
  | 'url'
  | 'select'
  | 'checkbox'

  // | 'date'
  // | 'datetime'
  // | 'photo'
  // | 'month'
  // | 'time'
  // | 'week'
  // | 'userDN'

export type FormConfigSource =
  | 'ldap'
  | 'remote'
  // | 'bogus'

export interface FormConfig {
  name: string
  labels: Record<string, string>
  type: FormConfigType

  description: Record<string, string>
  required: boolean
  confirmationRequired: boolean
  readonly: boolean
  unique: boolean
  minimumLength: number
  maximumLength: number
  regex: string
  regexErrors: Record<string, string>
  placeholder: string
  selectOptions: Record<string, string>
  source: FormConfigSource

  /**
   * @deprecated
   */
   javascript: string

  // multivalue: boolean
  // mimeTypes: string[]
  // maximumSize: number
}

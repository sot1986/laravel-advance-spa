export interface RegisterCredentialsI {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginCredentialsI {
  email: string
  password: string
}

export interface UserI {
  name: string
  email: string
  avatar?: string
}

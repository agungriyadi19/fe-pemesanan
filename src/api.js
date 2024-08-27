// export const apiURl = 'http://localhost:8081'
export const apiURl = 'https://inevitable-imogen-studenttest-64f4521b.koyeb.app'

export const Endpoints = {
  login: `${apiURl}/api/auth/login`,
  logout: `${apiURl}/api/auth/logout`,
  session: `${apiURl}/api/auth/session`,
  menu: `${apiURl}/api/menus`,
  user: `${apiURl}/api/users`,
  order: `${apiURl}/api/orders`,
  category: `${apiURl}/api/categories`,
  role: `${apiURl}/api/roles`,
  status: `${apiURl}/api/statuses`,
  setting: `${apiURl}/api/settings`,
  scan: `${apiURl}/api/customer/check-radius`,
  checkCode: `${apiURl}/api/customer/check-code`,
}

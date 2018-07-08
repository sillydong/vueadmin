const getters = {
  id: state => state.user.id,
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  roles: state => state.user.roles,
  token: state => state.user.token
}
export default getters

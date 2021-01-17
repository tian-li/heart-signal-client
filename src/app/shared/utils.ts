import * as dayjs from 'dayjs';


export function saveUserToLocalStorage({username, userRole, roomNumber}) {

  const expireDate = dayjs().add(1, 'd').valueOf();

  localStorage.setItem('username', JSON.stringify({value: username, expireDate}));
  localStorage.setItem('roomNumber', JSON.stringify({value: roomNumber, expireDate}));
  localStorage.setItem('userRole', JSON.stringify({value: userRole, expireDate}));
}

export function getUserFromLocalStorage() {
  const now = dayjs();
  const prevUsernameInfo = localStorage.getItem('username');
  const prevUserRoleInfo = localStorage.getItem('userRole');
  const prevRoomNumberInfo = localStorage.getItem('roomNumber');

  if (!!prevUsernameInfo && !!prevUserRoleInfo && !!prevRoomNumberInfo) {
    const username = extractValue(JSON.parse(prevUsernameInfo), now);
    const userRole = extractValue(JSON.parse(prevUserRoleInfo), now);
    const roomNumber = extractValue(JSON.parse(prevRoomNumberInfo), now);

    if (!!username && !!userRole && !!roomNumber) {
      return {
        username,
        userRole,
        roomNumber
      }
    }
  }

  return null;

}

export function clearLocalUser() {
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  localStorage.removeItem('roomNumber');
}

function extractValue({value, expireDate}, now) {

  if (dayjs(expireDate).isAfter(now)) {
    return value
  } else {
    return null;
  }
}

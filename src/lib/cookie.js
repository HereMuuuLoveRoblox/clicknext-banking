export function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`
}

export function getCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function removeCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`
}

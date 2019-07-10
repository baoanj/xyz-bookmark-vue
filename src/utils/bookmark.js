export function getChildrenBookmark(id) {
  // chrome.bookmarks.getChildren(string id, function callback)
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getChildren(id, data => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}

export function searchBookmark(str) {
  // chrome.bookmarks.search(string or object query, function callback)
  return new Promise((resolve, reject) => {
    chrome.bookmarks.search(str, data => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}

export function moveBookmark(id, destination) {
  // chrome.bookmarks.move(string id, object destination, function callback)
  return new Promise((resolve, reject) => {
    chrome.bookmarks.move(id, destination, data => {
      if (data) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}

export function removeBookmark(id) {
  // chrome.bookmarks.remove(string id, function callback)
  return new Promise(resolve => {
    chrome.bookmarks.remove(id, () => {
      resolve()
    })
  })
}

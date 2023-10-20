export function saveList(arr, keyName) {
  localStorage.setItem(keyName, JSON.stringify(arr))
}

export function getNewId(arr) {
  let max = 0;
  for (const item of arr) {
      // Если id у объекта в массиве больше нуля,
      // оставляем его и к нему прибавляем 1
      if (item.id > 0) {
          max = item.id;
      }
  }
  return max + 1;
}

export function getItem(key: string){
  const item = localStorage.getItem(key);
  const parsedItem = typeof item === 'string' && JSON.parse(item);
  return parsedItem
}
export function getItem(key: string){
  const item = localStorage.getItem(key);
  const parsedItem = item !== null && (typeof item === 'string' ? item : JSON.parse(item));
  return parsedItem
}
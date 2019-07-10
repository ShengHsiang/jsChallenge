/**
 * 生成一個不重複的隨機數
 */
export function createRandomId() {
  return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
}
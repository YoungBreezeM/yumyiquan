/*
 * @Author: your name
 * @Date: 2021-02-03 18:24:50
 * @LastEditTime: 2021-02-03 18:44:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/utils/bugua.js
 */


const createdTF = () => {
  return Math.round(Math.random());
};


export default function createdOneGua () {
  let gua = [createdTF(), createdTF(), createdTF()];
  let count = 0;
  //console.log(gua);
  gua.forEach(item => {
    count += item;
  });
  return {
    TF: count <= 1 ? 0 : 1,
    Type: (count === 0 || count === 3) && true
  }
};

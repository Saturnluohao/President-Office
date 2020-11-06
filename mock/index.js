import Mock from 'mockjs'
import data from "./data";

Mock.mock('/circle_pack_data', 'get', () => {
  return data.circle_pack_data;
})

import Mock from 'mockjs'
import data from "./data";

Mock.mock('/circle_pack_data', 'get', () => {
  return data.circle_pack_data;
});

Mock.mock('/relations', 'get', () => {
  return data.relations;
})

Mock.mock('/extra_candidates', 'get', () => {
  return data.extra_candidates;
})

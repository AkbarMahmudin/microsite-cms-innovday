import { _mock } from "./_mock";

export const _categoryList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.categoryNames(index),
  slug: _mock.categoryNames(index).toLowerCase().replace(/ /g, '-'),
}));

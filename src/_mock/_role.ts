import { _mock } from "./_mock";

export const _roleList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.roleNames(index),
}));

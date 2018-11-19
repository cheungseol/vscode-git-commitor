// 提示问题
export const QUESTIONS = {
    type: '请选择本次提交内容类型',
    scope: '请输入本次提交涉及变动的目录或文件',
    title: '请输入本次改动的一个简明扼要的概述',
    description: '较为详细的描述 (optional). 使用"|" 换行',
    refer: '请输入本次code review的同事邮箱前缀'
};

export const COMMIT_TYPES = [
    {
      value: 'feat',
      name: 'New feature'
    },
    {
      value: 'fix',
      name: 'Bug fix'
    },
    {
      value: 'docs',
      name: 'Documentation'
    },
    {
      value: 'style',
      name: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'refactor',
      name: 'Code changes that neither fix a bug nor add a feature'
    },
    {
      value: 'perf',
      name: 'Improve performance'
    },
    {
      value: 'test',
      name: 'Adding missing tests or correcting existing tests'
    },
    {
      value: 'build',
      name: 'Changes that affect the build system or external dependencies'
    },
    {
      value: 'chore',
      name: 'Other changes that don\'t modify src or test files'
    }
];
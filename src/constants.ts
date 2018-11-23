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
      name: 'Feature'
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
      name: 'Formatting, missing semi colons, …'
    },
    {
      value: 'refactor',
      name: 'Breaking change'
    },
    {
      value: 'test',
      name: 'Adding missing tests'
    },
    {
      value: 'build',
      name: 'Affect the build system or external dependencies'
    },
    {
      value: 'chore',
      name: 'Maintain'
    }
];
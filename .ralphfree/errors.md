# Homepage Redesign Errors

## bianpai-skill orchestrator 失败
- `claude --skill` 不是有效 CLI 选项，orchestrator.sh 无法调用 skill
- 解决：改为手动在对话中逐个调用 skill + ralphfree 循环

(no other errors yet)

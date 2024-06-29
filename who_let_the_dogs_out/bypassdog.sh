
#!/bin/bash

# 找到 watchdogd 进程
watchdog_pid=$(ps aux | grep watchdogd | grep -v grep | awk '{print $2}')

# 检查是否找到 watchdogd 进程
if [ -z "$watchdog_pid" ]; then
  echo "watchdogd 进程未找到"
  exit 1
fi

# 杀掉 watchdogd 进程
kill -9 $watchdog_pid
echo "watchdogd 进程已杀掉，PID: $watchdog_pid"

# 运行 ./who_let_the_dogs_out
./who_let_the_dogs_out

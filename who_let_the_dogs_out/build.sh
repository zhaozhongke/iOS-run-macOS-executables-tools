#!/bin/sh
set -e
clang -Os -target arm64-apple-ios12.0 -Wall \
	-isysroot "$(xcrun --sdk iphoneos --show-sdk-path)" \
	-o who_let_the_dogs_out \
	who_let_the_dogs_out.c \
	-framework IOKit

# 这里需要用这个重新签名，以获取权限 . 
ldid -Sreal.entitlements who_let_the_dogs_out
# 之后拷贝到设备上运行 
# chmod +x who_let_the_dogs_out
# sh ./bypassdog.sh

# 在设备 console 中会打印出：
# 默认	16:17:29.667201+0800	watchdogd	719661612356458: retrieved current device boot-args:
# 默认	16:17:29.667304+0800	watchdogd	719661614045250: connected to watchdog KEXT
# 默认	16:17:29.671231+0800	watchdogd	719661617909458: userspace monitoring disabled

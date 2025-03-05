---
title: "Callback (Private project)"
description: "Application to generate asterisk call files"
date: "Dec 01 2023"
---

This project can be considered my first assignment project at Fetg.uz. The initial version was quite messy and full of bugs. In the first version, I manually generated phone numbers and even handled calls programmatically. However, in the current version, I only generate .call files, and Asterisk takes care of the rest, making the system much more efficient and intelligent.

I won’t hide it— the call range is 10,000. This means I generate 10,000 files at once, and Asterisk processes them one by one, making the calls sequentially.

Tech stack: Javascript, Nodejs, Asterisk (PBX), Mongodb, Websocket (via socket.io)

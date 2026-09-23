@echo off
chcp 65001 > nul
title Aether Calendar AI Web 실행기
cls
echo ========================================================
echo   📅 Aether Calendar AI (HTML/웹 버전) 실행 중...
echo ========================================================
echo.
echo 웹 브라우저에서 캘린더 프로그램을 시작합니다.
echo 잠시만 기다려주세요...
echo.

start "" "%~dp0index.html"

echo 실행되었습니다. 브라우저 창을 확인해 주세요!
echo (이 창은 3초 후 자동으로 닫힙니다)
timeout /t 3 /nobreak > nul
exit

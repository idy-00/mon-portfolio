@echo off
cd /d "C:\Users\RYZEN  5\portfolio"
call npm run sync-projects >> logs\auto-sync.log 2>&1
